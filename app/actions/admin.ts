"use server";

import { prisma } from "@/app/lib/prisma";
import { supabaseAdmin } from "@/app/lib/supabase-admin";
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

export async function confirmPayment(
  paymentId: string,
  _formData?: FormData,
): Promise<void> {
  const admin = await getAdmin();

  if (!admin) {
    return;
  }

  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },
  });

  if (!payment || payment.status === "PAID") {
    return;
  }

  await prisma.payment.update({
    where: {
      id: paymentId,
    },
    data: {
      status: "PAID",
      reviewedAt: new Date(),
    },
  });

  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/applications");
  revalidatePath(`/dashboard/admin/applications/${payment.applicationId}`);
  revalidatePath("/dashboard/application");
  revalidatePath("/dashboard/payments");
}

export async function rejectPayment(
  paymentId: string,
  _formData?: FormData,
): Promise<void> {
  const admin = await getAdmin();

  if (!admin) {
    return;
  }

  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },
  });

  if (!payment || payment.status === "PAID") {
    return;
  }

  await prisma.payment.update({
    where: {
      id: paymentId,
    },
    data: {
      status: "FAILED",
      reviewedAt: new Date(),
    },
  });

  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/applications");
  revalidatePath(`/dashboard/admin/applications/${payment.applicationId}`);
  revalidatePath("/dashboard/application");
  revalidatePath("/dashboard/payments");
}

export async function getPaymentReceiptUrl(paymentId: string) {
  const admin = await getAdmin();

  if (!admin) {
    return { error: "Unauthorized." };
  }

  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },
  });

  if (!payment || !payment.evidencePath) {
    return { error: "Receipt not found." };
  }

  const { data, error } = await supabaseAdmin.storage
    .from("student-uploads")
    .createSignedUrl(payment.evidencePath, 300);

  if (error || !data?.signedUrl) {
    return { error: "Could not generate receipt URL." };
  }

  return {
    success: true,
    url: data.signedUrl,
  };
}

export async function approveApplication(
  applicationId: string,
  _formData?: FormData,
): Promise<void> {
  const admin = await getAdmin();

  if (!admin) {
    return;
  }

  const application = await prisma.application.findUnique({
    where: {
      id: applicationId,
    },
  });

  if (!application) {
    return;
  }

  await prisma.application.update({
    where: {
      id: applicationId,
    },
    data: {
      status: "APPROVED",
    },
  });

  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/applications");
  revalidatePath(`/dashboard/admin/applications/${applicationId}`);
  revalidatePath("/dashboard/application");
  revalidatePath("/dashboard/payments");
}

export async function rejectApplication(
  applicationId: string,
  _formData?: FormData,
): Promise<void> {
  const admin = await getAdmin();

  if (!admin) {
    return;
  }

  const application = await prisma.application.findUnique({
    where: {
      id: applicationId,
    },
  });

  if (!application) {
    return;
  }

  await prisma.application.update({
    where: {
      id: applicationId,
    },
    data: {
      status: "REJECTED",
    },
  });

  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/applications");
  revalidatePath(`/dashboard/admin/applications/${applicationId}`);
  revalidatePath("/dashboard/application");
  revalidatePath("/dashboard/payments");
}