"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs"; // Make sure you have this installed: npm install bcryptjs

export async function registerTrainer(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const specialty = formData.get("specialty") as string;

  if (!fullName || !email || !password || !specialty) {
    throw new Error("All fields are required");
  }

  // 1. Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("A user with this email already exists");
  }

  // 2. Hash the password securely
  const passwordHash = await bcrypt.hash(password, 10);

  // 3. Create the User and the Trainer profile in one transaction
  await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: "TRAINER",
      trainer: {
        create: {
          fullName,
          specialty,
        },
      },
    },
  });

  // 4. Refresh the trainers page and redirect back
  revalidatePath("/dashboard/admin/trainers");
  redirect("/dashboard/admin/trainers");
}