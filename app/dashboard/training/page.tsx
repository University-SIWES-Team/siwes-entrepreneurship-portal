import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import StudentNavigation from "@/app/components/student/StudentNavigation";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

async function getTrainingData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) redirect("/login");

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload.userId) redirect("/login");

    const student = await prisma.student.findUnique({
      where: { userId: payload.userId as string },
      include: {
        applications: {
          include: {
            skill: true,
            trainingAssignment: {
              include: {
                trainer: {
                  include: { user: true }
                },
              },
            },
          },
        },
      },
    });

    if (!student) redirect("/login");
    return student;
  } catch {
    redirect("/login");
  }
}

export default async function TrainingPage() {
  const student = await getTrainingData();
  const application = student.applications?.[0];
  const assignment = application?.trainingAssignment;

  const studentName = student.fullName || "Student Account";
  const matricNumber = student.matricNumber || "Programme participant";
  const initials = studentName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "S";

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
              Stage 04
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0F2747] sm:text-4xl">
              Vocational Training
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5B6474] sm:text-base">
              View your assigned instructor and practical training module details.
            </p>
          </section>

          <div className="mt-8">
            {!application ? (
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
                <h2 className="text-xl font-bold text-[#0F2747]">Application Required</h2>
                <p className="mt-2 text-sm text-[#5B6474]">You must submit your programme application before you can be assigned a trainer.</p>
                <Link href="/dashboard/application" className="mt-6 inline-block rounded-lg bg-[#1D5FA7] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#154b85]">
                  Start Application
                </Link>
              </div>
            ) : !assignment ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-8 text-center shadow-sm">
                <h2 className="text-xl font-bold text-amber-900">Awaiting Trainer Assignment</h2>
                <p className="mt-2 text-sm text-amber-800">
                  Your application has been received. You will be assigned to a specialized trainer for the <strong>{application.skill.name}</strong> track shortly after your payments are verified.
                </p>
              </div>
            ) : (
              <section className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
                <div className="border-b border-[#E2E8F0] bg-[#F7F9FC] px-6 py-4 flex items-center justify-between">
                  <h2 className="font-semibold text-[#172033]">Training Assignment Details</h2>
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    assignment.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                    assignment.status === 'ACTIVE' ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {assignment.status}
                  </span>
                </div>
                
                <div className="p-6 grid gap-6 sm:grid-cols-2">
                  <div className="rounded-md bg-[#F7F9FC] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#7A8494]">Instructor Name</p>
                    <p className="mt-1 font-bold text-[#0F2747]">{assignment.trainer.fullName}</p>
                  </div>

                  <div className="rounded-md bg-[#F7F9FC] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#7A8494]">Instructor Email</p>
                    <p className="mt-1 font-medium text-[#172033]">{assignment.trainer.user.email}</p>
                  </div>

                  <div className="rounded-md bg-[#F7F9FC] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#7A8494]">Skill Track</p>
                    <p className="mt-1 font-bold text-[#1D5FA7]">{application.skill.name}</p>
                  </div>

                  <div className="rounded-md bg-[#F7F9FC] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#7A8494]">Trainer Specialty</p>
                    <p className="mt-1 font-medium text-[#172033]">{assignment.trainer.specialty}</p>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* SEQUENTIAL NAVIGATION BUTTON */}
          <div className="mt-12 flex items-center justify-between border-t border-[#E2E8F0] pt-6">
            <span className="text-sm text-[#7A8494] hidden sm:block">
              Proceed to submit your final practical project.
            </span>
            <Link
              href="/dashboard/project"
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg bg-[#0F2747] px-8 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#173a6a]"
            >
              Next: Project &rarr;
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}