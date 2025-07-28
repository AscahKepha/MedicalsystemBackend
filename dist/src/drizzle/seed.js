"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// drizzle/seed.ts
const db_1 = __importDefault(require("./db")); // Adjust to your db instance
const schema_1 = require("./schema");
async function seed() {
    // --- Users ---
    const [adminUser, doctorUser, patientUser] = await db_1.default.insert(schema_1.userTable).values([
        {
            firstName: "joshua",
            lastName: "Two",
            email: "joshua@gmail.com",
            password: "joshua",
            contactPhone: "071234567",
            address: "Nakuru St",
            userType: "admin",
        },
        {
            firstName: "Dr.",
            lastName: "Debra",
            email: "debra@gmail.com",
            password: "debra",
            contactPhone: "07234567",
            address: "Nakuru St",
            userType: "doctor",
        },
        {
            firstName: "Ascah",
            lastName: "Doe",
            email: "kephaascah@gmail.com",
            password: "ascah",
            contactPhone: "073456789",
            address: "Kisumu Rd",
            userType: "patient",
        },
    ]).returning();
    // --- Doctors ---
    const [doctor] = await db_1.default.insert(schema_1.doctorsTable).values([
        {
            userId: doctorUser.userId,
            firstName: "Dr.",
            lastName: "Debra",
            specialization: "Cardiology",
            contactPhone: "07234567",
            isAvailable: true,
        },
    ]).returning();
    // --- Patients ---
    const [patient] = await db_1.default.insert(schema_1.patientsTable).values([
        {
            userId: patientUser.userId,
            firstName: "Ascah",
            lastName: "Doe",
            contactPhone: "073456789",
        },
    ]).returning();
    // --- Appointments ---
    const [appointment] = await db_1.default.insert(schema_1.appointmentsTable).values([
        {
            patientId: patient.patientId,
            doctorId: doctor.doctorId,
            appointmentDate: "2025-08-02",
            timeSlot: "10:00:00",
            startTime: "10:00:00",
            endTime: "10:30:00",
            totalAmount: "150.00",
            appointmentStatus: "confirmed",
        },
    ]).returning();
    // --- Prescriptions ---
    await db_1.default.insert(schema_1.prescriptionsTable).values([
        {
            appointmentId: appointment.appointmentId,
            doctorId: doctor.doctorId,
            patientId: patient.patientId,
            notes: "Take 2 tablets 2 times a day until complition for 7 days.",
        },
    ]);
    // --- Payments ---
    await db_1.default.insert(schema_1.paymentsTable).values([
        {
            appointmentId: appointment.appointmentId,
            totalAmount: "150.00",
            PaymentStatus: "completed",
            transactionId: "txn_001",
        },
    ]);
    // --- Complaints ---
    await db_1.default.insert(schema_1.complaintsTable).values([
        {
            userId: patientUser.userId,
            relatedAppointmentId: appointment.appointmentId,
            subject: "Cancelled Appointment",
            description: "My appointments we're cancelled without a valid reason.",
            complaintStatus: "Open",
        },
        {
            userId: patientUser.userId,
            subject: "Billing Issue",
            description: "Charged extra medicine prices.",
            complaintStatus: "In Progress",
        },
    ]);
    console.log("Seeding complete.");
}
seed().catch((e) => {
    console.error(e);
    process.exit(1);
});
