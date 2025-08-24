"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const getDoctorBySpeciality = async (specialty) => {
  const { userId } = await auth();
  if (!userId) return false;

  try {
    const doctors = await db.User.findMany({
      where: {
        specialty: specialty,
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
      },
      orderBy: {
        name: "asc",
      },
    });

    return { doctors };
  } catch (error) {
    console.log(error.message);
    throw new Error("Error in fetching the Doctors");
  }
};
