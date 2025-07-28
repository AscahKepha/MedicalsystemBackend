//crud operations and services
import {eq, desc} from "drizzle-orm";
import db from "../drizzle/db";
import {appointmentsTable, TAppointmentsSelect, TAppointmentsInsert} from "../drizzle/schema";


//CRUD Operations for appointments entity


//Get all appointments
export const getAppointmentsServices = async():Promise<TAppointmentsSelect[] | null> => {
     return await  db.query.appointmentsTable.findMany({
       orderBy:[desc(appointmentsTable.appointmentId)]
     });
}

//Get appointments by ID
export const getAppointmentsByIdServices = async(appointmentsId: number):Promise<TAppointmentsSelect | undefined>=> {
      return await db.query.appointmentsTable.findFirst({
        where: eq(appointmentsTable.appointmentId,appointmentsId)
      }) 
}

//get appointments by patientId
export const getAppointmentByPatientIdServices = async (patientId: number):Promise<TAppointmentsSelect[] | null> =>{ //findfirst must hsve undefined if it's values are not there
  return await db.query.appointmentsTable.findMany({
    where: eq(appointmentsTable.patientId, patientId)
  })
}

//get appointments by doctorId
export const getAppointmentByDoctorIdServices = async (doctorId: number):Promise<TAppointmentsSelect[] | null> =>{
  return await db.query.appointmentsTable.findMany({
    where: eq(appointmentsTable.doctorId, doctorId)
  })
}

// Create a new appointment
export const createAppointmentsServices = async (
  appointments: TAppointmentsInsert
): Promise<any> => {
  const [createdAppointment] = await db
    .insert(appointmentsTable)
    .values(appointments)
    .returning();

  console.log("✅ Appointment inserted into DB:", createdAppointment);

  return createdAppointment;
};


// Update an existing appointments
export const updateAppointmentsServices = async(appointmentsId: number, appointments:TAppointmentsInsert):Promise<string> => {
    await db.update(appointmentsTable).set(appointments).where(eq(appointmentsTable.appointmentId,appointmentsId));
    return "appointments Updated Succeffully 😎";
}

//delete appointments
export const deleteAppointmentsServices = async(appointmentsId: number):Promise<string> => {
   await db.delete(appointmentsTable).where(eq(appointmentsTable.appointmentId,appointmentsId));
   return "appointments Delete Sucessfully";
}
