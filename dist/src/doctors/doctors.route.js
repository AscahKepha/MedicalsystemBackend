"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorsRouter = void 0;
const express_1 = require("express");
const doctors_controller_1 = require("./doctors.controller");
const bearAuth_1 = require("../middleware/bearAuth");
exports.doctorsRouter = (0, express_1.Router)();
// doctors routes definition
// Get all doctorss
exports.doctorsRouter.get('/doctors', doctors_controller_1.getDoctors);
// Get doctors by ID
exports.doctorsRouter.get('/doctors/:id', bearAuth_1.allRoleAuth, doctors_controller_1.getDoctorsById);
// Create a new doctors
exports.doctorsRouter.post('/doctors', bearAuth_1.adminRoleAuth, doctors_controller_1.createDoctors);
// Update an existing doctors
exports.doctorsRouter.put('/doctors/:id', bearAuth_1.adminRoleAuth, doctors_controller_1.updateDoctors);
// Delete an existing doctors
exports.doctorsRouter.delete('/doctors/:id', bearAuth_1.adminRoleAuth, doctors_controller_1.deleteDoctors);
