import { getApplicationData } from "@/app/actions/application";
import ApplicationForm from "../../components/ApplicationForm";

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
            Complete your programme application by confirming your student
            information and selecting a training skill.
          </p>
        </div>

        {application ? (
          <div className="mt-8 rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-sm">
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
                  Payment status
                </p>

                <p className="mt-1 font-medium text-[#172033]">
                  {application.payment?.status ?? "Pending"}
                </p>
              </div>
            </div>
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