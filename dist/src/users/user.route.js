"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const bearAuth_1 = require("../middleware/bearAuth");
exports.userRouter = (0, express_1.Router)();
// User routes definition
// Get all users
exports.userRouter.get('/users', bearAuth_1.adminRoleAuth, user_controller_1.getUsers);
// Get user by ID
exports.userRouter.get('/users/:id', bearAuth_1.allRoleAuth, user_controller_1.getUserById);
// Create a new user
exports.userRouter.post('/users', bearAuth_1.adminRoleAuth, user_controller_1.createUser);
exports.userRouter.put('/users/:id', bearAuth_1.allRoleAuth, user_controller_1.updateUser);
// Delete an existing user
exports.userRouter.delete('/users/:id', bearAuth_1.adminRoleAuth, user_controller_1.deleteUser);
