import { getApplicationData } from "@/app/actions/application";
import ApplicationForm from "../../components/ApplicationForm";

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
                    {application.payments.filter(
                      (payment) => payment.status === "PAID",
                    ).length}
                    /{application.payments.length} payments paid
                  </p>
                </div>
              </div>
            </section>

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
                  payments.
                </p>
              </div>

              <div className="mt-6 space-y-4">
                {application.payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex flex-col gap-4 rounded-lg border border-[#E2E8F0] p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <h3 className="font-semibold text-[#172033]">
                        {paymentLabels[payment.type]}
                      </h3>

                      <p className="mt-1 text-lg font-semibold text-[#0F2747]">
                        {formatAmount(paymentAmounts[payment.type])}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          payment.status === "PAID"
                            ? "bg-green-100 text-green-700"
                            : payment.status === "FAILED"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {payment.status}
                      </span>

                      {payment.status !== "PAID" && (
                        <button
                          type="button"
                          className="rounded-lg bg-[#1D5FA7] px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#174F8C]"
                        >
                          Pay Now
                        </button>
                      )}
                    </div>
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
          </div>
        ) : (
          <div className="mt-8 space-y-6">
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
                  <p className="text-sm text-[#7A8494]">Matric number</p>

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