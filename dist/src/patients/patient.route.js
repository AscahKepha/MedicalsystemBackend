"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientRouter = void 0;
const express_1 = require("express");
const patient_controller_1 = require("./patient.controller");
const bearAuth_1 = require("../middleware/bearAuth");
exports.patientRouter = (0, express_1.Router)();
//Get all patients
exports.patientRouter.get('/patients', bearAuth_1.adminRoleAuth, patient_controller_1.getPatients);
//Get patients Byid
exports.patientRouter.get('/patients/:id', bearAuth_1.allRoleAuth, patient_controller_1.getPatientsById);
//Create patient
exports.patientRouter.post('/patients', bearAuth_1.adminRoleAuth, patient_controller_1.createPatient);
//update patient
exports.patientRouter.put('/patients/:id', bearAuth_1.adminRoleAuth, patient_controller_1.updatePatient);
//delete patient
exports.patientRouter.delete('/patients/:id', bearAuth_1.adminRoleAuth, patient_controller_1.deletePatient);
