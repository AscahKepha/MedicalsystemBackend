// src/controllers/pay.controller.ts

import { Request, Response } from 'express';
import { stripe } from './stripe';
import db from '../drizzle/db';
import { eq, sql } from 'drizzle-orm';
import { appointmentsTable, paymentsTable } from '../drizzle/schema';
import { randomUUID } from 'crypto';

// POST /api/payment/checkout
export const createCheckoutSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { appointmentId, paymentMethod } = req.body;

    console.log('[Checkout] 🚀 Initiating payment...');
    console.log('[Checkout] Received:', { appointmentId, paymentMethod });

    if (!appointmentId || !paymentMethod) {
      console.warn('[Checkout] ❌ Missing appointmentId or paymentMethod');
      res.status(400).json({ error: 'Missing appointmentId or paymentMethod' });
      return;
    }

    const frontendUrl = process.env.FRONTEND_URL;
    if (!frontendUrl) {
      console.error('[Checkout] ❌ FRONTEND_URL missing in environment variables');
      res.status(500).json({ error: 'Server misconfiguration: FRONTEND_URL is missing' });
      return;
    }

    // Fetch appointment
    const [appointment] = await db
      .select()
      .from(appointmentsTable)
      .where(eq(appointmentsTable.appointmentId, appointmentId));

    if (!appointment) {
      console.warn(`[Checkout] ❌ Appointment not found for ID: ${appointmentId}`);
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }

    console.log('[Checkout] ✅ Appointment found:', appointment);

    const amount = Number(appointment.totalAmount);
    if (!amount || amount <= 0) {
      console.warn('[Checkout] ❌ Invalid appointment amount:', appointment.totalAmount);
      res.status(400).json({ error: 'Invalid appointment amount' });
      return;
    }

    const doctorId = appointment.doctorId ?? 'Unknown';

    // === CASH ===
    if (paymentMethod === 'cash') {
      console.log('[Checkout] 💵 Cash payment selected. Updating appointment status...');
      await db
        .update(appointmentsTable)
        .set({
          appointmentStatus: 'confirmed',
          updatedAt: sql`now()`
        })
        .where(eq(appointmentsTable.appointmentId, appointmentId));

      console.log('[Checkout] ✅ Appointment status updated to confirmed.');
      res.status(200).json({ message: 'Cash payment selected. Pay at appointment.' });
      return;
    }

    // === STRIPE ===
    if (paymentMethod === 'stripe') {
      const transactionId = randomUUID();
      console.log('[Checkout] 💳 Stripe payment selected.');
      console.log('[Checkout] 🔧 Creating Stripe session...');
      console.log(`[Checkout] 💰 Charging amount: $${amount.toFixed(2)}`);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Appointment with Doctor ID: ${doctorId}`,
              },
              unit_amount: Math.round(amount * 100),
            },
            quantity: 1,
          },
        ],
        metadata: {
          appointmentId: appointment.appointmentId.toString(),
          transactionId,
        },
        success_url: `${frontendUrl}/user/payment-success`,
        cancel_url: `${frontendUrl}/user/payment-cancel`,
      });

      console.log('[Checkout] ✅ Stripe session created:', session.id);
      console.log('[Checkout] 💾 Inserting payment record into DB...');

      await db.insert(paymentsTable).values({
        appointmentId: appointment.appointmentId,
        totalAmount: amount.toFixed(2),
        PaymentStatus: 'pending',
        transactionId,
        paymentMethod: 'stripe',
        // timestamps handled by defaultNow()
      });

      console.log('[Checkout] ✅ Payment record inserted.');
      console.log('[Checkout] 📌 Marking appointment as pending...');

      await db
        .update(appointmentsTable)
        .set({
          appointmentStatus: 'pending',
          updatedAt: sql`now()` // ✅ Prevents toISOString error
        })
        .where(eq(appointmentsTable.appointmentId, appointmentId));

      console.log('[Checkout] ✅ Appointment status updated to pending.');
      console.log('[Checkout] 🔁 Returning Stripe session URL...');

      res.status(200).json({ url: session.url });
      return;
    }

    console.warn('[Checkout] ❌ Unsupported payment method:', paymentMethod);
    res.status(400).json({ error: `Unsupported payment method: ${paymentMethod}` });
  } catch (error: any) {
    console.error('[Payment Error]', {
      message: error.message,
      stack: error.stack,
      raw: error.raw,
    });

    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};
