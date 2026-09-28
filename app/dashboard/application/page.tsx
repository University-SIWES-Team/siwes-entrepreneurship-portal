import { getApplicationData } from "@/app/actions/application";
import ApplicationForm from "../../components/ApplicationForm";
import PaymentEvidenceForm from "./PaymentEvidenceForm";

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

export default async function ApplicationPage() {
  const data = await getApplicationData();

  if ("error" in data) {
    return (
      <main className="min-h-screen bg-[#F7F9FC] p-6">
        <div className="mx-auto max-w-3xl rounded-lg border border-[#E2E8F0] bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-[#0F2747]">
            Programme Application
          </h1>

          <p className="mt-3 text-[#5B6474]">{data.error}</p>
        </div>
      </main>
    );
  }

  const { student, skills, application } = data;

  return (
    <main className="min-h-screen bg-[#F7F9FC] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1D5FA7]">
            Student Portal
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#0F2747] sm:text-4xl">
            Programme Application
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-[#5B6474]">
            Complete your programme application and manage your programme
            payments.
          </p>
        </div>

        {application ? (
          <div className="mt-8 space-y-6">
            {/* Application summary */}
            <section className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#1D5FA7]">
                Application submitted
              </p>

              <h2 className="mt-3 text-xl font-semibold text-[#172033]">
                {application.skill.name}
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-[#7A8494]">
                    Application status
                  </p>

                  <p className="mt-1 font-medium text-[#172033]">
                    {application.status}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-[#7A8494]">
                    Payment progress
                  </p>

                  <p className="mt-1 font-medium text-[#172033]">
                    {
                      application.payments.filter(
                        (payment) => payment.status === "PAID",
                      ).length
                    }
                    /{application.payments.length} payments paid
                  </p>
                </div>
              </div>
            </section>

            {/* Payment section */}
            <section className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-sm">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#1D5FA7]">
                  Programme Fees
                </p>

                <h2 className="mt-2 text-xl font-semibold text-[#172033]">
                  Payment Requirements
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#5B6474]">
                  Your programme fees are divided into three separate
                  payments. Upload your payment evidence for each payment
                  after making the payment.
                </p>
              </div>

              <div className="mt-6 space-y-5">
                {application.payments.map((payment) => {
                  const paymentName =
                    paymentLabels[payment.type];

                  return (
                    <div
                      key={payment.id}
                      className="rounded-lg border border-[#E2E8F0] p-5"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="font-semibold text-[#172033]">
                            {paymentName}
                          </h3>

                          <p className="mt-1 text-lg font-semibold text-[#0F2747]">
                            {formatAmount(paymentAmounts[payment.type])}
                          </p>
                        </div>

                        <span
                          className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${getPaymentStatusClass(
                            payment.status,
                          )}`}
                        >
                          {getPaymentStatusLabel(payment.status)}
                        </span>
                      </div>

                      {/* Payment awaiting review */}
                      {payment.status === "PENDING_REVIEW" && (
                        <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4">
                          <p className="font-medium text-amber-800">
                            Payment evidence submitted
                          </p>

                          <p className="mt-1 text-sm leading-6 text-amber-700">
                            Your payment receipt has been submitted and is
                            waiting for administrator verification.
                          </p>

                          {payment.manualReference && (
                            <p className="mt-2 text-sm text-amber-700">
                              Reference:{" "}
                              <span className="font-medium">
                                {payment.manualReference}
                              </span>
                            </p>
                          )}
                        </div>
                      )}

                      {/* Confirmed payment */}
                      {payment.status === "PAID" && (
                        <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4">
                          <p className="font-medium text-green-800">
                            Payment confirmed
                          </p>

                          <p className="mt-1 text-sm leading-6 text-green-700">
                            Your payment has been verified by the programme
                            administrator.
                          </p>

                          {payment.manualReference && (
                            <p className="mt-2 text-sm text-green-700">
                              Reference:{" "}
                              <span className="font-medium">
                                {payment.manualReference}
                              </span>
                            </p>
                          )}
                        </div>
                      )}

                      {/* Rejected payment */}
                      {payment.status === "FAILED" && (
                        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4">
                          <p className="font-medium text-red-800">
                            Payment evidence rejected
                          </p>

                          <p className="mt-1 text-sm leading-6 text-red-700">
                            Your previous payment evidence was rejected.
                            Please submit the correct payment evidence again.
                          </p>
                        </div>
                      )}

                      {/* New payment / resubmission */}
                      {(payment.status === "PENDING" ||
                        payment.status === "FAILED") && (
                        <PaymentEvidenceForm
                          paymentId={payment.id}
                          paymentName={paymentName}
                        />
                      )}
                    </div>
                  );
                })}
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

            {/* Student information */}
            <section className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#1D5FA7]">
                Student
              </p>

              <h2 className="mt-2 text-xl font-semibold text-[#172033]">
                Your Information
              </h2>

              <div className="mt-5 grid gap-5 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-[#7A8494]">Full name</p>

                  <p className="mt-1 font-medium text-[#172033]">
                    {student.fullName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-[#7A8494]">
                    Matric number
                  </p>

                  <p className="mt-1 font-medium text-[#172033]">
                    {student.matricNumber}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-[#7A8494]">Level</p>

                  <p className="mt-1 font-medium text-[#172033]">
                    {student.level}
                  </p>
                </div>
              </div>
            </section>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {/* Student information before application */}
            <section className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#172033]">
                Student information
              </h2>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-[#7A8494]">Full name</p>

                  <p className="mt-1 font-medium text-[#172033]">
                    {student.fullName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-[#7A8494]">
                    Matric number
                  </p>

                  <p className="mt-1 font-medium text-[#172033]">
                    {student.matricNumber}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-[#7A8494]">Level</p>

                  <p className="mt-1 font-medium text-[#172033]">
                    {student.level}
                  </p>
                </div>
              </div>
            </section>

            <ApplicationForm skills={skills} />
          </div>
        )}
      </div>
    </main>
  );
}