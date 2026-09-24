"use server";

import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export type ApplicationState = {
  error?: string;
  success?: boolean;
};

async function getStudentFromSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (!payload.userId) {
      return null;
    }

    const student = await prisma.student.findUnique({
      where: {
        userId: payload.userId as string,
      },
    });

    return student;
  } catch {
    return null;
  }
}

export async function getApplicationData() {
  const student = await getStudentFromSession();

  if (!student) {
    return { error: "Unauthorized." };
  }

  const skills = await prisma.skill.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const application = await prisma.application.findFirst({
    where: {
      studentId: student.id,
    },
    include: {
      skill: true,
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    student,
    skills,
    application,
  };
}

export async function submitApplication(
  _previousState: ApplicationState,
  formData: FormData,
): Promise<ApplicationState> {
  const student = await getStudentFromSession();

  if (!student) {
    return {
      error: "Unauthorized.",
    };
  }

  const existingApplication = await prisma.application.findFirst({
    where: {
      studentId: student.id,
    },
  });

  if (existingApplication) {
    return {
      error: "You already have a programme application.",
    };
  }

  const skillId = formData.get("skillId");

  if (typeof skillId !== "string" || !skillId) {
    return {
      error: "Please select a skill.",
    };
  }

  const skill = await prisma.skill.findUnique({
    where: {
      id: skillId,
    },
  });

  if (!skill) {
    return {
      error: "Selected skill was not found.",
    };
  }

  await prisma.application.create({
    data: {
      studentId: student.id,
      skillId: skill.id,
      status: "PENDING",
    },
  });

  redirect("/dashboard/application");
}