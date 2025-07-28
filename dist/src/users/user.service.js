"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserServices = exports.updateUserServices = exports.createUserServices = exports.getUserByIdServices = exports.getUsersServices = void 0;
//crud operations and services
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("../drizzle/db"));
const schema_1 = require("../drizzle/schema");
//CRUD Operations for User entity
//Get all users
const getUsersServices = async () => {
    return await db_1.default.query.userTable.findMany({
        orderBy: [(0, drizzle_orm_1.desc)(schema_1.userTable.userId)]
    });
};
exports.getUsersServices = getUsersServices;
//Get user by ID
const getUserByIdServices = async (userId) => {
    return await db_1.default.query.userTable.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.userTable.userId, userId)
    });
};
exports.getUserByIdServices = getUserByIdServices;
// Create a new user
const createUserServices = async (user) => {
    await db_1.default.insert(schema_1.userTable).values(user).returning();
    return "User Created Successfully 😎";
};
exports.createUserServices = createUserServices;
// Update an existing user
const updateUserServices = async (userId, user) => {
    await db_1.default.update(schema_1.userTable).set(user).where((0, drizzle_orm_1.eq)(schema_1.userTable.userId, userId));
    return "User Updated Succeffully 😎";
};
exports.updateUserServices = updateUserServices;
//delete user
const deleteUserServices = async (userId) => {
    await db_1.default.delete(schema_1.userTable).where((0, drizzle_orm_1.eq)(schema_1.userTable.userId, userId));
    return "User Delete Sucessfully";
};
exports.deleteUserServices = deleteUserServices;
