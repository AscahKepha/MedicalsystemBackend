"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePatient = exports.updatePatient = exports.createPatient = exports.getPatientsById = exports.getPatients = void 0;
const patient_service_1 = require("./patient.service");
//Business logic, checking and json
const getPatients = async (req, res) => {
    try {
        const allPatients = await (0, patient_service_1.getPatientsServices)();
        if (allPatients == null || allPatients.length == 0) {
            res.status(404).json({ message: "No patients found" });
        }
        else {
            res.status(200).json(allPatients);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch patients" });
    }
};
exports.getPatients = getPatients;
const getPatientsById = async (req, res) => {
    const patientId = parseInt(req.params.id);
    if (isNaN(patientId)) {
        res.status(400).json({ error: "invalid patient Id" });
        return; //prevent further execution
    }
    try {
        const patient = await (0, patient_service_1.getPatientsByIdServices)(patientId);
        if (patient == undefined) {
            res.status(404).json({ message: "patient not found" });
        }
        else {
            res.status(200).json(patient);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to get patient" });
    }
};
exports.getPatientsById = getPatientsById;
const createPatient = async (req, res) => {
    const { firstName, lastName, contactPhone } = req.body; //it creates a const that requests details and fills them giving them the names 
    if (!firstName || !lastName || !contactPhone) {
        res.status(400).json({ error: "All fields are required" });
        return;
    }
    try {
        const newPatient = await (0, patient_service_1.createPatientServices)({ firstName, lastName, contactPhone });
        if (newPatient == null) {
            res.status(400).json({ message: "Failed to create a patient" });
        }
        else {
            res.status(201).json({ message: newPatient });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Fauled to create Patient" });
    }
};
exports.createPatient = createPatient;
const updatePatient = async (req, res) => {
    const patientId = parseInt(req.params.id);
    if (isNaN(patientId)) {
        res.status(400).json({ error: "Invalid patient ID" });
        return;
    }
    const { firstName, lastName, contactPhone } = req.body;
    if ((!firstName || !lastName || !contactPhone)) {
        res.status(400).json({ error: "All fields are required" });
        return;
    }
    try {
        const updatedPatient = await (0, patient_service_1.updatePatientServices)(patientId, { firstName, lastName, contactPhone });
        if (updatedPatient == null) {
            res.status(404).json({ message: "patient not found or failed to update" });
        }
        else {
            res.status(200).json({ message: updatedPatient });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to update patient" });
    }
};
exports.updatePatient = updatePatient;
const deletePatient = async (req, res) => {
    const patientId = parseInt(req.params.id);
    if (isNaN(patientId)) {
        res.status(400).json({ error: "Invalid patient ID" });
        return;
    }
    try {
        const deletedPatient = await (0, patient_service_1.deletePatientServices)(patientId);
        if (deletedPatient) {
            res.status(200).json({ message: "Patient deleted" });
        }
        else {
            res.status(404).json({ message: "Patient not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to delete patient" });
    }
};
exports.deletePatient = deletePatient;
