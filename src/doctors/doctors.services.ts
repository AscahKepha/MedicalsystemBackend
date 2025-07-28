//crud operations and services
import {eq, desc} from "drizzle-orm";
import db from "../drizzle/db";
import {doctorsTable, TDoctorSelect, TDoctorInsert} from "../drizzle/schema";


//CRUD Operations for doctors entity


//Get all doctorss
export const getDoctorsServices = async():Promise<TDoctorSelect[] | null> => {
     return await  db.query.doctorsTable.findMany({
       orderBy:[desc(doctorsTable.doctorId)]
     });
}

//Get doctors by ID
export const getDoctorsByIdServices = async(doctorId: number):Promise<TDoctorSelect | undefined>=> {
      return await db.query.doctorsTable.findFirst({
        where: eq(doctorsTable.doctorId,doctorId)
      }) 
}

// Create a new doctor
export const createDoctorsServices = async(doctor:TDoctorInsert):Promise<string> => {
       await db.insert(doctorsTable).values(doctor).returning();
        return "doctor Created Successfully 😎"
}

// Update an existing doctors
export const updateDoctorsServices = async(doctorsId: number, doctors:TDoctorInsert):Promise<string> => {
    await db.update(doctorsTable).set(doctors).where(eq(doctorsTable.doctorId,doctorsId));
    return "doctors Updated Succeffully 😎";
}

//delete doctors
export const deleteDoctorsServices = async(doctorsId: number):Promise<string> => {
   await db.delete(doctorsTable).where(eq(doctorsTable.doctorId,doctorsId));
   return "doctors Delete Sucessfully";
}