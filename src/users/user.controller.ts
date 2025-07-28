import { Request, Response } from "express";
import {
    createUserServices,
    deleteUserServices,
    getUserByIdServices,
    getUsersServices,
    updateUserServices
} from "./user.service";

// GET all users (admin only — enforced via route middleware)
export const getUsers = async (req: Request, res: Response) => {
    try {
        const allUsers = await getUsersServices();
        if (!allUsers || allUsers.length === 0) {
            console.log(allUsers);
            res.status(404).json({ message: "No users found" });
            return;
        }

        const usersWithoutPasswords = allUsers.map(({ password, ...user }) => user);
        res.status(200).json(usersWithoutPasswords);
        return;
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to fetch users" });
        return;
    }
};

// GET user by ID (admin can access any, patient can only access their own)
export const getUserById = async (req: Request, res: Response) => {
    const requestedId = parseInt(req.params.id);

    if (isNaN(requestedId)) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
    }

    try {
        const requester = req.user;

        if (requester?.role === "patient" && parseInt(requester.userId.toString()) !== requestedId) {
            res.status(403).json({ error: "Forbidden: patients can only access their own profile" });
            return;
        }

        const user = await getUserByIdServices(requestedId);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const { password, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
        return;
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to fetch user" });
        return;
    }
};

// 🧪 POST create user (public or admin, no role check here)
export const createUser = async (req: Request, res: Response) => {
    const { firstName, lastName, email, password, contactPhone, address } = req.body;

    if (!firstName || !lastName || !email || !password || !contactPhone || !address) {
        res.status(400).json({ error: "All fields are required" });
        return;
    }

    try {
        const newUser = await createUserServices({ firstName, lastName, email, password, contactPhone, address });

        if (!newUser) {
            res.status(500).json({ message: "Failed to create user" });
            return;
        }

        res.status(201).json({ message: newUser });
        return;
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to create user" });
        return;
    }
};

import { doctorsTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import db from "../drizzle/db";

// adjust as needed
export const updateUser = async (req: Request, res: Response) => {
    const requestedId = parseInt(req.params.id);
    console.log("🔍 Requested user ID:", requestedId);

    if (isNaN(requestedId)) {
         res.status(400).json({ error: "Invalid user ID" });
         return;
    }

    const {
        firstName,
        lastName,
        email,
        password,
        address,
        contactPhone,
        specialization,
        isAvailable,
        availability,
    } = req.body;

    console.log("📥 Incoming update payload:", req.body);

    if (!firstName || !lastName || !email || !contactPhone) {
         res.status(400).json({
            error: "Required fields missing: firstName, lastName, email, or contactPhone",
        });
        return;
    }

    try {
        const requester = req.user;
        console.log("👤 Authenticated requester:", requester);

        if (
            requester?.role === "patient" &&
            parseInt(requester.userId.toString()) !== requestedId
        ) {
            res.status(403).json({
                error: "Forbidden: patients can only update their own profile",
            });
            return; 
        }

        // Step 1: Update the main user table
        const userUpdates: any = {
            firstName,
            lastName,
            email,
            contactPhone,
            address: address || null,
        };

        if (password && password.trim() !== "") {
            userUpdates.password = password;
        }

        const updatedUser = await updateUserServices(requestedId, userUpdates);

        if (!updatedUser) {
            res
                .status(404)
                .json({ error: "User not found or failed to update" });
                return;
        }

        // Step 2: If role is doctor, update doctor profile
        if (requester?.role === "doctor") {
            console.log("🩺 Updating doctor profile...");

            // Validate availability format if provided
            let parsedAvailability = undefined;
            if (availability) {
                try {
                    parsedAvailability = Array.isArray(availability)
                        ? availability
                        : JSON.parse(availability);
                } catch (err) {
                   res.status(400).json({ error: "Invalid availability format" });
                   return; 
                }
            }

            await db
                .update(doctorsTable)
                .set({
                    firstName,
                    lastName,
                    specialization: specialization || undefined,
                    contactPhone,
                    isAvailable: isAvailable === true || isAvailable === "true",
                    availability: parsedAvailability || [],
                    updatedAt: new Date(),
                })
                .where(eq(doctorsTable.userId, requestedId));
        }

        console.log("✅ Profile update successful");
         res.status(200).json({ message: "Profile updated successfully" });
         return;
    } catch (error: any) {
        console.error("❌ Update error:", error);
         res
            .status(500)
            .json({ error: error.message || "Failed to update user" });
            return;
    }
};


// 🗑️ DELETE user (admin can delete any, patient can only delete self)
export const deleteUser = async (req: Request, res: Response) => {
    const requestedId = parseInt(req.params.id);

    if (isNaN(requestedId)) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
    }

    try {
        const requester = req.user;

        if (!requester) {
            res.status(401).json({ error: "Unauthorized: no user information found in request" });
            return;
        }

        const isOwner = parseInt(requester.userId.toString()) === requestedId;
        const isAdmin = requester.role === "admin";

        if (!isOwner && !isAdmin) {
            res.status(403).json({ error: "Forbidden: you cannot delete another user's account" });
            return;
        }

        const deletedUser = await deleteUserServices(requestedId);

        if (!deletedUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json({ message: "User deleted successfully" });
        return;
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to delete user" });
        return;
    }
};
