"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//create a transporter
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    secure: true,
    auth: {
        user: process.env.EMAIL_SENDER, //we are passing the email address from the environment variable to hide credentials
        pass: process.env.EMAIL_PASSWORD
    }
});
// transporter.sendMail({
//     from: `Aura Health ${process.env.EMAIL_SENDER}`,
//     to: "moraaascah00@gmail.com",
//     subject: "Medicalsystem Notification mails",
//     text: "Hello from your SMTP Mailer"
// },(error, info)=>{
//     if (error) return console.error(error);
//     console.log('Email sent:', info.response)
// })
const sendNotificationEmail = async (email, subject, fullName, message) => {
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            secure: true,
            auth: {
                user: process.env.EMAIL_SENDER, //we are passing the email address from the environment variable to hide credentials
                pass: process.env.EMAIL_PASSWORD
            }
        });
        const mailOptions = {
            from: `Aura Health ${process.env.EMAIL_SENDER}`,
            to: email,
            subject: subject,
            text: `Hey ${fullName}, ${message}\n`,
            html: `<html>
    <head>
    <style>
    .email-container{
    backgroundcolor}</style>
    </head>
    <body>
    <div className="email-container">
    <h2>${subject}</h2>
    <p>Hello,Hey, ${fullName}, ${message}</p>
    <p>Aura health your wellness our priority</p>
    </div>
    </body>
    </html>`,
        };
        const mailResponse = await transporter.sendMail(mailOptions);
        if (mailResponse.accepted.length > 0) {
            return "Notification email sent successfully";
        }
        else if (mailResponse.rejected.length > 0) {
            return "Failed to send notification email, try again";
        }
        else {
            return "Email server error";
        }
    }
    catch (error) {
        return "Email server error";
    }
};
exports.sendNotificationEmail = sendNotificationEmail;
