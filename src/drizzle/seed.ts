import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless'; // 'neon' function is correct here
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';

import { hash } from 'bcrypt';

import * as schema from './schema'; // Adjust this path to your schema file

// Load environment variables from .env file
config({ path: '.env' });

const seed = async () => {
    // Ensure DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
        console.error('DATABASE_URL is not set in environment variables.');
        process.exit(1);
    }

    // Initialize Drizzle ORM with Neon
    const sql = neon(process.env.DATABASE_URL);
    const db: NeonHttpDatabase<typeof schema> = drizzle(sql, { schema });

    console.log('🌱 Seeding database...');

    try {
        // --- Clear existing data (optional, for development) ---
        console.log('🗑️ Clearing existing data...');
        // Order of deletion matters due to foreign key constraints
        await db.delete(schema.paymentsTable);
        await db.delete(schema.prescriptionsTable);
        await db.delete(schema.complaintsTable);
        await db.delete(schema.appointmentsTable);
        await db.delete(schema.doctorsTable);
        await db.delete(schema.patientsTable);
        await db.delete(schema.userTable);
        console.log('🗑️ Data cleared.');

        // --- Insert Users ---
        console.log('👥 Inserting users...');
        const hashedPassword1 = await hash('password123', 10);
        const hashedPassword2 = await hash('password456', 10);
        const hashedPassword3 = await hash('password789', 10);
        const hashedPassword4 = await hash('passwordABC', 10);
        const hashedPassword5 = await hash('passwordDEF', 10);

        const users = await db.insert(schema.userTable).values([
            {
                firstName: 'Alice',
                lastName: 'Smith',
                email: 'alice.smith@example.com',
                password: hashedPassword1,
                contactPhone: '0712345678',
                address: '123 Main St',
                userType: 'patient',
            },
            {
                firstName: 'Bob',
                lastName: 'Johnson',
                email: 'bob.johnson@example.com',
                password: hashedPassword2,
                contactPhone: '0723456789',
                address: '456 Oak Ave',
                userType: 'doctor',
            },
            {
                firstName: 'Charlie',
                lastName: 'Brown',
                email: 'charlie.brown@example.com',
                password: hashedPassword3,
                contactPhone: '0734567890',
                address: '789 Pine Ln',
                userType: 'patient',
            },
            {
                firstName: 'Diana',
                lastName: 'Prince',
                email: 'diana.prince@example.com',
                password: hashedPassword4,
                contactPhone: '0745678901',
                address: '101 Hero Blvd',
                userType: 'doctor',
            },
            {
                firstName: 'Eve',
                lastName: 'Adams',
                email: 'eve.adams@example.com',
                password: hashedPassword5,
                contactPhone: '0756789012',
                address: '202 Mystery Rd',
                userType: 'admin',
            },
        ]).returning({ userId: schema.userTable.userId, userType: schema.userTable.userType });
        console.log('👥 Users inserted.');

         const patientUser1 = users.find(u => u.userType === 'patient' && u.userId === 1);
        const patientUser2 = users.find(u => u.userType === 'patient' && u.userId === 3);
        const doctorUser1 = users.find(u => u.userType === 'doctor' && u.userId === 2);
        const doctorUser2 = users.find(u => u.userType === 'doctor' && u.userId === 4);

        if (!patientUser1 || !patientUser2 || !doctorUser1 || !doctorUser2) {
            console.error('Failed to find required user IDs after insertion.');
            process.exit(1);
        }

        // --- Insert Patients ---
        console.log('🤕 Inserting patients...');
        const patients = await db.insert(schema.patientsTable).values([
            {
                userId: patientUser1.userId,
                firstName: 'Alice',
                lastName: 'Smith',
                contactPhone: '0712345678',
            },
            {
                userId: patientUser2.userId,
                firstName: 'Charlie',
                lastName: 'Brown',
                contactPhone: '0734567890',
            },
            {
                userId: null, // Example of a patient not linked to a userTable entry (if allowed by schema)
                firstName: 'Grace',
                lastName: 'Hopper',
                contactPhone: '0767890123',
            },
        ]).returning({ patientId: schema.patientsTable.patientId });
        console.log('🤕 Patients inserted.');

        const patientId1 = patients[0]?.patientId;
        const patientId2 = patients[1]?.patientId;
        const patientId3 = patients[2]?.patientId; // Grace Hopper

        if (!patientId1 || !patientId2 || !patientId3) {
            console.error('Failed to get patient IDs.');
            process.exit(1);
        }

        // --- Insert Doctors ---
        console.log('🩺 Inserting doctors...');
        const doctors = await db.insert(schema.doctorsTable).values([
            {
                userId: doctorUser1.userId,
                firstName: 'Bob',
                lastName: 'Johnson',
                specialization: 'Cardiology',
                contactPhone: '0723456789',
                isAvailable: true,
                availability: [
                    { day: 'Monday', slots: ['09:00', '10:00', '11:00'] },
                    { day: 'Tuesday', slots: ['14:00', '15:00'] }
                ],
            },
            {
                userId: doctorUser2.userId,
                firstName: 'Diana',
                lastName: 'Prince',
                specialization: 'Pediatrics',
                contactPhone: '0745678901',
                isAvailable: true,
                availability: [
                    { day: 'Wednesday', slots: ['09:00', '10:00', '11:00'] },
                    { day: 'Friday', slots: ['13:00', '14:00'] }
                ],
            },
            {
                userId: null, // Example of a doctor not linked to a userTable entry (if allowed by schema)
                firstName: 'Eva',
                lastName: 'Green',
                specialization: 'Dermatology',
                contactPhone: '0778901234',
                isAvailable: false,
                availability: [],
            },
        ]).returning({ doctorId: schema.doctorsTable.doctorId });
        console.log('🩺 Doctors inserted.');

        const doctorId1 = doctors[0]?.doctorId;
        const doctorId2 = doctors[1]?.doctorId;
        const doctorId3 = doctors[2]?.doctorId;

        if (!doctorId1 || !doctorId2 || !doctorId3) {
            console.error('Failed to get doctor IDs.');
            process.exit(1);
        }

        // --- Insert Appointments ---
        console.log('🗓️ Inserting appointments...');
        const appointments = await db.insert(schema.appointmentsTable).values([
            {
                patientId: patientId1,
                doctorId: doctorId1,
                appointmentDate: '2025-08-10',
                timeSlot: '10:00',
                startTime: '10:00',
                endTime: '10:30',
                totalAmount: '150.00',
                reason: 'Routine check-up',
                appointmentStatus: 'confirmed',
            },
            {
                patientId: patientId2,
                doctorId: doctorId2,
                appointmentDate: '2025-08-11',
                timeSlot: '14:00',
                startTime: '14:00',
                endTime: '14:45',
                totalAmount: '200.00',
                reason: 'Child vaccination',
                appointmentStatus: 'pending',
            },
            {
                patientId: patientId1,
                doctorId: doctorId1,
                appointmentDate: '2025-08-12',
                timeSlot: '09:00',
                startTime: '09:00',
                endTime: '09:30',
                totalAmount: '150.00',
                reason: 'Follow-up for blood pressure',
                appointmentStatus: 'completed',
            },
        ]).returning({ appointmentId: schema.appointmentsTable.appointmentId });
        console.log('🗓️ Appointments inserted.');

        const appointmentId1 = appointments[0]?.appointmentId;
        const appointmentId2 = appointments[1]?.appointmentId;
        const appointmentId3 = appointments[2]?.appointmentId;

        if (!appointmentId1 || !appointmentId2 || !appointmentId3) {
            console.error('Failed to get appointment IDs.');
            process.exit(1);
        }

        // --- Insert Prescriptions ---
        console.log('💊 Inserting prescriptions...');
        await db.insert(schema.prescriptionsTable).values([
            {
                appointmentId: appointmentId1,
                doctorId: doctorId1,
                patientId: patientId1,
                notes: 'Prescribed medication for high blood pressure. Follow up in 2 weeks.',
                issueDate: new Date('2025-08-10T10:35:00Z'),
                expiryDate: new Date('2025-09-10T10:35:00Z'),
            },
            {
                appointmentId: appointmentId2,
                doctorId: doctorId2,
                patientId: patientId2,
                notes: 'Routine vaccines administered. Provided growth chart and dietary advice.',
                issueDate: new Date('2025-08-11T14:50:00Z'),
                expiryDate: null, // Optional expiry
            },
            {
                appointmentId: appointmentId3,
                doctorId: doctorId1,
                patientId: patientId1,
                notes: 'Blood pressure stable. Continue current medication. Next check-up in 3 months.',
                issueDate: new Date('2025-08-12T09:40:00Z'),
                expiryDate: new Date('2025-11-12T09:40:00Z'),
            },
        ]);
        console.log('💊 Prescriptions inserted.');

        // --- Insert Payments ---
        console.log('💰 Inserting payments...');
        await db.insert(schema.paymentsTable).values([
            {
                appointmentId: appointmentId1,
                totalAmount: '150.00',
                PaymentStatus: 'completed',
                transactionId: 'TXN1234567890ABC',
                paymentDate: new Date('2025-08-10T10:45:00Z'),
            },
            {
                appointmentId: appointmentId2,
                totalAmount: '200.00',
                PaymentStatus: 'pending',
                transactionId: 'TXN0987654321DEF',
                paymentDate: new Date('2025-08-11T15:00:00Z'),
            },
            {
                appointmentId: appointmentId3,
                totalAmount: '150.00',
                PaymentStatus: 'completed',
                transactionId: 'TXNABCDEF0123456',
                paymentDate: new Date('2025-08-12T09:50:00Z'),
            },
        ]);
        console.log('💰 Payments inserted.');

        // --- Insert Complaints ---
        console.log('📝 Inserting complaints...');
        await db.insert(schema.complaintsTable).values([
            {
                userId: patientUser1.userId,
                relatedAppointmentId: appointmentId1,
                subject: 'Late start for appointment',
                description: 'Doctor was 15 minutes late for my appointment on 2025-08-10.',
                complaintStatus: 'Open',
                createdAt: new Date('2025-08-10T11:00:00Z'),
            },
            {
                userId: patientUser2.userId,
                relatedAppointmentId: appointmentId2,
                subject: 'Billing discrepancy',
                description: 'The amount charged was higher than what was quoted during booking.',
                complaintStatus: 'In Progress',
                createdAt: new Date('2025-08-11T16:00:00Z'),
            },
            {
                userId: doctorUser1.userId, // Example: Doctor complaining about patient
                relatedAppointmentId: null, // Not related to a specific appointment
                subject: 'System slowness',
                description: 'The system has been very slow today, affecting patient records access.',
                complaintStatus: 'Open',
                createdAt: new Date('2025-08-12T08:30:00Z'),
            },
        ]);
        console.log('📝 Complaints inserted.');


        console.log('✅ Seeding complete!');

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    } finally {
        // Close the connection if necessary (Neon http client might not need explicit close)
        // If using `pg-driver` instead of `neon-http`, you might need `sql.end()`
        // For neon-http, the connection is stateless, so no explicit close needed.
    }
};

seed();