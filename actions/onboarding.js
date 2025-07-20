"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const setUserRole = async (formData) => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");
  //find user in Database

  const user = await db.User.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!user) throw new Error("User not found");

  const role = formData.get("role");
  if (!role || !["PATIENT", "DOCTOR"].includes(role)) {
    throw new Error("Invalid role selected");
  }
  try {
    if (role === "PATIENT") {
      await db.User.update({
        where: {
          clerkUserId: userId,
        },
        data: {
          role: "PATIENT",
        },
      });
      revalidatePath("/");
      return { success: true, redirect: "/doctors" };
    }

    if (role === "DOCTOR") {
      const speciality = formData.get("speciality");
      const experience = parseInt(formData.get("experience"), 10);
      const credientUrl = formData.get("credientUrl");
      const description = formData.get("description");
      if (!speciality || !experience || !credientUrl || !description) {
        throw new Error("All fields are required for Doctor role");
      }
      await db.User.update({
        where: {
          clerkUserId: userId,
        },
        data: {
          role: "DOCTOR",
          speciality,
          experience,
          credientUrl,
          description,
          verificationStatus: "PENDING",
        },
      });
      revalidatePath("/");
      return { success: true, redirect: "/doctor/verifiaction" };
    }
  } catch (e) {
    console.log(e.message);
    throw new Error("Failed to set user role", e.message);
  }
};

export const getCurrentUser = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  try {
    const user = await db.User.findUnique({
      where: {
        clerkUserId: userId,
      },
    });
    return user || null;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user");
  }
};
