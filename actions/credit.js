"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { revalidatePath } from "next/cache";
import { success } from "zod";

const PLAN_CREDITS = {
  free_user: 0,
  standard: 10,
  premium: 24,
};

const APPOINTMENT_CREDIT_COST = 2;
export async function checkAndAllocateCredits(user) {
  try {
    if (!user) return null;
    if (user?.role !== "PATIENT") return null;

    const { has } = await auth();
    const hasBasic = has({ plan: "free_user" });
    const hasStandard = has({ plan: "standard" });
    const hasPremium = has({ plan: "premium" });
    let currentPlan = null;
    let creditsToAllocate = 0;
    if (hasPremium) {
      currentPlan = "premium";
      creditsToAllocate = PLAN_CREDITS.premium;
    } else if (hasStandard) {
      currentPlan = "standard";
      creditsToAllocate = PLAN_CREDITS.standard;
    } else if (hasBasic) {
      currentPlan = "free_user";
      creditsToAllocate = PLAN_CREDITS.free_user;
    }
    if (!currentPlan) return user;

    const currentMonth = format(new Date(), "yyyy-MM");
    if (user.transactions.length > 0) {
      const latestTransaction = user.transactions[0];
      const transactionMonth = format(
        new Date(latestTransaction.createdAt),
        "yyyy-MM"
      );
      const transactionPlan = latestTransaction.packageId;
      if (
        transactionMonth === currentMonth &&
        transactionPlan === currentPlan
      ) {
        return user;
      }
    }

    const updatedUser = db.$transaction(async (tx) => {
      await tx.CreditTransaction.create({
        data: {
          userId: user.id,
          amount: creditsToAllocate,
          type: "CREDIT_PURCHASE",
          packageId: currentPlan,
        },
      });
      //? updating user Balance
      const updatedUser = await tx.User.update({
        where: {
          id: user.id,
        },
        data: {
          credits: {
            increment: creditsToAllocate,
          },
        },
      });
      return updatedUser;
    });

    revalidatePath("/doctors");
    revalidatePath("/doctors");

    return updatedUser;
  } catch (e) {
    console.log(e.message);
    return null;
  }
}

export async function deductCreditForAppointment(userId, doctorId) {
  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });
    const doctor = await db.user.findUnique({
      where: {
        id: doctorId,
      },
    });

    if (user.credits < APPOINTMENT_CREDIT_COST) {
      throw new Error("insufficient Credits for Booking");
    }
    if (!doctor) {
      throw new Error("doctor not found");
    }
    const result = await db.$transaction(async (tx) => {
      await tx.CreditTransaction.create({
        data: {
          userId: user.id,
          amount: -APPOINTMENT_CREDIT_COST,
          type: "  APPOINTMENT_DEDUCTION ",
          description: `Credits deducted for appointment with Dr ${doctor.name}`,
        },
      });

      const updatedUser = await tx.user.update({
        where: {
          id: user.id,
        },
        data: {
          credits: {
            decrement: APPOINTMENT_CREDIT_COST,
          },
        },
      });

      await tx.user.update({
        where: {
          id: doctor.id,
        },
        data: {
          credits: {
            increment: APPOINTMENT_CREDIT_COST,
          },
        },
      });

      return { updatedUser };
    });

    return { success: true, user: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
