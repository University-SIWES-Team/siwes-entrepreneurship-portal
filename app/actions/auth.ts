"use server";

import { prisma } from "@/app/lib/prisma";
import { hashPassword, verifyPassword, createSessionToken } from "@/app/lib/auth";
import { cookies } from "next/headers";

export async function registerStudent(formData: FormData) {
  // ...unchanged, your existing code
}

export async function loginStudent(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: "Invalid email or password." };
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return { error: "Invalid email or password." };
  }

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