import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyPaystackTransaction } from "@/app/lib/paystack";

const PAYMENT_AMOUNTS = {
  SIWES_REGISTRATION: 30000,
  VOCATIONAL_TRAINING: 20000,
  EXAMINATION: 17000,
} as const;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.redirect(
      new URL(
        "/dashboard/payments?payment=missing-reference",
        request.url,
      ),
    );
  }

  const payment = await prisma.payment.findUnique({
    where: {
      providerRef: reference,
    },
  });

  if (!payment) {
    return NextResponse.redirect(
      new URL(
        "/dashboard/payments?payment=not-found",
        request.url,
      ),
    );
  }

  if (payment.status === "PAID") {
    return NextResponse.redirect(
      new URL(
        "/dashboard/payments?payment=already-paid",
        request.url,
      ),
    );
  }

  try {
    const transaction = await verifyPaystackTransaction(reference);

    const expectedAmount = PAYMENT_AMOUNTS[payment.type] * 100;

    const isValidPayment =
      transaction.status === "success" &&
      transaction.reference === reference &&
      transaction.currency === "NGN" &&
      transaction.amount === expectedAmount;

    if (!isValidPayment) {
      return NextResponse.redirect(
        new URL(
          "/dashboard/payments?payment=verification-failed",
          request.url,
        ),
      );
    }

    await prisma.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: "PAID",
        method: "ONLINE",
        paymentDate: transaction.paid_at
          ? new Date(transaction.paid_at)
          : new Date(),
      },
    });

    return NextResponse.redirect(
      new URL(
        "/dashboard/payments?payment=success",
        request.url,
      ),
    );
  } catch (error) {
    console.error("Paystack verification failed:", error);

    return NextResponse.redirect(
      new URL(
        "/dashboard/payments?payment=verification-error",
        request.url,
      ),
    );
  }
}