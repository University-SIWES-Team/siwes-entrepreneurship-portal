"use server";

import { prisma } from "@/app/lib/prisma";
import { supabaseAdmin } from "@/app/lib/supabase-admin";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export type PaymentActionState = {
  error?: string;
  success?: boolean;
};

async function getStudentFromSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (!payload.userId) return null;

    return await prisma.student.findUnique({
      where: {
        userId: payload.userId as string,
      },
    });
  } catch {
    return null;
  }
}

export async function submitPaymentEvidence(
  _previousState: PaymentActionState,
  formData: FormData,
): Promise<PaymentActionState> {
  const student = await getStudentFromSession();

  if (!student) {
    return { error: "Unauthorized." };
  }

  const paymentId = formData.get("paymentId");
  const manualReference = formData.get("manualReference");
  const paymentDate = formData.get("paymentDate");
  const evidence = formData.get("evidence");

  if (typeof paymentId !== "string" || !paymentId) {
    return { error: "Invalid payment." };
  }

  if (typeof manualReference !== "string" || !manualReference.trim()) {
    return { error: "Please enter your payment reference." };
  }

  if (typeof paymentDate !== "string" || !paymentDate) {
    return { error: "Please enter the payment date." };
  }

  if (!(evidence instanceof File) || evidence.size === 0) {
    return { error: "Please upload your payment receipt." };
  }

  if (!ALLOWED_TYPES.includes(evidence.type)) {
    return {
      error: "Receipt must be a PDF, JPG, or PNG file.",
    };
  }

  if (evidence.size > MAX_FILE_SIZE) {
    return {
      error: "Receipt must not exceed 5MB.",
    };
  }

  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },
    include: {
      application: {
        include: {
          student: true,
        },
      },
    },
  });

  if (!payment) {
    return { error: "Payment not found." };
  }

  if (payment.application.studentId !== student.id) {
    return { error: "You are not authorized to update this payment." };
  }

  if (payment.status === "PAID") {
    return { error: "This payment has already been confirmed." };
  }

  if (payment.status === "PENDING_REVIEW") {
    return { error: "This payment is already awaiting review." };
  }

  const extension =
    evidence.type === "application/pdf"
      ? "pdf"
      : evidence.type === "image/png"
        ? "png"
        : "jpg";

  const filePath = `payment-evidence/${student.id}/${payment.id}-${Date.now()}.${extension}`;

  const fileBuffer = Buffer.from(await evidence.arrayBuffer());

  const { error: uploadError } = await supabaseAdmin.storage
    .from("student-uploads")
    .upload(filePath, fileBuffer, {
      contentType: evidence.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("Payment evidence upload failed:", uploadError);

    return {
      error: "Could not upload your receipt. Please try again.",
    };
  }

  await prisma.payment.update({
    where: {
      id: payment.id,
    },
    data: {
      status: "PENDING_REVIEW",
      manualReference: manualReference.trim(),
      paymentDate: new Date(paymentDate),
      evidencePath: filePath,
      evidenceName: evidence.name,
      evidenceMimeType: evidence.type,
      evidenceSize: evidence.size,
      submittedAt: new Date(),
    },
  });

  return {
    success: true,
  };
}