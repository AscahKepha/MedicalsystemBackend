"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiterMiddleware = void 0;
const rate_limiter_flexible_1 = require("rate-limiter-flexible"); //named export
//define options/value for rate limiter 
const rateLimiter = new rate_limiter_flexible_1.RateLimiterMemory({
    points: 10, // Number of requests
    duration: 60 //per second
});
const rateLimiterMiddleware = async (req, res, next) => {
    try {
        await rateLimiter.consume(req.ip || 'unknown'); // Consume a point for the request
        console.log(`Rate Liit check passed for IP: ${req.ip}`);
        next();
    }
    catch (error) {
        res.status(429).json({ error: "To many reguests, please try again later." });
    }
};
exports.rateLimiterMiddleware = rateLimiterMiddleware;
