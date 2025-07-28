"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentsRouter = void 0;
const express_1 = require("express");
const payments_controllers_1 = require("./payments.controllers");
const bearAuth_1 = require("../middleware/bearAuth");
exports.paymentsRouter = (0, express_1.Router)();
// Get all payments
exports.paymentsRouter.get('/payments', bearAuth_1.adminRoleAuth, payments_controllers_1.getpayments);
// Get payments by ID
exports.paymentsRouter.get('/payments/:id', bearAuth_1.allRoleAuth, payments_controllers_1.getpaymentsById);
// Get payments by Patient ID
exports.paymentsRouter.get('/payments/patient/:id', bearAuth_1.allRoleAuth, payments_controllers_1.getPaymentsByPatientId);
// Get payments by Doctor ID
exports.paymentsRouter.get('/payments/doctor/:id', bearAuth_1.doctorRoleAuth, payments_controllers_1.getPaymentsByDoctorId);
// Create a new payments
exports.paymentsRouter.post('/payments', bearAuth_1.adminRoleAuth, payments_controllers_1.createpayments);
// Update an existing payments
exports.paymentsRouter.put('/payments/:id', bearAuth_1.adminRoleAuth, payments_controllers_1.updatepayments);
// Delete an existing payments
exports.paymentsRouter.delete('/payments/:id', bearAuth_1.adminRoleAuth, payments_controllers_1.deletepayments);
