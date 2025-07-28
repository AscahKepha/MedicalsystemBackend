"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//drizzle-kit used for migrations,seeding,pushing..
require("dotenv/config");
const drizzle_kit_1 = require("drizzle-kit");
exports.default = (0, drizzle_kit_1.defineConfig)({
    dialect: "postgresql",
    schema: "./src/drizzle/schema.ts",
    out: "./src/drizzle/migrations",
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
    verbose: true, //means to enable or set to true detailed output in what is shown at the screen when logging or output
    strict: true,
});
