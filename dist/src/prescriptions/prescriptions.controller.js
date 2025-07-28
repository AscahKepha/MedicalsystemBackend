"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePrescriptions = exports.updatePrescriptions = exports.createprescriptions = exports.getPrescriptionsByPatientId = exports.getPrescriptionsByDoctorId = exports.getPrescriptionById = exports.getPrescriptions = void 0;
const prescriptions_services_1 = require("./prescriptions.services");
//Business logic for prescriptions-related operations
const getPrescriptions = async (req, res) => {
    try {
        const allprescriptions = await (0, prescriptions_services_1.getPrescriptionssServices)();
        if (allprescriptions == null || allprescriptions.length == 0) {
            res.status(200).json(allprescriptions || []);
        }
        else {
            res.status(200).json(allprescriptions);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch prescriptions" });
    }
};
exports.getPrescriptions = getPrescriptions;
const getPrescriptionById = async (req, res) => {
    const prescriptionId = parseInt(req.params.id);
    if (isNaN(prescriptionId)) {
        res.status(400).json({ error: "Invalid prescriptions ID" });
        return; // Prevent further execution
    }
    try {
        const prescriptions = await (0, prescriptions_services_1.getPrescriptionsByIdServices)(prescriptionId);
        if (prescriptions == undefined) {
            res.status(200).json(prescriptions || []);
        }
        else {
            res.status(200).json(prescriptions);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch prescriptions" });
    }
};
exports.getPrescriptionById = getPrescriptionById;
const getPrescriptionsByDoctorId = async (req, res) => {
    const doctorId = parseInt(req.params.doctorId);
    if (isNaN(doctorId)) {
        res.status(400).json({ error: "Invalid doctor Id enter the correct Id" });
        return;
    }
    try {
        const Prescriptions = await (0, prescriptions_services_1.getPrescriptionsByDoctorIdServices)(doctorId);
        if (Prescriptions === null || Prescriptions.length == 0) {
            res.status(200).json(Prescriptions || []);
            ;
        }
        else {
            res.status(200).json(Prescriptions);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch Prescriptions" });
    }
};
exports.getPrescriptionsByDoctorId = getPrescriptionsByDoctorId;
const getPrescriptionsByPatientId = async (req, res) => {
    const patientId = parseInt(req.params.patientId);
    if (isNaN(patientId)) {
        res.status(400).json({ error: "Invalid patient Id enter the correct Id" });
        return;
    }
    try {
        const Prescriptions = await (0, prescriptions_services_1.getPrescriptionsByPatientIdServices)(patientId);
        if (Prescriptions === null || Prescriptions.length == 0) {
            res.status(200).json([]);
        }
        else {
            res.status(200).json(Prescriptions);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch Prescriptions" });
    }
};
exports.getPrescriptionsByPatientId = getPrescriptionsByPatientId;
const createprescriptions = async (req, res) => {
    const { notes } = req.body;
    if (!notes) {
        res.status(400).json({ error: "All fields are required" });
        return; // Prevent further execution
    }
    try {
        const newPrescriptions = await (0, prescriptions_services_1.createPrescriptionsServices)({ notes });
        if (newPrescriptions == null) {
            res.status(500).json({ message: "Failed to create prescriptions" });
        }
        else {
            res.status(201).json({ message: newPrescriptions });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to create prescriptions" });
    }
};
exports.createprescriptions = createprescriptions;
const updatePrescriptions = async (req, res) => {
    const prescriptionsId = parseInt(req.params.id);
    if (isNaN(prescriptionsId)) {
        res.status(400).json({ error: "Invalid prescriptions ID" });
        return; // Prevent further execution
    }
    const { notes } = req.body;
    if (!notes) {
        res.status(400).json({ error: "All fields are required" });
        return; // Prevent further execution
    }
    try {
        const updatedPrescriptions = await (0, prescriptions_services_1.updatePrescriptionsServices)(prescriptionsId, { notes });
        if (updatedPrescriptions == null) {
            res.status(404).json({ message: "prescriptions not found or failed to update" });
        }
        else {
            res.status(200).json({ message: updatedPrescriptions });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to update prescriptions" });
    }
};
exports.updatePrescriptions = updatePrescriptions;
const deletePrescriptions = async (req, res) => {
    const prescriptionsId = parseInt(req.params.id);
    if (isNaN(prescriptionsId)) {
        res.status(400).json({ error: "Invalid prescriptions ID" });
        return; // Prevent further execution
    }
    try {
        const deletedPrescriptions = await (0, prescriptions_services_1.deletePrescriptionsServices)(prescriptionsId);
        if (deletedPrescriptions) {
            res.status(200).json({ message: "prescriptions deleted successfully" });
        }
        else {
            res.status(404).json({ message: "prescriptions not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to delete prescriptions" });
    }
};
exports.deletePrescriptions = deletePrescriptions;
