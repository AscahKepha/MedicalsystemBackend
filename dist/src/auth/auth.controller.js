"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUser = exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = require("../middleware/nodemailer");
// Drizzle ORM
const db_1 = __importDefault(require("../drizzle/db"));
const schema_1 = require("../drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
// Optional: Still using services for user creation
const auth_service_1 = require("./auth.service");
// REGISTER USER
const createUser = async (req, res) => {
    const { firstName, lastName, email, password, contactPhone, address, userType } = req.body;
    const allowedRoles = ['doctor', 'admin', 'patient'];
    const role = allowedRoles.includes(userType) ? userType : 'patient'; // Default to 'patient' if not specified or invalid
    try {
        if (!firstName || !lastName || !email || !password || !contactPhone || !address) {
            res.status(400).json({ error: "All fields are required" });
            return;
        }
        const existingUser = await (0, auth_service_1.getUserByEmailServices)(email);
        if (existingUser) {
            res.status(409).json({ error: "Email is already registered" });
            return;
        }
        const salt = bcrypt_1.default.genSaltSync(10);
        const hashedPassword = bcrypt_1.default.hashSync(password, salt);
        const newUser = await (0, auth_service_1.createUserServices)({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            contactPhone,
            address,
            userType: role,
        });
        if (role === 'patient') {
            const patientRecord = {
                userId: newUser.userId,
                firstName: newUser.firstName ?? '',
                lastName: newUser.lastName ?? '',
                contactPhone: newUser.contactPhone,
            };
            await db_1.default.insert(schema_1.patientsTable).values(patientRecord);
        }
        if (role === 'doctor') {
            const doctorRecord = {
                userId: newUser.userId,
                firstName: newUser.firstName ?? '',
                lastName: newUser.lastName ?? '',
                contactPhone: newUser.contactPhone,
                // specialization is optional; don't set if not provided
                // isAvailable defaults to false in schema
            };
            await db_1.default.insert(schema_1.doctorsTable).values(doctorRecord);
        }
        const emailResult = await (0, nodemailer_1.sendNotificationEmail)(email, firstName, "Account created successfully", "Welcome to Aura Health! Your account has been created successfully. You can now login to your account using your email and password.");
        res.status(201).json({
            message: "User created successfully",
            user: {
                id: newUser.userId,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                userType: newUser.userType,
            },
            emailMessage: emailResult,
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: error.message || "Failed to create user" });
    }
};
exports.createUser = createUser;
// LOGIN USER
const LoginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await db_1.default.query.userTable.findFirst({ where: (0, drizzle_orm_1.eq)(schema_1.userTable.email, email) });
        if (!user || !bcrypt_1.default.compareSync(password, user.password)) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        let specificId = null;
        let specificIdType;
        if (user.userType === 'patient') {
            const patient = await db_1.default.query.patientsTable.findFirst({
                where: (0, drizzle_orm_1.eq)(schema_1.patientsTable.userId, user.userId)
            });
            if (patient) {
                specificId = patient.patientId;
                specificIdType = 'patientId';
            }
        }
        else if (user.userType === 'doctor') {
            const doctor = await db_1.default.query.doctorsTable.findFirst({
                where: (0, drizzle_orm_1.eq)(schema_1.doctorsTable.userId, user.userId)
            });
            if (doctor) {
                specificId = doctor.doctorId;
                specificIdType = 'doctorId';
            }
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error("JWT_SECRET environment variable is not set");
            res.status(500).json({ error: "Server configuration error: JWT secret missing." });
            return;
        }
        const tokenPayload = {
            userId: user.userId,
            role: user.userType ?? '',
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
        };
        if (specificId !== null && specificIdType) {
            tokenPayload.specificId = specificId;
            tokenPayload.specificIdType = specificIdType;
        }
        const token = jsonwebtoken_1.default.sign(tokenPayload, jwtSecret);
        const userProfileToSend = {
            userId: user.userId,
            firstName: user.firstName ?? '',
            lastName: user.lastName ?? '',
            role: user.userType ?? '',
            email: user.email ?? '',
            contactPhone: user.contactPhone,
            address: user.address ?? undefined,
        };
        if (specificIdType === 'patientId' && specificId !== null) {
            userProfileToSend.patientId = specificId;
        }
        else if (specificIdType === 'doctorId' && specificId !== null) {
            userProfileToSend.doctorId = specificId;
        }
        res.status(200).json({
            message: 'Login successful',
            token,
            user: userProfileToSend,
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: error.message || "Failed to login user due to server error." });
    }
};
exports.LoginUser = LoginUser;
