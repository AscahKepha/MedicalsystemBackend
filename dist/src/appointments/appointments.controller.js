"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAppointments = exports.getDoctorIdByUserId = exports.updateAppointments = exports.createAppointments = exports.getAppointmentsByPatientId = exports.getAppointmentsByDoctorId = exports.getAppointmentsById = exports.getAppointments = void 0;
const appointments_services_1 = require("./appointments.services");
//Business logic for appointments-related operations
const getAppointments = async (req, res) => {
    try {
        const allappointments = await (0, appointments_services_1.getAppointmentsServices)();
        if (allappointments == null || allappointments.length == 0) {
            res.status(404).json({ message: "No appointmentss found" });
        }
        else {
            res.status(200).json(allappointments);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch appointmentss" });
    }
};
exports.getAppointments = getAppointments;
const getAppointmentsById = async (req, res) => {
    const appointmentsId = parseInt(req.params.appointmentId);
    if (isNaN(appointmentsId)) { //NaN -not a number
        res.status(400).json({ error: "Invalid appointments ID" });
        return; // Prevent further execution
    }
    try {
        const appointments = await (0, appointments_services_1.getAppointmentsByIdServices)(appointmentsId);
        if (appointments == undefined) {
            res.status(404).json({ message: "appointments not found" });
        }
        else {
            res.status(200).json(appointments);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch appointments" });
    }
};
exports.getAppointmentsById = getAppointmentsById;
const getAppointmentsByDoctorId = async (req, res) => {
    const doctorId = parseInt(req.params.doctorId);
    if (isNaN(doctorId)) {
        res.status(400).json({ error: "Invalid doctor Id enter the correct Id" });
        return;
    }
    try {
        const appointments = await (0, appointments_services_1.getAppointmentByDoctorIdServices)(doctorId);
        if (appointments === null || appointments.length == 0) {
            res.status(404).json({ message: "no appointments found" });
        }
        else {
            res.status(200).json(appointments);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch appointments" });
    }
};
exports.getAppointmentsByDoctorId = getAppointmentsByDoctorId;
const getAppointmentsByPatientId = async (req, res) => {
    const patientId = parseInt(req.params.patientId);
    if (isNaN(patientId)) {
        res.status(400).json({ error: "Invalid patient Id enter the correct Id" });
        return;
    }
    try {
        const appointments = await (0, appointments_services_1.getAppointmentByPatientIdServices)(patientId);
        if (appointments === null || appointments.length == 0) {
            res.status(200).json([]);
        }
        else {
            res.status(200).json(appointments);
        }
    }
    catch (error) {
        console.error("Error in getAppointmentsByPatientId controller:", error);
        res.status(500).json({ error: error.message || "Failed to fetch appointments" });
    }
};
exports.getAppointmentsByPatientId = getAppointmentsByPatientId;
// ✅ CREATE Appointment
const createAppointments = async (req, res) => {
    const { appointmentDate, timeSlot, startTime, endTime, totalAmount, patientId, doctorId, reason, } = req.body;
    console.log("📥 Incoming Appointment Payload:", req.body);
    if (!appointmentDate ||
        !timeSlot ||
        !startTime ||
        !endTime ||
        !totalAmount ||
        !patientId ||
        !doctorId) {
        console.warn("⚠️ Missing required fields");
        res.status(400).json({ error: "All fields including patientId and doctorId are required" });
        return;
    }
    try {
        const newAppointment = await (0, appointments_services_1.createAppointmentsServices)({
            appointmentDate,
            timeSlot,
            startTime,
            endTime,
            totalAmount,
            patientId,
            doctorId,
            reason,
        });
        if (!newAppointment) {
            console.error("❌ Failed to create appointment");
            res.status(500).json({ message: "Failed to create appointment" });
        }
        else {
            console.log("✅ Appointment created:", newAppointment);
            res.status(201).json({ message: newAppointment });
        }
    }
    catch (error) {
        console.error("❌ Error creating appointment:", error);
        res.status(500).json({ error: error.message || "Failed to create appointment" });
    }
};
exports.createAppointments = createAppointments;
// ✅ UPDATE Appointment
const updateAppointments = async (req, res) => {
    const appointmentId = parseInt(req.params.id);
    if (isNaN(appointmentId)) {
        console.warn("⚠️ Invalid appointment ID");
        res.status(400).json({ error: "Invalid appointment ID" });
        return;
    }
    const { appointmentDate, timeSlot, startTime, endTime, totalAmount, patientId, doctorId, reason, } = req.body;
    console.log("🛠️ Updating Appointment ID:", appointmentId);
    console.log("📥 Update Payload:", req.body);
    if (!appointmentDate ||
        !timeSlot ||
        !startTime ||
        !endTime ||
        !totalAmount ||
        !patientId ||
        !doctorId) {
        console.warn("⚠️ Missing required fields");
        res.status(400).json({ error: "All fields including patientId and doctorId are required" });
        return;
    }
    try {
        const updatedAppointment = await (0, appointments_services_1.updateAppointmentsServices)(appointmentId, {
            appointmentDate,
            timeSlot,
            startTime,
            endTime,
            totalAmount,
            patientId,
            doctorId,
            reason,
        });
        if (!updatedAppointment) {
            console.error("❌ Appointment not found or update failed");
            res.status(404).json({ message: "Appointment not found or failed to update" });
        }
        else {
            console.log("✅ Appointment updated:", updatedAppointment);
            res.status(200).json({ message: updatedAppointment });
        }
    }
    catch (error) {
        console.error("❌ Error updating appointment:", error);
        res.status(500).json({ error: error.message || "Failed to update appointment" });
    }
};
exports.updateAppointments = updateAppointments;
const schema_1 = require("../drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("../drizzle/db"));
// ✅ make sure this path is correct
// ✅ Map userId to doctorId with logging
const getDoctorIdByUserId = async (req, res) => {
    const userId = parseInt(req.params.userId);
    console.log("🔍 Incoming request to map userId to doctorId:", userId);
    if (isNaN(userId)) {
        console.warn("⚠️ Invalid user ID received:", req.params.userId);
        res.status(400).json({ error: "Invalid user ID" });
        return;
    }
    try {
        console.log("📡 Querying doctors table for userId:", userId);
        const result = await db_1.default
            .select({
            doctorId: schema_1.doctorsTable.doctorId,
            userId: schema_1.doctorsTable.userId,
        })
            .from(schema_1.doctorsTable)
            .where((0, drizzle_orm_1.eq)(schema_1.doctorsTable.userId, userId))
            .limit(1);
        if (result.length === 0) {
            console.warn("❌ No doctor found for userId:", userId);
            res.status(404).json({ message: "No doctor found for this user" });
            return;
        }
        const doctorId = result[0].doctorId;
        console.log(`✅ Found doctorId ${doctorId} for userId ${userId}`);
        res.status(200).json({ doctorId });
        return;
    }
    catch (error) {
        console.error("🔥 Error fetching doctorId by userId:", error);
        res.status(500).json({ error: error.message || "Server error" });
        return;
    }
};
exports.getDoctorIdByUserId = getDoctorIdByUserId;
const deleteAppointments = async (req, res) => {
    const appointmentsId = parseInt(req.params.id);
    if (isNaN(appointmentsId)) {
        res.status(400).json({ error: "Invalid appointments ID" });
        return; // Prevent further execution
    }
    try {
        const deletedappointments = await (0, appointments_services_1.deleteAppointmentsServices)(appointmentsId);
        if (deletedappointments) {
            res.status(200).json({ message: "appointments deleted successfully" });
        }
        else {
            res.status(404).json({ message: "appointments not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to delete appointments" });
    }
};
exports.deleteAppointments = deleteAppointments;
