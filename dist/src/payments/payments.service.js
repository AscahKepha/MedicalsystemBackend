"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePaymentsServices = exports.updatePaymentsServices = exports.createPaymentsServices = exports.getPaymentsByDoctorServices = exports.getPaymentsByPatientIdServices = exports.getPaymentsByIdServices = exports.getPaymentsServices = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("../drizzle/db"));
const schema_1 = require("../drizzle/schema");
// ✅ Get all payments
const getPaymentsServices = async () => {
    try {
        const payments = await db_1.default.query.paymentsTable.findMany({
            orderBy: [(0, drizzle_orm_1.desc)(schema_1.paymentsTable.paymentId)],
        });
        return payments;
    }
    catch (error) {
        console.error("Error in getPaymentsServices:", error);
        return null;
    }
};
exports.getPaymentsServices = getPaymentsServices;
// ✅ Get payment by ID
const getPaymentsByIdServices = async (paymentId) => {
    try {
        return await db_1.default.query.paymentsTable.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.paymentsTable.paymentId, paymentId),
        });
    }
    catch (error) {
        console.error("Error in getPaymentsByIdServices:", error);
        return undefined;
    }
};
exports.getPaymentsByIdServices = getPaymentsByIdServices;
// ✅ Get payments by patient ID
const getPaymentsByPatientIdServices = async (patientId) => {
    try {
        const payments = await db_1.default
            .select()
            .from(schema_1.paymentsTable)
            .leftJoin(schema_1.appointmentsTable, (0, drizzle_orm_1.eq)(schema_1.paymentsTable.appointmentId, schema_1.appointmentsTable.appointmentId))
            .where((0, drizzle_orm_1.eq)(schema_1.appointmentsTable.patientId, patientId))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.paymentsTable.paymentDate));
        return payments;
    }
    catch (error) {
        console.error("Error in getPaymentsByPatientIdServices:", error);
        throw new Error("Failed to fetch payments by patient ID");
    }
};
exports.getPaymentsByPatientIdServices = getPaymentsByPatientIdServices;
// ✅ Get payments by doctor ID
const getPaymentsByDoctorServices = async (doctorId) => {
    try {
        const payments = await db_1.default
            .select()
            .from(schema_1.paymentsTable)
            .leftJoin(schema_1.appointmentsTable, (0, drizzle_orm_1.eq)(schema_1.paymentsTable.appointmentId, schema_1.appointmentsTable.appointmentId))
            .where((0, drizzle_orm_1.eq)(schema_1.appointmentsTable.doctorId, doctorId))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.paymentsTable.paymentDate));
        return payments;
    }
    catch (error) {
        console.error("Error in getPaymentsByDoctorServices:", error);
        throw new Error("Failed to fetch payments by doctor ID");
    }
};
exports.getPaymentsByDoctorServices = getPaymentsByDoctorServices;
// ✅ Create a new payment
const createPaymentsServices = async (payment) => {
    try {
        await db_1.default.insert(schema_1.paymentsTable).values(payment).returning();
        return "✅ Payment created successfully!";
    }
    catch (error) {
        console.error("Error in createPaymentsServices:", error);
        throw new Error("Failed to create payment");
    }
};
exports.createPaymentsServices = createPaymentsServices;
// ✅ Update an existing payment
const updatePaymentsServices = async (paymentId, payment) => {
    try {
        await db_1.default
            .update(schema_1.paymentsTable)
            .set(payment)
            .where((0, drizzle_orm_1.eq)(schema_1.paymentsTable.paymentId, paymentId));
        return "✅ Payment updated successfully!";
    }
    catch (error) {
        console.error("Error in updatePaymentsServices:", error);
        throw new Error("Failed to update payment");
    }
};
exports.updatePaymentsServices = updatePaymentsServices;
// ✅ Delete payment
const deletePaymentsServices = async (paymentId) => {
    try {
        await db_1.default
            .delete(schema_1.paymentsTable)
            .where((0, drizzle_orm_1.eq)(schema_1.paymentsTable.paymentId, paymentId));
        return "🗑️ Payment deleted successfully!";
    }
    catch (error) {
        console.error("Error in deletePaymentsServices:", error);
        throw new Error("Failed to delete payment");
    }
};
exports.deletePaymentsServices = deletePaymentsServices;
