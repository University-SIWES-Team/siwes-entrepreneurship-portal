"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function reviewProject(formData: FormData) {
  const projectId = formData.get("projectId") as string;
  const feedback = formData.get("feedback") as string;
  const score = Number(formData.get("score")); // Capture the score

  try {
    await prisma.project.update({
      where: { id: projectId },
      data: {
        reviewed: true,
        feedback,
        score, // Save it to the database
      },
    });

    revalidatePath("/dashboard/trainer");
  } catch (error) {
    console.error(error);
  }
}