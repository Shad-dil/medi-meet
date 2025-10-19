"use server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import select from "select";

export async function getPatientAppointments() {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const patient = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "PATIENT",
      },
      select: {
        id: true,
      },
    });

    if (!patient) {
      throw new Error("Patient not found");
    }
    const appointments = await db.appointment.findMany({
      where: {
        patientId: patient.id,
      },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            specialty: true,
            imageUrl: true,
          },
        },
      },
    });

    if (!appointments) {
      throw new Error("No appointments found");
    }

    return { appointments };
  } catch (error) {
    throw new Error("Failed to fetch patient appointments: " + error.message);
  }
}
