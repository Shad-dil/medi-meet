"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { success } from "zod";

export const setAvailabilitySlot = async (formData) => {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");
  try {
    const user = await db.User.findUnique({
      where: {
        clerkUserId: userId,
        role: "DOCTOR",
      },
    });

    if (!user) throw new Error("Doctor Not Found");
    //TODO:: Setting the Availablity Slot
    const startTime = formData.get("startTime");
    const endTime = formData.get("endTime");
    if (startTime >= endTime)
      throw new Error("Starttime cannot grater than end time");
    const existingSlots = await db.Availability.findUnique({
      where: {
        doctorId: userId,
      },
    });
    if (existingSlots.length > 0) {
      const slotsWithNoAppointment = existingSlots.filter(
        (slot) => !slot.appointment
      );
      if (slotsWithNoAppointment.length > 0) {
        await db.Availability.deleteMany({
          where: {
            id: {
              in: slotsWithNoAppointment.map((slot) => slot.id),
            },
          },
        });
      }
    }

    const availableSlot = await db.Availability.create({
      data: {
        doctorId: user.id,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status: "AVAILABLE",
      },
    });
    revalidatePath("/doctor");
    return { success: true, slot: availableSlot };
  } catch (error) {
    console.log(error);
    throw new Error("Something Went Wrong");
  }
};

export const getDoctorAvailablity = async () => {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const user = await db.User.findUnique({
      where: {
        clerkUserId: userId,
        role: "DOCTOR",
      },
    });

    if (!user) throw new Error("Doctor Not Found");

    const availibitySlot = await db.Availability.findMany({
      where: {
        doctorId: user.id,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return { slots: availibitySlot };
  } catch (error) {
    console.log(error);
    throw new Error("Error in getting Doctor Details");
  }
};
