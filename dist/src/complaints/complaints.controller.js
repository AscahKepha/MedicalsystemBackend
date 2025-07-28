"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComplaints = exports.updateComplaints = exports.createComplaints = exports.getComplaintsById = exports.getComplaintsByUserId = exports.getComplaints = void 0;
const complaints_services_1 = require("./complaints.services");
//Business logic for complaints-related operations
const getComplaints = async (req, res) => {
    try {
        const allcomplaints = await (0, complaints_services_1.getComplaintsServices)();
        if (allcomplaints == null || allcomplaints.length == 0) {
            res.status(404).json({ message: "No complaints found" });
        }
        else {
            res.status(200).json(allcomplaints);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch complaints" });
    }
};
exports.getComplaints = getComplaints;
const getComplaintsByUserId = async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
        res.status(400).json({ error: "Invalid user Id enter the correct Id" });
        return;
    }
    try {
        const complaints = await (0, complaints_services_1.getComplaintsByUserIdServices)(userId);
        if (complaints === null || complaints.length == 0) {
            res.status(404).json({ message: "no complaints found" });
        }
        else {
            res.status(200).json(complaints);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch complaints" });
    }
};
exports.getComplaintsByUserId = getComplaintsByUserId;
const getComplaintsById = async (req, res) => {
    const complaintsId = parseInt(req.params.id);
    if (isNaN(complaintsId)) {
        res.status(400).json({ error: "Invalid complaints ID" });
        return; // Prevent further execution
    }
    try {
        const complaints = await (0, complaints_services_1.getComplaintsByIdServices)(complaintsId);
        if (complaints == undefined) {
            res.status(404).json({ message: "complaints not found" });
        }
        else {
            res.status(200).json(complaints);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch complaints" });
    }
};
exports.getComplaintsById = getComplaintsById;
const createComplaints = async (req, res) => {
    const { relatedAppointmentId, subject, description } = req.body;
    if (!relatedAppointmentId || !subject || !description) {
        res.status(400).json({ error: "All fields are required" });
        return; // Prevent further execution
    }
    try {
        const newComplaints = await (0, complaints_services_1.createComplaintsServices)({ relatedAppointmentId, subject, description });
        if (newComplaints == null) {
            res.status(500).json({ message: "Failed to create complaints" });
        }
        else {
            res.status(201).json({ message: newComplaints });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to create complaints" });
    }
};
exports.createComplaints = createComplaints;
const updateComplaints = async (req, res) => {
    const complaintsId = parseInt(req.params.id);
    if (isNaN(complaintsId)) {
        res.status(400).json({ error: "Invalid complaints ID" });
        return; // Prevent further execution
    }
    const { relatedAppointmentId, subject, description } = req.body;
    if (!relatedAppointmentId || !subject || !description) {
        res.status(400).json({ error: "All fields are required" });
        return; // Prevent further execution
    }
    try {
        const updatedcomplaints = await (0, complaints_services_1.updateComplaintsServices)(complaintsId, { relatedAppointmentId, subject, description });
        if (updatedcomplaints == null) {
            res.status(404).json({ message: "complaints not found or failed to update" });
        }
        else {
            res.status(200).json({ message: updatedcomplaints });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to update complaints" });
    }
};
exports.updateComplaints = updateComplaints;
const deleteComplaints = async (req, res) => {
    const complaintsId = parseInt(req.params.id);
    if (isNaN(complaintsId)) {
        res.status(400).json({ error: "Invalid complaints ID" });
        return; // Prevent further execution
    }
    try {
        const deletedcomplaints = await (0, complaints_services_1.deleteComplaintsServices)(complaintsId);
        if (deletedcomplaints) {
            res.status(200).json({ message: "complaints deleted successfully" });
        }
        else {
            res.status(404).json({ message: "complaints not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to delete complaints" });
    }
};
exports.deleteComplaints = deleteComplaints;
