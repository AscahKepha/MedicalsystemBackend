import { Request, Response } from "express";
import { createPrescriptionsServices, deletePrescriptionsServices, getPrescriptionsByIdServices, getPrescriptionssServices, updatePrescriptionsServices, getPrescriptionsByPatientIdServices, getPrescriptionsByDoctorIdServices } from "./prescriptions.services";

//Business logic for prescriptions-related operations


export const getPrescriptions = async (req: Request, res: Response) => {
    try {
        const allprescriptions = await getPrescriptionssServices();
        if (allprescriptions == null || allprescriptions.length == 0) {
          res.status(200).json(allprescriptions || []);
        }else{
            res.status(200).json(allprescriptions);             
        }            
    } catch (error:any) {
        res.status(500).json({ error:error.message || "Failed to fetch prescriptions" });
    }
}

export const getPrescriptionById = async (req: Request, res: Response) => {
    const prescriptionId = parseInt(req.params.id);
    if (isNaN(prescriptionId)) {
        res.status(400).json({ error: "Invalid prescriptions ID" });
         return; // Prevent further execution
    }
    try {
        const prescriptions = await getPrescriptionsByIdServices(prescriptionId);
        if (prescriptions == undefined) {
            res.status(200).json(prescriptions || []); 
        } else {
            res.status(200).json(prescriptions);
        }
    } catch (error:any) {
        res.status(500).json({ error:error.message || "Failed to fetch prescriptions" });
    }
}

export const getPrescriptionsByDoctorId = async (req: Request, res:Response)=>{
    const doctorId = parseInt(req.params.doctorId);
    if(isNaN(doctorId)){
        res.status(400).json({error: "Invalid doctor Id enter the correct Id"});
        return;
    }
    try{
        const Prescriptions = await getPrescriptionsByDoctorIdServices(doctorId);
        if (Prescriptions === null || Prescriptions.length == 0){
            res.status(200).json(Prescriptions || []); ;
        } else{
            res.status(200).json(Prescriptions);
        }
        }catch(error:any){
            res.status(500).json({error:error.message || "Failed to fetch Prescriptions"})
    }
}

export const getPrescriptionsByPatientId = async (req: Request, res:Response)=>{
    const patientId = parseInt(req.params.patientId );
    if(isNaN(patientId)){
        res.status(400).json({error: "Invalid patient Id enter the correct Id"});
        return;
    }
    try{
        const Prescriptions = await getPrescriptionsByPatientIdServices(patientId);
        if (Prescriptions === null || Prescriptions.length == 0){
            res.status(200).json([]);
        } else{
            res.status(200).json(Prescriptions);
        }
        }catch(error:any){
            res.status(500).json({error:error.message || "Failed to fetch Prescriptions"})
    }
}

export const createprescriptions = async (req: Request, res: Response) => {
    const { notes } = req.body;
    if (!notes) {
        res.status(400).json({ error: "All fields are required" });
        return; // Prevent further execution
    }
    try {

        
        const newPrescriptions = await createPrescriptionsServices({ notes });
        if (newPrescriptions == null) {
            res.status(500).json({ message: "Failed to create prescriptions" });
        } else {
            res.status(201).json({message:newPrescriptions});
        }
    } catch (error:any) {
        res.status(500).json({ error:error.message || "Failed to create prescriptions" });
    }
}

export const updatePrescriptions = async (req: Request, res: Response) => {
    const prescriptionsId = parseInt(req.params.id);
    if (isNaN(prescriptionsId)) {
        res.status(400).json({ error: "Invalid prescriptions ID" });
        return; // Prevent further execution
    }
    const { notes} = req.body;
    if (!notes) {
        res.status(400).json({ error: "All fields are required" });
        return; // Prevent further execution
    }
    try {
        const updatedPrescriptions = await updatePrescriptionsServices(prescriptionsId, { notes});
        if (updatedPrescriptions == null) {
            res.status(404).json({ message: "prescriptions not found or failed to update" });
        } else {
            res.status(200).json({message:updatedPrescriptions});
        }
    } catch (error:any) {
        res.status(500).json({ error:error.message || "Failed to update prescriptions" });
    }
}



export const deletePrescriptions = async (req: Request, res: Response) => {
    const prescriptionsId = parseInt(req.params.id);  
    if (isNaN(prescriptionsId)) {
        res.status(400).json({ error: "Invalid prescriptions ID" });
        return; // Prevent further execution
    }
    try {
        const deletedPrescriptions = await deletePrescriptionsServices(prescriptionsId);
        if (deletedPrescriptions) {
            res.status(200).json({ message: "prescriptions deleted successfully" });
        } else {
            res.status(404).json({ message: "prescriptions not found" });
        }
    } catch (error:any) {    
        res.status(500).json({ error:error.message || "Failed to delete prescriptions" });
    }    
}