"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function resubmitApplication(applicationId: string) {
  try {
    await prisma.application.update({
      where: { id: applicationId },
      data: { status: "PENDING" },
    });
    
    // Refresh both the student view and the admin queues
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/admin/applications");
    
    return { success: true };
  } catch (error) {
    return { error: "Failed to resubmit application." };
  }
}