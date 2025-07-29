import { eq, desc } from "drizzle-orm";
import db from "../drizzle/db";
import {
  appointmentsTable,
  TAppointmentsSelect,
  TAppointmentsInsert,
} from "../drizzle/schema";

// ✅ Get all appointments WITH doctor & patient user info
export const getAppointmentsServices = async (): Promise<any[] | null> => {
  const appointments = await db.query.appointmentsTable.findMany({
    orderBy: [desc(appointmentsTable.appointmentId)],
    with: {
      doctor: {
        with: {
          user: true, // 🧑‍⚕️ include doctor's full user data
        },
      },
      patient: {
        with: {
          user: true, // 🧑‍💼 include patient's full user data
        },
      },
    },
  });

  console.log('Appointments fetched with doctor & patient info:', JSON.stringify(appointments, null, 2));

  return appointments;
};


// 🔍 Get appointments by ID
export const getAppointmentsByIdServices = async (
  appointmentsId: number
): Promise<TAppointmentsSelect | undefined> => {
  return await db.query.appointmentsTable.findFirst({
    where: eq(appointmentsTable.appointmentId, appointmentsId),
  });
};

// 👤 Get appointments by patientId
export const getAppointmentByPatientIdServices = async (
  patientId: number
): Promise<TAppointmentsSelect[] | null> => {
  return await db.query.appointmentsTable.findMany({
    where: eq(appointmentsTable.patientId, patientId),
  });
};

// 👨‍⚕️ Get appointments by doctorId
export const getAppointmentByDoctorIdServices = async (
  doctorId: number
): Promise<TAppointmentsSelect[] | null> => {
  return await db.query.appointmentsTable.findMany({
    where: eq(appointmentsTable.doctorId, doctorId),
  });
};

// ➕ Create a new appointment
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

// ✏️ Update an existing appointment
export const updateAppointmentsServices = async (
  appointmentsId: number,
  appointments: TAppointmentsInsert
): Promise<string> => {
  await db
    .update(appointmentsTable)
    .set(appointments)
    .where(eq(appointmentsTable.appointmentId, appointmentsId));
  return "appointments Updated Successfully 😎";
};

// ❌ Delete appointment
export const deleteAppointmentsServices = async (
  appointmentsId: number
): Promise<string> => {
  await db
    .delete(appointmentsTable)
    .where(eq(appointmentsTable.appointmentId, appointmentsId));
  return "appointments Deleted Successfully";
};
