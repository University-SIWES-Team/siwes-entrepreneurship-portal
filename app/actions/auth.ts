"use server";

import { prisma } from "@/app/lib/prisma";
import { hashPassword, verifyPassword, createSessionToken } from "@/app/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

  const existingStudent = await prisma.student.findUnique({
  where: { matricNumber },
});

if (existingStudent) {
  return { error: "A student with this matric number already exists." };
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

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/login");
}