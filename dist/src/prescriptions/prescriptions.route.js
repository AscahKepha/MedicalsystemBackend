"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prescriptionsRouter = void 0;
const express_1 = require("express");
const prescriptions_controller_1 = require("./prescriptions.controller");
const bearAuth_1 = require("../middleware/bearAuth");
exports.prescriptionsRouter = (0, express_1.Router)();
// prescription routes definition
// Get all prescriptions
exports.prescriptionsRouter.get('/prescriptions', bearAuth_1.adminRoleAuth, prescriptions_controller_1.getPrescriptions);
// Get prescription by ID
exports.prescriptionsRouter.get('/prescriptions/:id', bearAuth_1.allRoleAuth, prescriptions_controller_1.getPrescriptionById);
//Get specifiec doctor appointments
exports.prescriptionsRouter.get('/doctors/:doctorId/prescriptions', bearAuth_1.doctorRoleAuth, prescriptions_controller_1.getPrescriptionsByDoctorId);
//Get specific Patient appointments
exports.prescriptionsRouter.get('/patients/:patientId/prescriptions', bearAuth_1.patientRoleAuth, prescriptions_controller_1.getPrescriptionsByPatientId);
// Create a new prescription
exports.prescriptionsRouter.post('/prescriptions', bearAuth_1.doctorRoleAuth, prescriptions_controller_1.createprescriptions);
// Update an existing prescription
exports.prescriptionsRouter.put('/prescriptions/:id', bearAuth_1.doctorRoleAuth, prescriptions_controller_1.updatePrescriptions);
// Delete an existing prescription
exports.prescriptionsRouter.delete('/prescriptions/:id', bearAuth_1.adminRoleAuth, prescriptions_controller_1.deletePrescriptions);
