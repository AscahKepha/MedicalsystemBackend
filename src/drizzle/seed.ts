// // seed.ts
// import db from "./db";
// import {
//     userTable,
//     doctorsTable,
//     doctorAvailabilityTable,
//     patientsTable,
//     appointmentsTable,
//     paymentsTable,
//     complaintsTable,
// } from "./schema";

// async function seed() {
//     // Step 1: Clear existing data
//     await db.delete(complaintsTable);
//     await db.delete(paymentsTable);
//     await db.delete(appointmentsTable);
//     await db.delete(doctorAvailabilityTable);
//     await db.delete(doctorsTable);
//     await db.delete(patientsTable);
//     await db.delete(userTable);

//     // Step 2: Insert Users
//     const users = await db.insert(userTable).values([
//         {
//             firstName: "John",
//             lastName: "Doe",
//             email: "john.doe@example.com",
//             password: "hashed_password_1",
//             contactPhone: "1234567890",
//             address: "123 Elm Street",
//             userType: "patient",
//         },
//         {
//             firstName: "Alice",
//             lastName: "Smith",
//             email: "alice.smith@example.com",
//             password: "hashed_password_2",
//             contactPhone: "2345678901",
//             address: "456 Oak Avenue",
//             userType: "doctor",
//         },
//         {
//             firstName: "Bob",
//             lastName: "Brown",
//             email: "bob.brown@example.com",
//             password: "hashed_password_3",
//             contactPhone: "3456789012",
//             address: "789 Pine Lane",
//             userType: "admin",
//         },
//     ]).returning({ userId: userTable.userId });

//     // Step 3: Insert Patients
//     const patients = await db.insert(patientsTable).values([
//         {
//             userId: users[0].userId,
//             firstName: "John",
//             lastName: "Doe",
//             contactPhone: "1234567890",
//         },
//         {
//             userId: users[2].userId,
//             firstName: "Bob",
//             lastName: "Brown",
//             contactPhone: "3456789012",
//         },
//         {
//             userId: users[1].userId,
//             firstName: "Alice",
//             lastName: "Smith",
//             contactPhone: "2345678901",
//         },
//     ]).returning({ patientId: patientsTable.patientId });

//     // Step 4: Insert Doctors
//     const doctors = await db.insert(doctorsTable).values([
//         {
//             userId: users[1].userId,
//             firstName: "Alice",
//             lastName: "Smith",
//             specialization: "Cardiology",
//             contactPhone: "2345678901",
//             isAvailable: true,
//             defaultSlotDuration: 30,
//         },
//         {
//             userId: users[2].userId,
//             firstName: "Bob",
//             lastName: "Brown",
//             specialization: "Dermatology",
//             contactPhone: "3456789012",
//             isAvailable: true,
//             defaultSlotDuration: 20,
//         },
//         {
//             userId: users[0].userId,
//             firstName: "John",
//             lastName: "Doe",
//             specialization: "Neurology",
//             contactPhone: "1234567890",
//             isAvailable: false,
//             defaultSlotDuration: 40,
//         },
//     ]).returning({ doctorId: doctorsTable.doctorId });

//     // Step 5: Insert Doctor Availability
//     await db.insert(doctorAvailabilityTable).values([
//         {
//             doctorId: doctors[0].doctorId,
//             dayOfWeek: "Monday",
//             startTime: "09:00",
//             endTime: "12:00",
//             slotDuration: 30,
//             slotFee: "100.00",
//         },
//         {
//             doctorId: doctors[1].doctorId,
//             dayOfWeek: "Tuesday",
//             startTime: "10:00",
//             endTime: "13:00",
//             slotDuration: 20,
//             slotFee: "150.00",
//         },
//         {
//             doctorId: doctors[2].doctorId,
//             dayOfWeek: "Wednesday",
//             startTime: "14:00",
//             endTime: "17:00",
//             slotDuration: 40,
//             slotFee: "200.00",
//         },
//     ]);

//     // Step 6: Insert Appointments
//     const appointments = await db.insert(appointmentsTable).values([
//         {
//             patientId: patients[0].patientId,
//             doctorId: doctors[0].doctorId,
//             appointmentDate: "2025-07-30",
//             timeSlot: "10:00:00",
//             startTime: "10:00:00",
//             endTime: "10:30:00",
//             totalAmount: "100.00",
//             reason: "Regular Checkup",
//             appointmentStatus: "confirmed",
//         },
//         {
//             patientId: patients[1].patientId,
//             doctorId: doctors[1].doctorId,
//             appointmentDate: "2025-07-30",
//             timeSlot: "11:00:00",
//             startTime: "11:00:00",
//             endTime: "11:30:00",
//             totalAmount: "150.00",
//             reason: "Skin Rash",
//             appointmentStatus: "pending",
//         },
//         {
//             patientId: patients[2].patientId,
//             doctorId: doctors[2].doctorId,
//             appointmentDate: "2025-08-06",
//             timeSlot: "14:00:00",
//             startTime: "14:00:00",
//             endTime: "14:30:00",
//             totalAmount: "200.00",
//             reason: "Headache",
//             appointmentStatus: "rescheduled",
//         },
//     ]).returning({ appointmentId: appointmentsTable.appointmentId });

//     // Step 7: Insert Payments
//     await db.insert(paymentsTable).values([
//         {
//             appointmentId: appointments[0].appointmentId,
//             totalAmount: "100.00",
//             PaymentStatus: "completed",
//             transactionId: "txn_001",
//             paymentMethod: "stripe",
//         },
//         {
//             appointmentId: appointments[1].appointmentId,
//             totalAmount: "150.00",
//             PaymentStatus: "pending",
//             transactionId: "txn_002",
//             paymentMethod: "cash",
//         },
//         {
//             appointmentId: appointments[2].appointmentId,
//             totalAmount: "200.00",
//             PaymentStatus: "refunded",
//             transactionId: "txn_003",
//             paymentMethod: "stripe",
//         },
//     ]);

//     // Step 8: Insert Complaints
//     await db.insert(complaintsTable).values([
//         {
//             userId: users[0].userId,
//             relatedAppointmentId: appointments[0].appointmentId,
//             subject: "Late appointment",
//             description: "The doctor was late by 20 minutes",
//             complaintStatus: "Open",
//         },
//         {
//             userId: users[1].userId,
//             relatedAppointmentId: appointments[1].appointmentId,
//             subject: "Billing issue",
//             description: "Incorrect billing amount shown",
//             complaintStatus: "In Progress",
//         },
//         {
//             userId: users[2].userId,
//             relatedAppointmentId: appointments[2].appointmentId,
//             subject: "Wrong diagnosis",
//             description: "Prescribed treatment didn't help",
//             complaintStatus: "Resolved",
//         },
//     ]);

//     console.log("✅ Seed completed");
// }

// seed().catch((err) => {
//     console.error("❌ Seed failed", err);
//     process.exit(1);
// });
