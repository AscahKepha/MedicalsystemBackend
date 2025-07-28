"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletepayments = exports.updatepayments = exports.createpayments = exports.getPaymentsByDoctorId = exports.getPaymentsByPatientId = exports.getpaymentsById = exports.getpayments = void 0;
const payments_service_1 = require("./payments.service");
//crud operations and business logic including validation and json status
const getpayments = async (req, res) => {
    try {
        const allpayments = await (0, payments_service_1.getPaymentsServices)();
        if (allpayments == null || allpayments.length == 0) {
            res.status(404).json({ message: "No payments found" });
        }
        else {
            res.status(200).json(allpayments);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch payments" });
    }
};
exports.getpayments = getpayments;
const getpaymentsById = async (req, res) => {
    const paymentsId = parseInt(req.params.id);
    if (isNaN(paymentsId)) {
        res.status(400).json({ error: "Invalid payments ID" });
        return; // Prevent further execution
    }
    try {
        const payments = await (0, payments_service_1.getPaymentsByIdServices)(paymentsId);
        if (payments == undefined) {
            res.status(404).json({ message: "payments not found" });
        }
        else {
            res.status(200).json(payments);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch payments" });
    }
};
exports.getpaymentsById = getpaymentsById;
// New controller function for getting payments by patient ID
const getPaymentsByPatientId = async (req, res) => {
    const patientId = parseInt(req.params.id); // Assuming the patient ID comes from the URL parameter
    if (isNaN(patientId)) {
        res.status(400).json({ error: "Invalid patient ID" });
        return;
    }
    try {
        const payments = await (0, payments_service_1.getPaymentsByPatientIdServices)(patientId);
        if (payments === null || payments.length === 0) {
            res.status(200).json(payments || []);
        }
        else {
            res.status(200).json(payments);
        }
    }
    catch (error) {
        console.error("Error in getPaymentsByPatientId controller:", error);
        res.status(500).json({ error: error.message || "Failed to fetch payments by patient ID" });
    }
};
exports.getPaymentsByPatientId = getPaymentsByPatientId;
// New controller function for getting payments by doctor ID
const getPaymentsByDoctorId = async (req, res) => {
    const doctorId = parseInt(req.params.id); // Assuming the doctor ID comes from the URL parameter
    if (isNaN(doctorId)) {
        res.status(400).json({ error: "Invalid doctor ID" });
        return;
    }
    try {
        const payments = await (0, payments_service_1.getPaymentsByDoctorServices)(doctorId);
        if (payments === null || payments.length === 0) {
            res.status(200).json(payments || []);
        }
        else {
            res.status(200).json(payments);
        }
    }
    catch (error) {
        console.error("Error in getPaymentsByDoctorId controller:", error);
        res.status(500).json({ error: error.message || "Failed to fetch payments by doctor ID" });
    }
};
exports.getPaymentsByDoctorId = getPaymentsByDoctorId;
const createpayments = async (req, res) => {
    const { transactionId, totalAmount } = req.body;
    if (!transactionId || !totalAmount) {
        res.status(400).json({ error: "All fields are required" });
        return; // Prevent further execution
    }
    try {
        const newpayments = await (0, payments_service_1.createPaymentsServices)({ transactionId, totalAmount });
        if (newpayments == null) {
            res.status(500).json({ message: "Failed to create payments" });
        }
        else {
            res.status(201).json({ message: newpayments });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to create payments" });
    }
};
exports.createpayments = createpayments;
const updatepayments = async (req, res) => {
    const paymentsId = parseInt(req.params.id);
    if (isNaN(paymentsId)) {
        res.status(400).json({ error: "Invalid payments ID" });
        return; // Prevent further execution
    }
    const { transactionId, totalAmount } = req.body;
    if (!transactionId || !totalAmount) {
        res.status(400).json({ error: "All fields are required" });
        return; // Prevent further execution
    }
    try {
        const updatedpayments = await (0, payments_service_1.updatePaymentsServices)(paymentsId, { transactionId, totalAmount });
        if (updatedpayments == null) {
            res.status(404).json({ message: "payments not found or failed to update" });
        }
        else {
            res.status(200).json({ message: updatedpayments });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to update payments" });
    }
};
exports.updatepayments = updatepayments;
const deletepayments = async (req, res) => {
    const paymentsId = parseInt(req.params.id);
    if (isNaN(paymentsId)) {
        res.status(400).json({ error: "Invalid payments ID" });
        return; // Prevent further execution
    }
    try {
        const deletedpayments = await (0, payments_service_1.deletePaymentsServices)(paymentsId);
        if (deletedpayments) {
            res.status(200).json({ message: "payments deleted successfully" });
        }
        else {
            res.status(404).json({ message: "payments not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to delete payments" });
    }
};
exports.deletepayments = deletepayments;
