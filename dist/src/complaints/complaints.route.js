"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.complaintsRouter = void 0;
const express_1 = require("express");
const complaints_controller_1 = require("./complaints.controller");
const bearAuth_1 = require("../middleware/bearAuth");
exports.complaintsRouter = (0, express_1.Router)();
// Complaints routes definition
// Get all Complaints
exports.complaintsRouter.get('/complaints', bearAuth_1.adminRoleAuth, complaints_controller_1.getComplaints);
// Get Complaints by ID
exports.complaintsRouter.get('/complaints/:id', bearAuth_1.allRoleAuth, complaints_controller_1.getComplaintsById);
// Get Complaints by User ID
exports.complaintsRouter.get('/users/:userId/complaints', bearAuth_1.allRoleAuth, complaints_controller_1.getComplaintsByUserId);
// Create a new Complaints
exports.complaintsRouter.post('/complaints', bearAuth_1.allRoleAuth, complaints_controller_1.createComplaints);
// Update an existing Complaints
exports.complaintsRouter.put('/complaints/:id', bearAuth_1.allRoleAuth, complaints_controller_1.updateComplaints);
// Delete an existing Complaints
exports.complaintsRouter.delete('/complaints/:id', bearAuth_1.adminRoleAuth, complaints_controller_1.deleteComplaints);
