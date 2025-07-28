"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logger_1 = require("./middleware/logger");
const user_route_1 = require("./users/user.route");
const doctors_route_1 = require("./doctors/doctors.route");
const patient_route_1 = require("./patients/patient.route");
const appointments_route_1 = require("./appointments/appointments.route");
const payments_route_1 = require("./payments/payments.route");
const complaints_route_1 = require("./complaints/complaints.route");
const prescriptions_route_1 = require("./prescriptions/prescriptions.route");
// import { rateLimiterMiddleware } from "./middleware/rateLimiter";
const cors_1 = __importDefault(require("cors"));
const auth_route_1 = require("./auth/auth.route");
const rateLimiter_1 = require("./middleware/rateLimiter");
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
//Basic Middleware
app.use((0, cors_1.default)()); // cross origin resource shairing prevents web pages from making request to a different domain than the one the page originated from
app.use(express_1.default.json()); //It parses incoming requests with JSON payloads
app.use(express_1.default.urlencoded({ extended: true }));
app.use(logger_1.logger); //It's typically used for logging details about incoming requests to the console or a log file
app.use(rateLimiter_1.rateLimiterMiddleware);
// app.use(rateLimiterMiddleware)
//default route
app.get('/', (req, res) => {
    res.send("Welcome to Express Api Backend With Drizzle ORM and Postgresql");
});
//import routes 
app.use('/api', user_route_1.userRouter);
app.use('/api', doctors_route_1.doctorsRouter);
app.use('/api', patient_route_1.patientRouter);
app.use('/api', appointments_route_1.appointmentRouter);
app.use('/api', payments_route_1.paymentsRouter);
app.use('/api', complaints_route_1.complaintsRouter);
app.use('/api', prescriptions_route_1.prescriptionsRouter);
app.use('/api', auth_route_1.authRouter);
exports.default = app;
