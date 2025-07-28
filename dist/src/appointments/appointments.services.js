"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAppointmentsServices = exports.updateAppointmentsServices = exports.createAppointmentsServices = exports.getAppointmentByDoctorIdServices = exports.getAppointmentByPatientIdServices = exports.getAppointmentsByIdServices = exports.getAppointmentsServices = void 0;
//crud operations and services
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("../drizzle/db"));
const schema_1 = require("../drizzle/schema");
//CRUD Operations for appointments entity
//Get all appointments
const getAppointmentsServices = async () => {
    return await db_1.default.query.appointmentsTable.findMany({
        orderBy: [(0, drizzle_orm_1.desc)(schema_1.appointmentsTable.appointmentId)]
    });
};
exports.getAppointmentsServices = getAppointmentsServices;
//Get appointments by ID
const getAppointmentsByIdServices = async (appointmentsId) => {
    return await db_1.default.query.appointmentsTable.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.appointmentsTable.appointmentId, appointmentsId)
    });
};
exports.getAppointmentsByIdServices = getAppointmentsByIdServices;
//get appointments by patientId
const getAppointmentByPatientIdServices = async (patientId) => {
    return await db_1.default.query.appointmentsTable.findMany({
        where: (0, drizzle_orm_1.eq)(schema_1.appointmentsTable.patientId, patientId)
    });
};
exports.getAppointmentByPatientIdServices = getAppointmentByPatientIdServices;
//get appointments by doctorId
const getAppointmentByDoctorIdServices = async (doctorId) => {
    return await db_1.default.query.appointmentsTable.findMany({
        where: (0, drizzle_orm_1.eq)(schema_1.appointmentsTable.doctorId, doctorId)
    });
};
exports.getAppointmentByDoctorIdServices = getAppointmentByDoctorIdServices;
// Create a new appointment
const createAppointmentsServices = async (appointments) => {
    const [createdAppointment] = await db_1.default
        .insert(schema_1.appointmentsTable)
        .values(appointments)
        .returning();
    console.log("✅ Appointment inserted into DB:", createdAppointment);
    return createdAppointment;
};
exports.createAppointmentsServices = createAppointmentsServices;
// Update an existing appointments
const updateAppointmentsServices = async (appointmentsId, appointments) => {
    await db_1.default.update(schema_1.appointmentsTable).set(appointments).where((0, drizzle_orm_1.eq)(schema_1.appointmentsTable.appointmentId, appointmentsId));
    return "appointments Updated Succeffully 😎";
};
exports.updateAppointmentsServices = updateAppointmentsServices;
//delete appointments
const deleteAppointmentsServices = async (appointmentsId) => {
    await db_1.default.delete(schema_1.appointmentsTable).where((0, drizzle_orm_1.eq)(schema_1.appointmentsTable.appointmentId, appointmentsId));
    return "appointments Delete Sucessfully";
};
exports.deleteAppointmentsServices = deleteAppointmentsServices;
