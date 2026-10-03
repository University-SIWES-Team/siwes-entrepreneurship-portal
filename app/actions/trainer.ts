"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function reviewProject(formData: FormData) {
  const projectId = formData.get("projectId") as string;
  const feedback = formData.get("feedback") as string;
  
  if (!projectId) {
    throw new Error("Project ID is required");
  }

  await prisma.project.update({
    where: { id: projectId },
    data: { 
      reviewed: true,
      feedback: feedback ? feedback.trim() : null,
    },
  });

  revalidatePath("/dashboard/trainer");
}