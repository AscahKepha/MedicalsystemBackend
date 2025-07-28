"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComplaintsServices = exports.updateComplaintsServices = exports.createComplaintsServices = exports.getComplaintsByUserIdServices = exports.getComplaintsByIdServices = exports.getComplaintsServices = void 0;
//crud operations and services
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("../drizzle/db"));
const schema_1 = require("../drizzle/schema");
//CRUD Operations for complaints entity
//Get all complaintss
const getComplaintsServices = async () => {
    return await db_1.default.query.complaintsTable.findMany({
        orderBy: [(0, drizzle_orm_1.desc)(schema_1.complaintsTable.complaintsId)]
    });
};
exports.getComplaintsServices = getComplaintsServices;
//Get complaints by ID
const getComplaintsByIdServices = async (complaintsId) => {
    return await db_1.default.query.complaintsTable.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.complaintsTable.complaintsId, complaintsId)
    });
};
exports.getComplaintsByIdServices = getComplaintsByIdServices;
//get complaints by userId
const getComplaintsByUserIdServices = async (userId) => {
    return await db_1.default.query.complaintsTable.findMany({
        where: (0, drizzle_orm_1.eq)(schema_1.complaintsTable.userId, userId)
    });
};
exports.getComplaintsByUserIdServices = getComplaintsByUserIdServices;
// Create a new complaints
const createComplaintsServices = async (complaints) => {
    await db_1.default.insert(schema_1.complaintsTable).values(complaints).returning();
    return "complaints Created Successfully 😎";
};
exports.createComplaintsServices = createComplaintsServices;
// Update an existing complaints
const updateComplaintsServices = async (complaintsId, complaints) => {
    await db_1.default.update(schema_1.complaintsTable).set(complaints).where((0, drizzle_orm_1.eq)(schema_1.complaintsTable.complaintsId, complaintsId));
    return "complaints Updated Succeffully 😎";
};
exports.updateComplaintsServices = updateComplaintsServices;
//delete complaints
const deleteComplaintsServices = async (complaintsId) => {
    await db_1.default.delete(schema_1.complaintsTable).where((0, drizzle_orm_1.eq)(schema_1.complaintsTable.complaintsId, complaintsId));
    return "complaints Delete Sucessfully";
};
exports.deleteComplaintsServices = deleteComplaintsServices;
