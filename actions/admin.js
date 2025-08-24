"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const verifyAdmin = async () => {
  const { userId } = await auth();

  if (!userId) return false;

  try {
    const user = await db.User.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    return user?.role === "ADMIN";
  } catch (error) {
    console.error("Error verifying admin:", error);
    return false;
  }
};

export const getPendingDoctors = async () => {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) throw new Error("Unauthorized access");
  try {
    const pendingDoctors = await db.User.findMany({
      where: {
        verificationStatus: "PENDING",
        role: "DOCTOR",
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    // console.log(pendingDoctors);
    return { doctors: pendingDoctors };
  } catch (e) {
    throw new Error("Error fetching pending doctors");
  }
};

export const getVerifiedDoctors = async () => {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) throw new Error("Unauthorized access");
  try {
    const verifiedDoctors = await db.User.findMany({
      where: {
        verificationStatus: "VERIFIED",
        role: "DOCTOR",
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return { doctors: verifiedDoctors };
  } catch (e) {
    throw new Error("Error fetching Verified doctors");
  }
};

export const updateDoctorStatus = async (formData) => {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) throw new Error("Unauthorized access");
  const doctorId = formData.get("doctorId");
  const status = formData.get("status");
  console.log(doctorId, status);
  if (!doctorId || !["VERIFIED", "REJECTED"].includes(status)) {
    throw new Error("Invalid doctor ID or status");
  }
  try {
    await db.User.update({
      where: {
        clerkUserId: doctorId,
      },
      data: {
        verificationStatus: status,
      },
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error updating doctor status:", error);
    throw new Error("Error updating doctor status");
  }
};
export async function updateDoctorActiveStatus(formData) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) throw new Error("Unauthorized");

  const doctorId = formData.get("doctorId");
  const suspend = formData.get("suspend") === "true";

  if (!doctorId) {
    throw new Error("Doctor ID is required");
  }

  try {
    const status = suspend ? "PENDING" : "VERIFIED";

    await db.User.update({
      where: {
        id: doctorId,
      },
      data: {
        verificationStatus: status,
      },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to update doctor active status:", error);
    throw new Error(`Failed to update doctor status: ${error.message}`);
  }
}
