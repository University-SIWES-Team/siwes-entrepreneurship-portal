import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect, notFound } from "next/navigation";

import {
  approveApplication,
  rejectApplication,
  confirmPayment,
  rejectPayment,
  getPaymentReceiptUrl,
} from "@/app/actions/admin";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

async function getAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (!payload.userId) {
      redirect("/login");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId as string,
      },
    });

    if (!user || user.role !== "ADMIN") {
      redirect("/dashboard");
    }

    return user;
  } catch {
    redirect("/login");
  }
}

function ConfirmPaymentForm({ paymentId }: { paymentId: string }) {
  return (
    <form action={confirmPayment.bind(null, paymentId)}>
      <button
        type="submit"
        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
      >
        Confirm Payment
      </button>
    </form>
  );
}

function RejectPaymentForm({ paymentId }: { paymentId: string }) {
  return (
    <form action={rejectPayment.bind(null, paymentId)}>
      <button
        type="submit"
        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
      >
        Reject Payment
      </button>
    </form>
  );
}

function ApproveApplicationForm({
  applicationId,
}: {
  applicationId: string;
}) {
  return (
    <form action={approveApplication.bind(null, applicationId)}>
      <button
        type="submit"
        className="rounded-lg bg-[#1D5FA7] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#0F2747]"
      >
        Approve Application
      </button>
    </form>
  );
}

function RejectApplicationForm({
  applicationId,
}: {
  applicationId: string;
}) {
  return (
    <form action={rejectApplication.bind(null, applicationId)}>
      <button
        type="submit"
        className="rounded-lg border border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-700 transition hover:bg-red-100"
      >
        Reject Application
      </button>
    </form>
  );
}

