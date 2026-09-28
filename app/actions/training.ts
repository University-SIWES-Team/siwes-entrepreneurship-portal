"use server";

import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { revalidatePath } from "next/cache";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

async function getAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (!payload.userId) return null;

    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId as string,
      },
    });

    if (!user || user.role !== "ADMIN") {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

export async function assignTrainer(
  applicationId: string,
  trainerId: string,
) {
  const admin = await getAdmin();

  if (!admin) {
    return { error: "Unauthorized." };
  }

  const application = await prisma.application.findUnique({
    where: {
      id: applicationId,
    },
  });

  if (!application) {
    return { error: "Application not found." };
  }

  if (application.status !== "APPROVED") {
    return {
      error: "Only approved applications can be assigned to a trainer.",
    };
  }

  const trainer = await prisma.trainer.findUnique({
    where: {
      id: trainerId,
    },
  });

  if (!trainer) {
    return { error: "Trainer not found." };
  }

  await prisma.trainingAssignment.upsert({
    where: {
      applicationId,
    },
    update: {
      trainerId,
      status: "ASSIGNED",
    },
    create: {
      applicationId,
      trainerId,
      status: "ASSIGNED",
    },
  });

  revalidatePath("/dashboard/admin/applications");
  revalidatePath(`/dashboard/admin/applications/${applicationId}`);
  revalidatePath("/dashboard");

  return { success: true };
}