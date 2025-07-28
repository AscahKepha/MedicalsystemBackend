"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePrescriptionsServices = exports.updatePrescriptionsServices = exports.createPrescriptionsServices = exports.getPrescriptionsByDoctorIdServices = exports.getPrescriptionsByPatientIdServices = exports.getPrescriptionsByIdServices = exports.getPrescriptionssServices = void 0;
//crud operations and services
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("../drizzle/db"));
const schema_1 = require("../drizzle/schema");
//CRUD Operations for prescriptions entity
//Get all prescriptionss
const getPrescriptionssServices = async () => {
    return await db_1.default.query.prescriptionsTable.findMany({
        orderBy: [(0, drizzle_orm_1.desc)(schema_1.prescriptionsTable.prescriptionId)]
    });
};
exports.getPrescriptionssServices = getPrescriptionssServices;
//Get prescriptions by ID
const getPrescriptionsByIdServices = async (prescriptionId) => {
    return await db_1.default.query.prescriptionsTable.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.prescriptionsTable.prescriptionId, prescriptionId)
    });
};
exports.getPrescriptionsByIdServices = getPrescriptionsByIdServices;
//get prescriptions by patientId
const getPrescriptionsByPatientIdServices = async (patientId) => {
    return await db_1.default.query.prescriptionsTable.findMany({
        where: (0, drizzle_orm_1.eq)(schema_1.prescriptionsTable.patientId, patientId)
    });
};
exports.getPrescriptionsByPatientIdServices = getPrescriptionsByPatientIdServices;
//get prescriptions by doctorId
const getPrescriptionsByDoctorIdServices = async (doctorId) => {
    return await db_1.default.query.prescriptionsTable.findMany({
        where: (0, drizzle_orm_1.eq)(schema_1.prescriptionsTable.doctorId, doctorId)
    });
};
exports.getPrescriptionsByDoctorIdServices = getPrescriptionsByDoctorIdServices;
// Create a new prescriptions
const createPrescriptionsServices = async (prescriptions) => {
    await db_1.default.insert(schema_1.prescriptionsTable).values(prescriptions).returning();
    return "prescriptions Created Successfully 😎";
};
exports.createPrescriptionsServices = createPrescriptionsServices;
// Update an existing prescriptions
const updatePrescriptionsServices = async (prescriptionId, prescriptions) => {
    await db_1.default.update(schema_1.prescriptionsTable).set(prescriptions).where((0, drizzle_orm_1.eq)(schema_1.prescriptionsTable.prescriptionId, prescriptionId));
    return "prescriptions Updated Succeffully 😎";
};
exports.updatePrescriptionsServices = updatePrescriptionsServices;
//delete prescriptions
const deletePrescriptionsServices = async (prescriptionId) => {
    await db_1.default.delete(schema_1.prescriptionsTable).where((0, drizzle_orm_1.eq)(schema_1.prescriptionsTable.prescriptionId, prescriptionId));
    return "prescriptions deleted Sucessfully";
};
exports.deletePrescriptionsServices = deletePrescriptionsServices;
