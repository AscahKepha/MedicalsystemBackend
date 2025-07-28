//crud operations and services
import {eq, desc} from "drizzle-orm";
import db from "../drizzle/db";
import {prescriptionsTable, TPrescriptionsSelect, TPrescriptionsInsert} from "../drizzle/schema";


//CRUD Operations for prescriptions entity


//Get all prescriptionss
export const getPrescriptionssServices = async():Promise<TPrescriptionsSelect[] | null> => {
     return await  db.query.prescriptionsTable.findMany({
       orderBy:[desc(prescriptionsTable.prescriptionId)]
     });
}

//Get prescriptions by ID
export const getPrescriptionsByIdServices = async(prescriptionId: number):Promise<TPrescriptionsSelect | undefined>=> {
      return await db.query.prescriptionsTable.findFirst({
        where: eq(prescriptionsTable.prescriptionId,prescriptionId)
      }) 
}

//get prescriptions by patientId
export const getPrescriptionsByPatientIdServices = async (patientId: number):Promise<TPrescriptionsSelect[] | null> =>{ //findfirst must hsve undefined if it's values are not there
  return await db.query.prescriptionsTable.findMany({
    where: eq(prescriptionsTable.patientId, patientId)
  })
}

//get prescriptions by doctorId
export const getPrescriptionsByDoctorIdServices = async (doctorId: number):Promise<TPrescriptionsSelect[] | null> =>{
  return await db.query.prescriptionsTable.findMany({
    where: eq(prescriptionsTable.doctorId, doctorId)
  })
}

// Create a new prescriptions
export const createPrescriptionsServices = async(prescriptions:TPrescriptionsInsert):Promise<string> => {
       await db.insert(prescriptionsTable).values(prescriptions).returning();
        return "prescriptions Created Successfully 😎"
}

// Update an existing prescriptions
export const updatePrescriptionsServices = async(prescriptionId: number, prescriptions:TPrescriptionsInsert):Promise<string> => {
    await db.update(prescriptionsTable).set(prescriptions).where(eq(prescriptionsTable.prescriptionId,prescriptionId));
    return "prescriptions Updated Succeffully 😎";
}

//delete prescriptions
export const deletePrescriptionsServices = async(prescriptionId: number):Promise<string> => {
   await db.delete(prescriptionsTable).where(eq(prescriptionsTable.prescriptionId,prescriptionId));
   return "prescriptions deleted Sucessfully";
}