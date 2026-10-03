"use server";

import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { revalidatePath } from "next/cache";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function submitProject(formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) throw new Error("Unauthorized");

  const { payload } = await jwtVerify(token, JWT_SECRET);
  if (!payload.userId) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const submissionUrl = formData.get("submissionUrl") as string;

  if (!title || !description || !submissionUrl) {
    throw new Error("Title, Description, and Submission URL are required.");
  }

  const student = await prisma.student.findUnique({
    where: { userId: payload.userId as string },
    include: {
      applications: {
        include: { trainingAssignment: true },
      },
    },
  });

  const assignment = student?.applications?.[0]?.trainingAssignment;
  if (!assignment) {
    throw new Error("No active training assignment found.");
  }

  await prisma.project.upsert({
    where: { trainingAssignmentId: assignment.id },
    update: {
      title,
      description,
      submissionUrl,
      submittedAt: new Date(),
    },
    create: {
      trainingAssignmentId: assignment.id,
      title,
      description,
      submissionUrl,
      submittedAt: new Date(),
    },
  });

  revalidatePath("/dashboard/project");
}