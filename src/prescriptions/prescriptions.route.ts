import { Router } from "express";
import { createprescriptions, deletePrescriptions, getPrescriptionById, getPrescriptions, getPrescriptionsByDoctorId, getPrescriptionsByPatientId, updatePrescriptions } from "./prescriptions.controller";
import { adminRoleAuth, allRoleAuth, patientRoleAuth, doctorRoleAuth } from "../middleware/bearAuth";

export const prescriptionsRouter = Router();

// prescription routes definition


// Get all prescriptions
prescriptionsRouter.get('/prescriptions',adminRoleAuth, getPrescriptions);

// Get prescription by ID
prescriptionsRouter.get('/prescriptions/:id', allRoleAuth, getPrescriptionById);

//Get specifiec doctor appointments
prescriptionsRouter.get('/doctors/:doctorId/prescriptions', doctorRoleAuth, getPrescriptionsByDoctorId)

//Get specific Patient appointments
prescriptionsRouter.get('/patients/:patientId/prescriptions', patientRoleAuth, getPrescriptionsByPatientId)

// Create a new prescription
prescriptionsRouter.post('/prescriptions', doctorRoleAuth, createprescriptions);

// Update an existing prescription
prescriptionsRouter.put('/prescriptions/:id',doctorRoleAuth, updatePrescriptions);


// Delete an existing prescription
prescriptionsRouter.delete('/prescriptions/:id',adminRoleAuth, deletePrescriptions);