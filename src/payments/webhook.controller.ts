// src/controllers/pay.controller.ts

import type { Request, Response } from 'express';
import Stripe from 'stripe';
import { stripe } from './stripe';
import db from '../drizzle/db';
import {
    appointmentsTable,
    paymentsTable,
    userTable,
} from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { sendNotificationEmail } from '../middleware/nodemailer';

export const handleStripeWebhook = async (req: Request, res: Response): Promise<void> => {
    const isDev = process.env.NODE_ENV === 'development';
    let event: Stripe.Event;

    // Step 1: Verify Webhook Signature (skip in dev)
    if (isDev) {
        event = req.body as Stripe.Event;
        console.log('[DEV Webhook] 🔧 Skipping signature verification.');
    } else {
        const signature = req.headers['stripe-signature'] as string | undefined;

        if (!signature) {
            console.error('[Stripe Webhook] ❌ Missing Stripe-Signature header.');
            res.status(400).send('Missing Stripe signature');
            return;
        }

        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET as string
            );
        } catch (err) {
            console.error('[Stripe Webhook] ❌ Signature verification failed:', err);
            res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
            return;
        }
    }

    console.log(`[Webhook] ✅ Event received: ${event.type}`);

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        console.log('[Webhook] 🔍 Stripe session data:', JSON.stringify(session, null, 2));

        try {
            const appointmentId = parseInt(session.metadata?.appointmentId || '');
            const transactionId = session.metadata?.transactionId || session.id;
            const amount = (session.amount_total || 0) / 100;

            if (!appointmentId || !transactionId) {
                throw new Error('Missing appointmentId or transactionId in metadata.');
            }

            // Check if payment already recorded
            const [existing] = await db
                .select()
                .from(paymentsTable)
                .where(eq(paymentsTable.transactionId, transactionId));

            if (existing) {
                console.log(`[Webhook] ⚠️ Duplicate payment (${transactionId}), skipping.`);
                res.status(200).json({ received: true });
                return;
            }

            // Insert payment record
            await db.insert(paymentsTable).values({
                appointmentId,
                transactionId,
                totalAmount: amount.toFixed(2),
                PaymentStatus: 'completed',
                paymentMethod: 'stripe',
            });

            // ✅ Update appointment to COMPLETED
            await db
                .update(appointmentsTable)
                .set({ appointmentStatus: 'completed' })
                .where(eq(appointmentsTable.appointmentId, appointmentId));

            // Get appointment for user lookup
            const [appointment] = await db
                .select()
                .from(appointmentsTable)
                .where(eq(appointmentsTable.appointmentId, appointmentId));

            if (!appointment) {
                console.warn(`[Webhook] ⚠️ Appointment ${appointmentId} not found`);
                res.status(200).json({ received: true });
                return;
            }

            // Get user (patient)
            const [user] = await db
                .select()
                .from(userTable)
                .where(eq(userTable.userId, appointment.patientId!));

            if (user) {
                await sendNotificationEmail(
                    user.email!,
                    `${user.firstName} ${user.lastName}`,
                    '🧾 Payment Confirmation - Aura Health',
                    `
            <p>Dear ${user.firstName},</p>
            <p>Your payment of <strong>$${amount.toFixed(2)}</strong> for appointment #${appointmentId} has been successfully processed.</p>
            <p>Your appointment is now <strong>Completed</strong>.</p>
            <p>Thank you for choosing <strong>Aura Health</strong>.</p>
          `
                );
            } else {
                console.warn(`[Webhook] ⚠️ No user found for patientId: ${appointment.patientId}`);
            }

            console.log('[Webhook] ✅ Payment recorded, appointment completed, email sent.');
        } catch (err) {
            console.error('[Webhook] ❌ Failed to process event:', err);
            res.status(500).json({ error: 'Webhook processing failed' });
            return;
        }
    } else {
        console.log(`[Webhook] ⚠️ Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
};
