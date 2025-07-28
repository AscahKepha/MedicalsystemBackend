"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.complaintsRelations = exports.paymentsRelations = exports.prescriptionsRelations = exports.appointmentsRelations = exports.patientsRelations = exports.doctorsRelations = exports.userRelations = exports.complaintsTable = exports.paymentsTable = exports.prescriptionsTable = exports.appointmentsTable = exports.doctorsTable = exports.patientsTable = exports.userTable = exports.complaintStatusEnum = exports.appointmentStatusEnum = exports.PaymentStatusEnum = exports.roleEnum = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
// --- Enums ---
exports.roleEnum = (0, pg_core_1.pgEnum)("userType", ["admin", "doctor", "patient"]);
exports.PaymentStatusEnum = (0, pg_core_1.pgEnum)("paymentStatus", ["pending", "completed", "failed", "refunded"]);
exports.appointmentStatusEnum = (0, pg_core_1.pgEnum)("AppointmentsStatus", ["confirmed", "canceled", "completed", "rescheduled", "pending"]);
exports.complaintStatusEnum = (0, pg_core_1.pgEnum)("complaintStatus", ["Open", "In Progress", "Resolved", "Closed"]);
// --- User Table ---
exports.userTable = (0, pg_core_1.pgTable)("userTable", {
    userId: (0, pg_core_1.serial)("userId").primaryKey(),
    firstName: (0, pg_core_1.varchar)("firstName"),
    lastName: (0, pg_core_1.varchar)("lastName"),
    email: (0, pg_core_1.varchar)("email").unique(),
    password: (0, pg_core_1.varchar)("password").notNull(),
    contactPhone: (0, pg_core_1.varchar)("contact_phone", { length: 20 }).notNull(),
    address: (0, pg_core_1.text)("address"),
    userType: (0, exports.roleEnum)("userType").default("patient"),
    createdAt: (0, pg_core_1.timestamp)("createdAt").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updatedAt").defaultNow(),
});
// --- Patients Table ---
exports.patientsTable = (0, pg_core_1.pgTable)("patientsTable", {
    patientId: (0, pg_core_1.serial)("patientId").primaryKey(),
    userId: (0, pg_core_1.integer)("userId").references(() => exports.userTable.userId, { onDelete: "set null" }).unique(),
    firstName: (0, pg_core_1.varchar)("first_name", { length: 255 }).notNull(),
    lastName: (0, pg_core_1.varchar)("last_name", { length: 255 }).notNull(),
    contactPhone: (0, pg_core_1.varchar)("contact_phone", { length: 20 }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().$onUpdate(() => (0, drizzle_orm_1.sql) `now()`).notNull(),
});
const pg_core_2 = require("drizzle-orm/pg-core");
// --- Doctors Table ---
exports.doctorsTable = (0, pg_core_1.pgTable)("doctorsTable", {
    doctorId: (0, pg_core_1.serial)("doctor_id").primaryKey(),
    userId: (0, pg_core_1.integer)("userId").references(() => exports.userTable.userId, { onDelete: "set null" }),
    firstName: (0, pg_core_1.varchar)("first_name", { length: 255 }).notNull(),
    lastName: (0, pg_core_1.varchar)("last_name", { length: 255 }).notNull(),
    specialization: (0, pg_core_1.varchar)("specialization", { length: 255 }),
    contactPhone: (0, pg_core_1.varchar)("contact_phone", { length: 20 }),
    isAvailable: (0, pg_core_1.boolean)("is_available").default(false).notNull(),
    // 👇 New availability field
    availability: (0, pg_core_2.jsonb)("availability").default([]).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().$onUpdate(() => (0, drizzle_orm_1.sql) `now()`).notNull(),
});
// --- Appointments Table ---
exports.appointmentsTable = (0, pg_core_1.pgTable)("appointmentsTable", {
    appointmentId: (0, pg_core_1.serial)("appointmentId").primaryKey(),
    patientId: (0, pg_core_1.integer)("patientId").references(() => exports.patientsTable.patientId, {
        onDelete: "set null",
    }),
    doctorId: (0, pg_core_1.integer)("doctorId").references(() => exports.doctorsTable.doctorId, {
        onDelete: "set null",
    }),
    appointmentDate: (0, pg_core_1.date)("appointmentDate", { mode: "string" }).notNull(),
    timeSlot: (0, pg_core_1.time)("timeSlot").notNull(),
    startTime: (0, pg_core_1.time)("startTime").notNull(),
    endTime: (0, pg_core_1.time)("endTime").notNull(),
    totalAmount: (0, pg_core_1.numeric)("totalAmount", { precision: 10, scale: 2 })
        .default("0.00")
        .notNull(),
    // ✅ Added reason field (optional — remove `.notNull()` if you want it required)
    reason: (0, pg_core_1.varchar)("reason", { length: 255 }),
    appointmentStatus: (0, exports.appointmentStatusEnum)("appointmentStatus").default("pending"),
    createdAt: (0, pg_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().$onUpdate(() => (0, drizzle_orm_1.sql) `now()`).notNull(),
}, table => ({
    doctorAppointmentUnique: (0, pg_core_1.unique)("doctorAppointmentUnique").on(table.doctorId, table.appointmentDate, table.startTime),
}));
// --- Prescriptions Table ---
exports.prescriptionsTable = (0, pg_core_1.pgTable)("prescriptionsTable", {
    prescriptionId: (0, pg_core_1.serial)("prescriptionId").primaryKey(),
    appointmentId: (0, pg_core_1.integer)("appointmentId").references(() => exports.appointmentsTable.appointmentId, { onDelete: "set null" }),
    doctorId: (0, pg_core_1.integer)("doctorId").references(() => exports.doctorsTable.doctorId, { onDelete: "set null" }),
    patientId: (0, pg_core_1.integer)("patientId").references(() => exports.patientsTable.patientId, { onDelete: "set null" }),
    notes: (0, pg_core_1.text)("notes"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().$onUpdate(() => (0, drizzle_orm_1.sql) `now()`).notNull(),
});
// --- Payments Table ---
exports.paymentsTable = (0, pg_core_1.pgTable)("payments", {
    paymentId: (0, pg_core_1.serial)("payment_id").primaryKey(),
    appointmentId: (0, pg_core_1.integer)("appointment_id").references(() => exports.appointmentsTable.appointmentId, { onDelete: "set null" }),
    totalAmount: (0, pg_core_1.numeric)("totalAmount", { precision: 10, scale: 2 }).notNull(),
    PaymentStatus: (0, exports.PaymentStatusEnum)("paymentStatus").default("pending"),
    transactionId: (0, pg_core_1.varchar)("transaction_id", { length: 255 }).unique().notNull(),
    paymentDate: (0, pg_core_1.timestamp)("payment_date").defaultNow().notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().$onUpdate(() => (0, drizzle_orm_1.sql) `now()`).notNull(),
});
// --- Complaints Table ---
exports.complaintsTable = (0, pg_core_1.pgTable)("complaints", {
    complaintsId: (0, pg_core_1.serial)("complaintId").primaryKey(),
    userId: (0, pg_core_1.integer)("userId").references(() => exports.userTable.userId, { onDelete: "set null" }),
    relatedAppointmentId: (0, pg_core_1.integer)("relatedAppointmentId").references(() => exports.appointmentsTable.appointmentId, { onDelete: "set null" }),
    subject: (0, pg_core_1.varchar)("subject", { length: 255 }).notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    complaintStatus: (0, exports.complaintStatusEnum)("complaintStatus").default("Open"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().$onUpdate(() => (0, drizzle_orm_1.sql) `now()`).notNull(),
});
// --- Relationships ---
exports.userRelations = (0, drizzle_orm_1.relations)(exports.userTable, ({ one, many }) => ({
    patient: one(exports.patientsTable, {
        fields: [exports.userTable.userId],
        references: [exports.patientsTable.userId],
    }),
    doctor: one(exports.doctorsTable, {
        fields: [exports.userTable.userId],
        references: [exports.doctorsTable.userId],
    }),
    complaints: many(exports.complaintsTable),
}));
exports.doctorsRelations = (0, drizzle_orm_1.relations)(exports.doctorsTable, ({ one, many }) => ({
    user: one(exports.userTable, {
        fields: [exports.doctorsTable.userId],
        references: [exports.userTable.userId],
    }),
    appointments: many(exports.appointmentsTable),
    prescriptions: many(exports.prescriptionsTable),
}));
exports.patientsRelations = (0, drizzle_orm_1.relations)(exports.patientsTable, ({ one, many }) => ({
    user: one(exports.userTable, {
        fields: [exports.patientsTable.userId],
        references: [exports.userTable.userId],
    }),
    appointments: many(exports.appointmentsTable),
    prescriptions: many(exports.prescriptionsTable),
}));
exports.appointmentsRelations = (0, drizzle_orm_1.relations)(exports.appointmentsTable, ({ one, many }) => ({
    patient: one(exports.patientsTable, {
        fields: [exports.appointmentsTable.patientId],
        references: [exports.patientsTable.patientId],
    }),
    doctor: one(exports.doctorsTable, {
        fields: [exports.appointmentsTable.doctorId],
        references: [exports.doctorsTable.doctorId],
    }),
    prescriptions: many(exports.prescriptionsTable),
    payments: many(exports.paymentsTable),
}));
exports.prescriptionsRelations = (0, drizzle_orm_1.relations)(exports.prescriptionsTable, ({ one }) => ({
    appointment: one(exports.appointmentsTable, {
        fields: [exports.prescriptionsTable.appointmentId],
        references: [exports.appointmentsTable.appointmentId],
    }),
    doctor: one(exports.doctorsTable, {
        fields: [exports.prescriptionsTable.doctorId],
        references: [exports.doctorsTable.doctorId],
    }),
    patient: one(exports.patientsTable, {
        fields: [exports.prescriptionsTable.patientId],
        references: [exports.patientsTable.patientId],
    }),
}));
exports.paymentsRelations = (0, drizzle_orm_1.relations)(exports.paymentsTable, ({ one }) => ({
    appointment: one(exports.appointmentsTable, {
        fields: [exports.paymentsTable.appointmentId],
        references: [exports.appointmentsTable.appointmentId],
    }),
}));
exports.complaintsRelations = (0, drizzle_orm_1.relations)(exports.complaintsTable, ({ one }) => ({
    user: one(exports.userTable, {
        fields: [exports.complaintsTable.userId],
        references: [exports.userTable.userId],
    }),
    relatedAppointment: one(exports.appointmentsTable, {
        fields: [exports.complaintsTable.relatedAppointmentId],
        references: [exports.appointmentsTable.appointmentId],
    }),
}));
