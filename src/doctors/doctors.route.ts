import { Router } from "express";
import { createDoctors, deleteDoctors, getDoctorsById, getDoctors, updateDoctors } from "./doctors.controller";
import { adminRoleAuth, allRoleAuth, patientRoleAuth, doctorRoleAuth } from "../middleware/bearAuth";
export const doctorsRouter = Router();

// doctors routes definition


// Get all doctorss
doctorsRouter.get('/doctors', getDoctors);

// Get doctors by ID
doctorsRouter.get('/doctors/:id', allRoleAuth, getDoctorsById);

// Create a new doctors
doctorsRouter.post('/doctors', adminRoleAuth, createDoctors);

// Update an existing doctors
doctorsRouter.put('/doctors/:id',adminRoleAuth, updateDoctors);


// Delete an existing doctors
doctorsRouter.delete('/doctors/:id',adminRoleAuth, deleteDoctors);