async function ReceiptLink({ paymentId }: { paymentId: string }) {
  const result = await getPaymentReceiptUrl(paymentId);

  if (!result.url) {
    return (
      <span className="text-sm text-[#7A8494]">
        Receipt unavailable
      </span>
    );
  }

  return (
    <a
      href={result.url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm font-medium text-[#1D5FA7] hover:underline"
    >
      View Receipt
    </a>
  );
}

function getPaymentName(type: string) {
  const names: Record<string, string> = {
    SIWES_REGISTRATION: "SIWES Registration",
    VOCATIONAL_TRAINING: "Vocational Training",
    EXAMINATION: "Examination",
  };

  return names[type] ?? "Programme Payment";
}

function getPaymentStatusClass(status: string) {
  switch (status) {
    case "PAID":
      return "bg-green-100 text-green-700";
    case "PENDING_REVIEW":
      return "bg-amber-100 text-amber-700";
    case "FAILED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function getApplicationStatusClass(status: string) {
  switch (status) {
    case "APPROVED":
      return "bg-green-100 text-green-700";
    case "REJECTED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-amber-100 text-amber-700";
  }
}

export default async function ApplicationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await getAdmin();

  const { id } = await params;

  const application = await prisma.application.findUnique({
    where: {
      id,
    },
    include: {
      student: true,
      skill: true,
      payments: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!application) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F7F9FC] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <a
          href="/dashboard/admin/applications"
          className="text-sm font-semibold text-[#1D5FA7] hover:underline"
        >
          ← Back to Applications
        </a>

        <div className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1D5FA7]">
            Admin Portal
          </p>

          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-[#0F2747]">
                Application Details
              </h1>

              <p className="mt-2 text-[#5B6474]">
                Review the student application, payments and approval status.
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${getApplicationStatusClass(
                application.status,
              )}`}
            >
              {application.status}
            </span>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {/* Student Information */}
          <section className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#1D5FA7]">
              Student
            </p>

            <h2 className="mt-2 text-xl font-semibold text-[#172033]">
              Student Information
            </h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-3">
              <div>
                <p className="text-sm text-[#7A8494]">Full Name</p>
                <p className="mt-1 font-medium text-[#172033]">
                  {application.student.fullName}
                </p>
              </div>

              <div>
                <p className="text-sm text-[#7A8494]">Matric Number</p>
                <p className="mt-1 font-medium text-[#172033]">
                  {application.student.matricNumber}
                </p>
              </div>

              <div>
                <p className="text-sm text-[#7A8494]">Level</p>
                <p className="mt-1 font-medium text-[#172033]">
                  {application.student.level}
                </p>
              </div>
            </div>
          </section>

          {/* Programme Information */}
          <section className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#1D5FA7]">
              Programme
            </p>

            <h2 className="mt-2 text-xl font-semibold text-[#172033]">
              Application Information
            </h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-sm text-[#7A8494]">Selected Skill</p>
                <p className="mt-1 font-medium text-[#172033]">
                  {application.skill.name}
                </p>
              </div>

              <div>
                <p className="text-sm text-[#7A8494]">Application Status</p>
                <p className="mt-1 font-medium text-[#172033]">
                  {application.status}
                </p>
              </div>

              <div>
                <p className="text-sm text-[#7A8494]">Submitted</p>
                <p className="mt-1 font-medium text-[#172033]">
                  {new Date(application.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </section>

          {/* Payments */}
          <section className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#1D5FA7]">
                Payments
              </p>

              <h2 className="mt-2 text-xl font-semibold text-[#172033]">
                Programme Payments
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#5B6474]">
                Review payment evidence submitted by the student.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {application.payments.map((payment) => (
                <div
                  key={payment.id}
                  className="rounded-lg border border-[#E2E8F0] p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <h3 className="font-semibold text-[#172033]">
                        {getPaymentName(payment.type)}
                      </h3>

                      <p className="mt-1 text-lg font-semibold text-[#0F2747]">
                        ₦{Number(payment.amount).toLocaleString("en-NG")}
                      </p>

                      <p className="mt-2 text-sm text-[#5B6474]">
                        Status: {payment.status.replaceAll("_", " ")}
                      </p>

                      {payment.manualReference && (
                        <p className="mt-1 text-sm text-[#5B6474]">
                          Reference: {payment.manualReference}
                        </p>
                      )}

                      {payment.paymentDate && (
                        <p className="mt-1 text-sm text-[#5B6474]">
                          Payment Date:{" "}
                          {new Date(
                            payment.paymentDate,
                          ).toLocaleDateString()}
                        </p>
                      )}

                      {payment.submittedAt && (
                        <p className="mt-1 text-sm text-[#5B6474]">
                          Evidence Submitted:{" "}
                          {new Date(
                            payment.submittedAt,
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${getPaymentStatusClass(
                        payment.status,
                      )}`}
                    >
                      {payment.status.replaceAll("_", " ")}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {payment.evidencePath && (
                      <ReceiptLink paymentId={payment.id} />
                    )}

                    {payment.status === "PENDING_REVIEW" && (
                      <>
                        <ConfirmPaymentForm paymentId={payment.id} />
                        <RejectPaymentForm paymentId={payment.id} />
                      </>
                    )}
                  </div>

                  {payment.status === "PENDING_REVIEW" && (
                    <div className="mt-4 rounded-lg bg-amber-50 p-4 text-sm text-amber-700">
                      This payment is awaiting administrator review.
                    </div>
                  )}

                  {payment.status === "PAID" && (
                    <div className="mt-4 rounded-lg bg-green-50 p-4 text-sm text-green-700">
                      This payment has been confirmed.
                    </div>
                  )}

                  {payment.status === "FAILED" && (
                    <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                      This payment evidence was rejected.
                    </div>
                  )}

                  {payment.status === "PENDING" && (
                    <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
                      The student has not submitted payment evidence yet.
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-[#E2E8F0] pt-5">
              <span className="font-semibold text-[#172033]">
                Total Programme Fees
              </span>

              <span className="text-xl font-bold text-[#0F2747]">
                ₦67,000
              </span>
            </div>
          </section>

          {/* Application Decision */}
          <section className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#1D5FA7]">
              Decision
            </p>

            <h2 className="mt-2 text-xl font-semibold text-[#172033]">
              Application Review
            </h2>

            {application.status === "PENDING" ? (
              <>
                <p className="mt-2 text-sm leading-6 text-[#5B6474]">
                  Review the student information and payment records before
                  making a decision.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <ApproveApplicationForm
                    applicationId={application.id}
                  />

                  <RejectApplicationForm
                    applicationId={application.id}
                  />
                </div>
              </>
            ) : (
              <p className="mt-3 text-sm text-[#5B6474]">
                This application has already been marked as{" "}
                <span className="font-semibold">
                  {application.status}
                </span>
                .
              </p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}