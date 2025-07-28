"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByEmailServices = exports.createUserServices = void 0;
//register a new user
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("../drizzle/db"));
const schema_1 = require("../drizzle/schema");
// Create a new user
const createUserServices = async (user) => {
    const [createdUser] = await db_1.default
        .insert(schema_1.userTable)
        .values(user)
        .returning(); // returns an array of inserted rows
    return createdUser;
};
exports.createUserServices = createUserServices;
//get user by email
const getUserByEmailServices = async (email) => {
    return await db_1.default.query.userTable.findFirst({
        where: ((0, drizzle_orm_1.eq)(schema_1.userTable.email, email))
    });
};
exports.getUserByEmailServices = getUserByEmailServices;
