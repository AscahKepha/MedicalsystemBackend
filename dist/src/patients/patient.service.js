"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePatientServices = exports.updatePatientServices = exports.createPatientServices = exports.getPatientsByIdServices = exports.getPatientsServices = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("../drizzle/db")); //default export not a named so we dont use curly braces
const schema_1 = require("../drizzle/schema");
//Get all patients
const getPatientsServices = async () => {
    return await db_1.default.query.patientsTable.findMany({
        orderBy: [(0, drizzle_orm_1.desc)(schema_1.patientsTable.patientId)]
    });
};
exports.getPatientsServices = getPatientsServices;
const getPatientsByIdServices = async (patientId) => {
    return await db_1.default.query.patientsTable.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.patientsTable.patientId, patientId)
    });
};
exports.getPatientsByIdServices = getPatientsByIdServices;
//Create patient
const createPatientServices = async (patient) => {
    await db_1.default.insert(schema_1.patientsTable).values(patient).returning();
    return "Patient created 🍂";
};
exports.createPatientServices = createPatientServices;
// Update patient
const updatePatientServices = async (patientId, patient) => {
    await db_1.default.update(schema_1.patientsTable).set(patient).where((0, drizzle_orm_1.eq)(schema_1.patientsTable.patientId, patientId));
    return "Patient updated 😃";
};
exports.updatePatientServices = updatePatientServices;
//Delete patient
const deletePatientServices = async (patientId) => {
    await db_1.default.delete(schema_1.patientsTable).where((0, drizzle_orm_1.eq)(schema_1.patientsTable.patientId, patientId));
    return "Patient deleted 😵";
};
exports.deletePatientServices = deletePatientServices;
