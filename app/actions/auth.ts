"use server";

import { prisma } from "@/app/lib/prisma";
import { hashPassword, createSessionToken } from "@/app/lib/auth";
import { cookies } from "next/headers";

export async function registerStudent(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const matricNumber = formData.get("matricNumber") as string;
  const level = Number(formData.get("level"));

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: "An account with this email already exists." };
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: "STUDENT",
      student: {
        create: { fullName, matricNumber, level },
      },
    },
  });

  const token = createSessionToken(user.id, user.role);

  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return { success: true };
}