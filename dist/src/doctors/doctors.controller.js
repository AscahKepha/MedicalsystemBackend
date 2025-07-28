"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDoctors = exports.updateDoctors = exports.createDoctors = exports.getDoctorsById = exports.getDoctors = void 0;
const doctors_services_1 = require("./doctors.services");
//Business logic for doctors-related operations
const getDoctors = async (req, res) => {
    try {
        const alldoctors = await (0, doctors_services_1.getDoctorsServices)();
        if (alldoctors == null || alldoctors.length == 0) {
            res.status(404).json({ message: "No doctors found" });
        }
        else {
            res.status(200).json(alldoctors);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch doctors" });
    }
};
exports.getDoctors = getDoctors;
const getDoctorsById = async (req, res) => {
    const doctorsId = parseInt(req.params.id);
    if (isNaN(doctorsId)) {
        res.status(400).json({ error: "Invalid doctors ID" });
        return; // Prevent further execution
    }
    try {
        const doctor = await (0, doctors_services_1.getDoctorsByIdServices)(doctorsId);
        if (doctor == undefined) {
            res.status(404).json({ message: "doctors not found" });
        }
        else {
            res.status(200).json(doctor);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch the doctor" });
    }
};
exports.getDoctorsById = getDoctorsById;
const createDoctors = async (req, res) => {
    const { firstName, lastName, specialization, contactPhone, isAvailable } = req.body;
    if (!firstName || !lastName || !specialization || !contactPhone || !isAvailable) {
        res.status(400).json({ error: "All fields are required" });
        return; // Prevent further execution
    }
    try {
        const newdoctors = await (0, doctors_services_1.createDoctorsServices)({ firstName, lastName, specialization, contactPhone, isAvailable });
        if (newdoctors == null) {
            res.status(500).json({ message: "Failed to create doctors" });
        }
        else {
            res.status(201).json({ message: newdoctors });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to create doctors" });
    }
};
exports.createDoctors = createDoctors;
const updateDoctors = async (req, res) => {
    const doctorsId = parseInt(req.params.id);
    if (isNaN(doctorsId)) {
        res.status(400).json({ error: "Invalid doctors ID" });
        return; // Prevent further execution
    }
    const { firstName, lastName, specialization, contactPhone, isAvailable } = req.body;
    if (!firstName || !lastName || !specialization || !contactPhone || !isAvailable) {
        res.status(400).json({ error: "All fields are required" });
        return; // Prevent further execution
    }
    try {
        const updateddoctors = await (0, doctors_services_1.updateDoctorsServices)(doctorsId, { firstName, lastName, specialization, contactPhone, isAvailable });
        if (updateddoctors == null) {
            res.status(404).json({ message: "doctors not found or failed to update" });
        }
        else {
            res.status(200).json({ message: updateddoctors });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to update doctors" });
    }
};
exports.updateDoctors = updateDoctors;
const deleteDoctors = async (req, res) => {
    const doctorsId = parseInt(req.params.id);
    if (isNaN(doctorsId)) {
        res.status(400).json({ error: "Invalid doctors ID" });
        return; // Prevent further execution
    }
    try {
        const deleteddoctors = await (0, doctors_services_1.deleteDoctorsServices)(doctorsId);
        if (deleteddoctors) {
            res.status(200).json({ message: "doctors deleted successfully" });
        }
        else {
            res.status(404).json({ message: "doctors not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to delete doctors" });
    }
};
exports.deleteDoctors = deleteDoctors;
