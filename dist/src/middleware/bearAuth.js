"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allRoleAuth = exports.patientRoleAuth = exports.doctorRoleAuth = exports.adminRoleAuth = exports.authMiddleware = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// 🔐 Token verification logic
const verifyToken = async (token, secret) => {
    try {
        console.log("🔍 Verifying token...");
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        console.log("✅ Token verified. Decoded payload:", decoded);
        return decoded;
    }
    catch (error) {
        console.error("❌ JWT Verification Error in verifyToken:", error.message);
        return null;
    }
};
exports.verifyToken = verifyToken;
// 🔒 Main middleware for authentication + role-based access
const authMiddleware = async (req, res, next, requiredRoles) => {
    console.log("\n🛡️ Running auth middleware...");
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.warn("⚠️ No Authorization header or malformed format");
        res.status(401).json({ error: "Access denied, no token or authorization header provided" });
        return;
    }
    const token = authHeader.split(' ')[1];
    console.log('🔐 Token extracted:', token.substring(0, 15) + '...');
    console.log('🔑 JWT_SECRET loaded:', process.env.JWT_SECRET ? 'Present' : 'Missing');
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        console.error("❌ JWT secret not defined in environment variables");
        res.status(500).json({ error: "JWT secret not configured on server" });
        return;
    }
    const decodedToken = await (0, exports.verifyToken)(token, jwtSecret);
    if (!decodedToken) {
        console.warn("⛔ Invalid or expired token");
        res.status(401).json({ error: "Invalid or expired token" });
        return;
    }
    req.user = decodedToken;
    // ✅ Use `role` instead of `userType`
    const userType = decodedToken.role;
    console.log("👤 Authenticated user:", {
        userId: decodedToken.userId,
        email: decodedToken.email,
        userType: userType,
    });
    console.log("🧠 Required role:", requiredRoles);
    console.log("🧠 User role:", userType);
    if (requiredRoles === "all") {
        if (["admin", "doctor", "patient"].includes(userType)) {
            console.log("✅ Access granted to all roles");
            next();
            return;
        }
    }
    else if (userType === requiredRoles) {
        console.log(`✅ Access granted to ${userType}`);
        next();
        return;
    }
    console.warn("🚫 Access denied: insufficient role");
    res.status(403).json({ error: "Forbidden: you do not have permission to access this resource" });
};
exports.authMiddleware = authMiddleware;
// ✅ Middleware shortcuts
const adminRoleAuth = async (req, res, next) => await (0, exports.authMiddleware)(req, res, next, "admin");
exports.adminRoleAuth = adminRoleAuth;
const doctorRoleAuth = async (req, res, next) => await (0, exports.authMiddleware)(req, res, next, "doctor");
exports.doctorRoleAuth = doctorRoleAuth;
const patientRoleAuth = async (req, res, next) => await (0, exports.authMiddleware)(req, res, next, "patient");
exports.patientRoleAuth = patientRoleAuth;
const allRoleAuth = async (req, res, next) => await (0, exports.authMiddleware)(req, res, next, "all");
exports.allRoleAuth = allRoleAuth;
