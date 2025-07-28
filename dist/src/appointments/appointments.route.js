"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentRouter = void 0;
const express_1 = require("express");
const appointments_controller_1 = require("./appointments.controller");
const bearAuth_1 = require("../middleware/bearAuth");
exports.appointmentRouter = (0, express_1.Router)();
// Appointment routes definition
// Get all Appointments
exports.appointmentRouter.get('/appointments', bearAuth_1.adminRoleAuth, appointments_controller_1.getAppointments);
// Get Appointment by ID
exports.appointmentRouter.get('/appointments/:appointmentId', bearAuth_1.allRoleAuth, appointments_controller_1.getAppointmentsById);
//Get specifiec doctor appointments
exports.appointmentRouter.get('/doctors/:doctorId/appointments', appointments_controller_1.getAppointmentsByDoctorId); // doctorRoleAuth,
//Get specific Patient appointments
exports.appointmentRouter.get('/patients/:patientId/appointments', bearAuth_1.patientRoleAuth, appointments_controller_1.getAppointmentsByPatientId);
// Create a new Appointment
exports.appointmentRouter.post('/appointments', bearAuth_1.allRoleAuth, appointments_controller_1.createAppointments);
// Update an existing Appointment
exports.appointmentRouter.put('/appointments/:appointmentId', bearAuth_1.allRoleAuth, appointments_controller_1.updateAppointments);
// Delete an existing Appointment
exports.appointmentRouter.delete('/appointments/:appointmentId', bearAuth_1.adminRoleAuth, appointments_controller_1.deleteAppointments);
const appointments_controller_2 = require("./appointments.controller");
exports.appointmentRouter.get("/doctor-id/by-user/:userId", appointments_controller_2.getDoctorIdByUserId);
