"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDoctorsServices = exports.updateDoctorsServices = exports.createDoctorsServices = exports.getDoctorsByIdServices = exports.getDoctorsServices = void 0;
//crud operations and services
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("../drizzle/db"));
const schema_1 = require("../drizzle/schema");
//CRUD Operations for doctors entity
//Get all doctorss
const getDoctorsServices = async () => {
    return await db_1.default.query.doctorsTable.findMany({
        orderBy: [(0, drizzle_orm_1.desc)(schema_1.doctorsTable.doctorId)]
    });
};
exports.getDoctorsServices = getDoctorsServices;
//Get doctors by ID
const getDoctorsByIdServices = async (doctorId) => {
    return await db_1.default.query.doctorsTable.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.doctorsTable.doctorId, doctorId)
    });
};
exports.getDoctorsByIdServices = getDoctorsByIdServices;
// Create a new doctor
const createDoctorsServices = async (doctor) => {
    await db_1.default.insert(schema_1.doctorsTable).values(doctor).returning();
    return "doctor Created Successfully 😎";
};
exports.createDoctorsServices = createDoctorsServices;
// Update an existing doctors
const updateDoctorsServices = async (doctorsId, doctors) => {
    await db_1.default.update(schema_1.doctorsTable).set(doctors).where((0, drizzle_orm_1.eq)(schema_1.doctorsTable.doctorId, doctorsId));
    return "doctors Updated Succeffully 😎";
};
exports.updateDoctorsServices = updateDoctorsServices;
//delete doctors
const deleteDoctorsServices = async (doctorsId) => {
    await db_1.default.delete(schema_1.doctorsTable).where((0, drizzle_orm_1.eq)(schema_1.doctorsTable.doctorId, doctorsId));
    return "doctors Delete Sucessfully";
};
exports.deleteDoctorsServices = deleteDoctorsServices;
