import { getApplicationData } from "@/app/actions/application";
import ApplicationForm from "../../components/ApplicationForm";
import Link from "next/link";
import StudentNavigation from "@/app/components/student/StudentNavigation";

export default async function ApplicationPage() {
  const data = await getApplicationData();

  // FIX 1: Removed StudentNavigation from the error block and centered it.
  if ("error" in data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F9FC] p-6">
        <div className="w-full max-w-md rounded-lg border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-[#0F2747]">
            Application Error
          </h1>
          <p className="mt-3 text-sm text-[#5B6474]">{data.error}</p>
          <Link href="/dashboard" className="mt-6 inline-block rounded-lg bg-[#1D5FA7] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#154b85]">
            Return to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const { student, skills, application } = data;

  // Helper to extract initials for the avatar (e.g., "Ismael Kuda" -> "IK")
  const initials = student.fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#172033]">
      {/* FIX 2: Passed the exact props TypeScript is asking for */}
      <StudentNavigation 
        studentName={student.fullName}
        matricNumber={student.matricNumber}
        initials={initials}
      />
      
      <main className="lg:ml-64">
        <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          <section className="border-b border-[#E2E8F0] pb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1D5FA7]">
              Student Portal
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0F2747] sm:text-4xl">
              Programme Application
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5B6474] sm:text-base">
              Complete and manage your entrepreneurship programme application.
            </p>
          </section>

          {application ? (
            <div className="mt-8 space-y-6">
              <section className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#1D5FA7]">
                  Application submitted
                </p>

                <h2 className="mt-3 text-xl font-bold text-[#172033]">
                  {application.skill.name}
                </h2>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[#7A8494]">Application status</p>
                    <p className="mt-1 font-medium text-[#172033]">
                      {application.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[#7A8494]">Payment progress</p>
                    <p className="mt-1 font-medium text-[#172033]">
                      {application.payments.filter((p: any) => p.status === "PAID").length}
                      /{application.payments.length} payments verified
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-lg border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
                <div className="border-b border-[#E2E8F0] bg-[#F7F9FC] px-6 py-4">
                  <h2 className="font-semibold text-[#172033]">Your Information</h2>
                </div>
                <div className="p-6 grid gap-5 sm:grid-cols-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[#7A8494]">Full name</p>
                    <p className="mt-1 font-medium text-[#172033]">{student.fullName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[#7A8494]">Matric number</p>
                    <p className="mt-1 font-medium text-[#172033]">{student.matricNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[#7A8494]">Level</p>
                    <p className="mt-1 font-medium text-[#172033]">{student.level}</p>
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <div className="mt-8 space-y-6">
              <section className="rounded-lg border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
                <div className="border-b border-[#E2E8F0] bg-[#F7F9FC] px-6 py-4">
                  <h2 className="font-semibold text-[#172033]">Student Information</h2>
                </div>
                <div className="p-6 grid gap-5 sm:grid-cols-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[#7A8494]">Full name</p>
                    <p className="mt-1 font-medium text-[#172033]">{student.fullName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[#7A8494]">Matric number</p>
                    <p className="mt-1 font-medium text-[#172033]">{student.matricNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[#7A8494]">Level</p>
                    <p className="mt-1 font-medium text-[#172033]">{student.level}</p>
                  </div>
                </div>
              </section>

              <ApplicationForm skills={skills} />
            </div>
          )}

          {/* SEQUENTIAL NAVIGATION BUTTON */}
          <div className="mt-12 flex items-center justify-between border-t border-[#E2E8F0] pt-6">
            <span className="text-sm text-[#7A8494] hidden sm:block">
              Proceed to complete your programme payments.
            </span>
            <Link
              href="/dashboard/payments"
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg bg-[#0F2747] px-8 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#173a6a]"
            >
              Next: Payments &rarr;
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}