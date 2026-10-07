import { getApplicationData } from "@/app/actions/application";
import PaymentEvidenceForm from "./PaymentEvidenceForm";
import PaystackPaymentButton from "./PaystackPaymentButton";
import Link from "next/link";
import StudentNavigation from "@/app/components/student/StudentNavigation";

const paymentLabels = {
  SIWES_REGISTRATION: "SIWES Registration",
  VOCATIONAL_TRAINING: "Vocational Training",
  EXAMINATION: "Examination",
} as const;

const paymentAmounts = {
  SIWES_REGISTRATION: 30000,
  VOCATIONAL_TRAINING: 20000,
  EXAMINATION: 17000,
} as const;

function formatAmount(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}

function getPaymentStatusLabel(status: string) {
  switch (status) {
    case "PENDING":
      return "Pending";
    case "PENDING_REVIEW":
      return "Pending Review";
    case "PAID":
      return "Paid";
    case "FAILED":
      return "Payment Rejected";
    default:
      return status;
  }
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

export default async function PaymentsPage() {
  const data = await getApplicationData();

  if ("error" in data) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F7F9FC] p-6">
        <div className="w-full max-w-md rounded-lg border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-[#0F2747]">Programme Payments</h1>
          <p className="mt-3 text-sm text-[#5B6474]">{data.error}</p>
          <Link href="/dashboard" className="mt-6 inline-block rounded-lg bg-[#1D5FA7] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#154b85]">
            Return to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const { application, student } = data;

  const studentName = student?.fullName || "Student Account";
  const matricNumber = student?.matricNumber || "Programme participant";
  const initials = studentName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "S";

  // If application doesn't exist, we still render the navigation so the user isn't trapped
  if (!application) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] text-[#172033] flex flex-col lg:flex-row">
        <StudentNavigation studentName={studentName} matricNumber={matricNumber} initials={initials} />
        <main className="flex-1 lg:ml-64 w-full flex items-center justify-center p-6">
          <div className="w-full max-w-md rounded-lg border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
            <h1 className="text-xl font-semibold text-[#0F2747]">Programme Payments</h1>
            <p className="mt-3 text-sm text-[#5B6474]">You must submit your programme application before you can make payments.</p>
            <Link href="/dashboard/application" className="mt-6 inline-block rounded-lg bg-[#1D5FA7] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#154b85]">
              Start Application
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#172033] flex flex-col lg:flex-row">
      
      {/* Universal Dark Sidebar & Mobile Nav Component */}
      <StudentNavigation 
        studentName={studentName}
        matricNumber={matricNumber}
        initials={initials}
      />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 w-full">
        <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          <section className="border-b border-[#E2E8F0] pb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1D5FA7]">
              Student Portal
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0F2747] sm:text-4xl">
              Programme Payments
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5B6474] sm:text-base">
              Manage and track your Entrepreneurship Programme fees.
            </p>
          </section>

          <div className="mt-8 space-y-6">
            <section className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-[#172033]">
                  Payment Requirements
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#5B6474]">
                  Your programme fees are divided into three separate payments. You can pay securely online via Paystack or upload manual payment evidence.
                </p>
              </div>

              <div className="mt-6 space-y-5">
                {application.payments.map((payment: any) => {
                  const paymentName = paymentLabels[payment.type as keyof typeof paymentLabels];

                  return (
                    <div key={payment.id} className="rounded-lg border border-[#E2E8F0] p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="font-semibold text-[#172033]">{paymentName}</h3>
                          <p className="mt-1 text-lg font-bold text-[#0F2747]">
                            {formatAmount(paymentAmounts[payment.type as keyof typeof paymentAmounts])}
                          </p>
                        </div>
                        <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${getPaymentStatusClass(payment.status)}`}>
                          {getPaymentStatusLabel(payment.status)}
                        </span>
                      </div>

                      {payment.status === "PENDING_REVIEW" && (
                        <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4">
                          <p className="font-medium text-amber-800">Payment evidence submitted</p>
                          <p className="mt-1 text-sm leading-6 text-amber-700">
                            Your payment receipt has been submitted and is waiting for administrator verification.
                          </p>
                          {payment.manualReference && (
                            <p className="mt-2 text-sm text-amber-700">
                              Reference: <span className="font-medium">{payment.manualReference}</span>
                            </p>
                          )}
                        </div>
                      )}

                      {payment.status === "PAID" && (
                        <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4">
                          <p className="font-medium text-green-800">Payment confirmed</p>
                          <p className="mt-1 text-sm leading-6 text-green-700">
                            Your payment has been successfully verified.
                          </p>
                          {(payment.manualReference || payment.providerRef) && (
                            <p className="mt-2 text-sm text-green-700">
                              Reference: <span className="font-medium">{payment.manualReference || payment.providerRef}</span>
                            </p>
                          )}
                        </div>
                      )}

                      {payment.status === "FAILED" && (
                        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4">
                          <p className="font-medium text-red-800">Payment evidence rejected</p>
                          <p className="mt-1 text-sm leading-6 text-red-700">
                            Your previous payment evidence was rejected. Please submit the correct payment evidence again.
                          </p>
                        </div>
                      )}

                      {(payment.status === "PENDING" || payment.status === "FAILED") && (
                        <>
                          <PaystackPaymentButton
                            paymentId={payment.id}
                            amount={formatAmount(paymentAmounts[payment.type as keyof typeof paymentAmounts])}
                          />

                          <div className="my-4 flex items-center gap-3">
                            <div className="h-px flex-1 bg-[#E2E8F0]" />
                            <span className="text-xs font-medium uppercase tracking-[0.12em] text-[#7A8494]">
                              Or pay manually
                            </span>
                            <div className="h-px flex-1 bg-[#E2E8F0]" />
                          </div>

                          <PaymentEvidenceForm
                            paymentId={payment.id}
                            paymentName={paymentName}
                          />
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[#E2E8F0] pt-5">
                <span className="font-semibold text-[#172033]">Total Programme Fees</span>
                <span className="text-xl font-bold text-[#0F2747]">₦67,000</span>
              </div>
            </section>
          </div>

          {/* SEQUENTIAL NAVIGATION BUTTON */}
          <div className="mt-12 flex items-center justify-between border-t border-[#E2E8F0] pt-6">
            <span className="text-sm text-[#7A8494] hidden sm:block">
              Proceed to view your assigned training module.
            </span>
            <Link
              href="/dashboard/training"
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg bg-[#0F2747] px-8 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#173a6a]"
            >
              Next: Training &rarr;
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}