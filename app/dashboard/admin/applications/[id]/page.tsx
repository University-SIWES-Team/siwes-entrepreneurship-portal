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

import AssignTrainerForm from "./AssignTrainerForm";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

async function getAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) redirect("/login");

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (!payload.userId) redirect("/login");

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

function ConfirmPaymentForm({ paymentId }: { paymentId: string }) {
  return (
    <form action={confirmPayment.bind(null, paymentId)}>
      <button
        type="submit"
        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
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
        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
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
        className="rounded-lg bg-[#1D5FA7] px-5 py-3 text-sm font-medium text-white hover:bg-[#0F2747]"
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
        className="rounded-lg border border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-700 hover:bg-red-100"
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

export default async function ApplicationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await getAdmin();

  const { id } = await params;

  const [application, trainers] = await Promise.all([
    prisma.application.findUnique({
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
        trainingAssignment: {
          include: {
            trainer: true,
          },
        },
      },
    }),

    prisma.trainer.findMany({
      orderBy: {
        fullName: "asc",
      },
    }),
  ]);

  if (!application) {
    notFound();
  }

  const canAssignTrainer = application.status === "APPROVED";

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
            Application Details
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-[#0F2747]">
            {application.student.fullName}
          </h1>

          <p className="mt-2 text-[#5B6474]">
            {application.student.matricNumber}
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <section className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <p className="text-sm text-[#7A8494]">
                  Selected Skill
                </p>

                <h2 className="mt-1 text-xl font-semibold text-[#172033]">
                  {application.skill.name}
                </h2>
              </div>

              <span
                className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${getApplicationStatusClass(
                  application.status,
                )}`}
              >
                {application.status}
              </span>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-3">
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

          <section className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#1D5FA7]">
              Payments
            </p>

            <h2 className="mt-2 text-xl font-semibold text-[#172033]">
              Payment Review
            </h2>

            <div className="mt-6 space-y-4">
              {application.payments.map((payment) => (
                <div
                  key={payment.id}
                  className="rounded-lg border border-[#E2E8F0] p-5"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <h3 className="font-semibold text-[#172033]">
                        {getPaymentName(payment.type)}
                      </h3>

                      <p className="mt-1 text-sm text-[#7A8494]">
                        ₦{Number(payment.amount).toLocaleString("en-NG")}
                      </p>

                      {payment.manualReference && (
                        <p className="mt-2 text-sm text-[#5B6474]">
                          Reference: {payment.manualReference}
                        </p>
                      )}
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${getPaymentStatusClass(
                        payment.status,
                      )}`}
                    >
                      {payment.status}
                    </span>
                  </div>

                  {payment.evidencePath && (
                    <div className="mt-4">
                      <ReceiptLink paymentId={payment.id} />
                    </div>
                  )}

                  {payment.status === "PENDING_REVIEW" && (
                    <div className="mt-5 flex flex-wrap gap-3">
                      <ConfirmPaymentForm paymentId={payment.id} />
                      <RejectPaymentForm paymentId={payment.id} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-[#E2E8F0] pt-5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#172033]">
                  Total Programme Fees
                </span>

                <span className="text-xl font-bold text-[#0F2747]">
                  ₦67,000
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#1D5FA7]">
              Application Decision
            </p>

            <h2 className="mt-2 text-xl font-semibold text-[#172033]">
              Review Application
            </h2>

            {application.status === "PENDING" && (
              <div className="mt-5 flex flex-wrap gap-3">
                <ApproveApplicationForm applicationId={application.id} />
                <RejectApplicationForm applicationId={application.id} />
              </div>
            )}

            {application.status === "APPROVED" && (
              <p className="mt-4 rounded-lg bg-green-50 p-4 text-sm text-green-700">
                This application has been approved.
              </p>
            )}

            {application.status === "REJECTED" && (
              <p className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                This application has been rejected.
              </p>
            )}
          </section>

          <section className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#1D5FA7]">
              Training
            </p>

            <h2 className="mt-2 text-xl font-semibold text-[#172033]">
              Trainer Assignment
            </h2>

            {!canAssignTrainer ? (
              <p className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-[#5B6474]">
                Approve the application before assigning a trainer.
              </p>
            ) : (
              <div className="mt-5">
                {application.trainingAssignment && (
                  <div className="mb-5 rounded-lg bg-[#F7F9FC] p-4">
                    <p className="text-sm text-[#7A8494]">
                      Current Trainer
                    </p>

                    <p className="mt-1 font-semibold text-[#172033]">
                      {application.trainingAssignment.trainer.fullName}
                    </p>

                    <p className="mt-1 text-sm text-[#5B6474]">
                      {application.trainingAssignment.trainer.specialty}
                    </p>

                    <p className="mt-2 text-sm text-[#1D5FA7]">
                      Training Status:{" "}
                      {application.trainingAssignment.status}
                    </p>
                  </div>
                )}

                <AssignTrainerForm
                  applicationId={application.id}
                  trainers={trainers}
                  currentTrainerId={
                    application.trainingAssignment?.trainerId
                  }
                />
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}