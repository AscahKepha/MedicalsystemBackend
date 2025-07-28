import { relations, sql } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  time,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

// --- Enums ---
export const roleEnum = pgEnum("userType", ["admin", "doctor", "patient"]);
export const PaymentStatusEnum = pgEnum("paymentStatus", ["pending", "completed", "failed", "refunded"]);
export const appointmentStatusEnum = pgEnum("AppointmentsStatus", ["confirmed", "canceled", "completed", "rescheduled", "pending"]);
export const complaintStatusEnum = pgEnum("complaintStatus", ["Open", "In Progress", "Resolved", "Closed"]);

// --- User Table ---
export const userTable = pgTable("userTable", {
  userId: serial("userId").primaryKey(),
  firstName: varchar("firstName"),
  lastName: varchar("lastName"),
  email: varchar("email").unique(),
  password: varchar("password").notNull(),
  contactPhone: varchar("contact_phone", { length: 20 }).notNull(),
  address: text("address"),
  userType: roleEnum("userType").default("patient"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type TUserInsert = typeof userTable.$inferInsert;
export type TUserSelect = typeof userTable.$inferSelect;

// --- Patients Table ---
export const patientsTable = pgTable("patientsTable", {
  patientId: serial("patientId").primaryKey(),
  userId: integer("userId").references(() => userTable.userId, { onDelete: "set null" }).unique(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  contactPhone: varchar("contact_phone", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => sql`now()`).notNull(),
});

export type TPatientInsert = typeof patientsTable.$inferInsert;
export type TPatientSelect = typeof patientsTable.$inferSelect;

import { jsonb } from "drizzle-orm/pg-core";

// --- Doctors Table ---
export const doctorsTable = pgTable("doctorsTable", {
  doctorId: serial("doctor_id").primaryKey(),
  userId: integer("userId").references(() => userTable.userId, { onDelete: "set null" }),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  specialization: varchar("specialization", { length: 255 }),
  contactPhone: varchar("contact_phone", { length: 20 }),
  isAvailable: boolean("is_available").default(false).notNull(),

  // 👇 New availability field
  availability: jsonb("availability").default([]).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => sql`now()`).notNull(),
});

export type TDoctorInsert = typeof doctorsTable.$inferInsert;
export type TDoctorSelect = typeof doctorsTable.$inferSelect;

// --- Appointments Table ---
export const appointmentsTable = pgTable("appointmentsTable", {
  appointmentId: serial("appointmentId").primaryKey(),

  patientId: integer("patientId").references(() => patientsTable.patientId, {
    onDelete: "set null",
  }),

  doctorId: integer("doctorId").references(() => doctorsTable.doctorId, {
    onDelete: "set null",
  }),

  appointmentDate: date("appointmentDate", { mode: "string" }).notNull(),
  timeSlot: time("timeSlot").notNull(),
  startTime: time("startTime").notNull(),
  endTime: time("endTime").notNull(),

  totalAmount: numeric("totalAmount", { precision: 10, scale: 2 })
    .default("0.00")
    .notNull(),

  // ✅ Added reason field (optional — remove `.notNull()` if you want it required)
  reason: varchar("reason", { length: 255 }),

  appointmentStatus: appointmentStatusEnum("appointmentStatus").default("pending"),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => sql`now()`).notNull(),
}, table => ({
  doctorAppointmentUnique: unique("doctorAppointmentUnique").on(
    table.doctorId,
    table.appointmentDate,
    table.startTime
  ),
}));


export type TAppointmentsInsert = typeof appointmentsTable.$inferInsert;
export type TAppointmentsSelect = typeof appointmentsTable.$inferSelect;

// --- Prescriptions Table ---
export const prescriptionsTable = pgTable("prescriptionsTable", {
  prescriptionId: serial("prescriptionId").primaryKey(),
  appointmentId: integer("appointmentId").references(() => appointmentsTable.appointmentId, { onDelete: "set null" }),
  doctorId: integer("doctorId").references(() => doctorsTable.doctorId, { onDelete: "set null" }),
  patientId: integer("patientId").references(() => patientsTable.patientId, { onDelete: "set null" }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => sql`now()`).notNull(),
});

export type TPrescriptionsInsert = typeof prescriptionsTable.$inferInsert;
export type TPrescriptionsSelect = typeof prescriptionsTable.$inferSelect;

// --- Payments Table ---
export const paymentsTable = pgTable("payments", {
  paymentId: serial("payment_id").primaryKey(),
  appointmentId: integer("appointment_id").references(() => appointmentsTable.appointmentId, { onDelete: "set null" }),
  totalAmount: numeric("totalAmount", { precision: 10, scale: 2 }).notNull(),
  PaymentStatus: PaymentStatusEnum("paymentStatus").default("pending"),
  transactionId: varchar("transaction_id", { length: 255 }).unique().notNull(),
  paymentDate: timestamp("payment_date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => sql`now()`).notNull(),
});

export type TPaymentInsert = typeof paymentsTable.$inferInsert;
export type TPaymentSelect = typeof paymentsTable.$inferSelect;

// --- Complaints Table ---
export const complaintsTable = pgTable("complaints", {
  complaintsId: serial("complaintId").primaryKey(),
  userId: integer("userId").references(() => userTable.userId, { onDelete: "set null" }),
  relatedAppointmentId: integer("relatedAppointmentId").references(() => appointmentsTable.appointmentId, { onDelete: "set null" }),
  subject: varchar("subject", { length: 255 }).notNull(),
  description: text("description").notNull(),
  complaintStatus: complaintStatusEnum("complaintStatus").default("Open"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => sql`now()`).notNull(),
});

export type TComplaintInsert = typeof complaintsTable.$inferInsert;
export type TComplaintSelect = typeof complaintsTable.$inferSelect;

// --- Relationships ---
export const userRelations = relations(userTable, ({ one, many }) => ({
  patient: one(patientsTable, {
    fields: [userTable.userId],
    references: [patientsTable.userId],
  }),
  doctor: one(doctorsTable, {
    fields: [userTable.userId],
    references: [doctorsTable.userId],
  }),
  complaints: many(complaintsTable),
}));

export const doctorsRelations = relations(doctorsTable, ({ one, many }) => ({
  user: one(userTable, {
    fields: [doctorsTable.userId],
    references: [userTable.userId],
  }),
  appointments: many(appointmentsTable),
  prescriptions: many(prescriptionsTable),
}));

export const patientsRelations = relations(patientsTable, ({ one, many }) => ({
  user: one(userTable, {
    fields: [patientsTable.userId],
    references: [userTable.userId],
  }),
  appointments: many(appointmentsTable),
  prescriptions: many(prescriptionsTable),
}));

export const appointmentsRelations = relations(appointmentsTable, ({ one, many }) => ({
  patient: one(patientsTable, {
    fields: [appointmentsTable.patientId],
    references: [patientsTable.patientId],
  }),
  doctor: one(doctorsTable, {
    fields: [appointmentsTable.doctorId],
    references: [doctorsTable.doctorId],
  }),
  prescriptions: many(prescriptionsTable),
  payments: many(paymentsTable),
}));

export const prescriptionsRelations = relations(prescriptionsTable, ({ one }) => ({
  appointment: one(appointmentsTable, {
    fields: [prescriptionsTable.appointmentId],
    references: [appointmentsTable.appointmentId],
  }),
  doctor: one(doctorsTable, {
    fields: [prescriptionsTable.doctorId],
    references: [doctorsTable.doctorId],
  }),
  patient: one(patientsTable, {
    fields: [prescriptionsTable.patientId],
    references: [patientsTable.patientId],
  }),
}));

export const paymentsRelations = relations(paymentsTable, ({ one }) => ({
  appointment: one(appointmentsTable, {
    fields: [paymentsTable.appointmentId],
    references: [appointmentsTable.appointmentId],
  }),
}));

export const complaintsRelations = relations(complaintsTable, ({ one }) => ({
  user: one(userTable, {
    fields: [complaintsTable.userId],
    references: [userTable.userId],
  }),
  relatedAppointment: one(appointmentsTable, {
    fields: [complaintsTable.relatedAppointmentId],
    references: [appointmentsTable.appointmentId],
  }),
}));