import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import Link from "next/link";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

async function getTrainerId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) redirect("/login");

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      include: { trainer: true },
    });
    if (!user || !user.trainer) redirect("/login");
    return user.trainer.id;
  } catch {
    redirect("/login");
  }
}

export default async function TrainerDashboardPage() {
  const trainerId = await getTrainerId();

  const [totalAssigned, activeTraining, recentAssignments] = await Promise.all([
    prisma.trainingAssignment.count({
      where: { trainerId },
    }),
    prisma.trainingAssignment.count({
      where: { trainerId, status: "ACTIVE" },
    }),
    prisma.trainingAssignment.findMany({
      where: { trainerId },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        application: {
          include: {
            student: true,
            skill: true,
          },
        },
      },
    }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <div className="border-b border-[#E2E8F0] pb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1D5FA7]">
          Instructor Portal
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#0F2747] sm:text-4xl">
          Trainer Overview
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5B6474] sm:text-base">
          Track your assigned students, manage ongoing vocational training, and review projects.
        </p>
      </div>

      <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-sm transition hover:shadow-md">
          <p className="text-sm font-medium text-[#7A8494]">Total Assigned Students</p>
          <p className="mt-2 text-3xl font-bold text-[#0F2747]">{totalAssigned}</p>
        </div>

        <div className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-sm transition hover:shadow-md">
          <p className="text-sm font-medium text-[#7A8494]">Active Training</p>
          <p className="mt-2 text-3xl font-bold text-[#1D5FA7]">{activeTraining}</p>
        </div>
      </section>

      <section className="mt-8 rounded-lg border border-[#E2E8F0] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] p-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#1D5FA7]">
              Students
            </p>
            <h2 className="mt-2 text-xl font-bold text-[#172033]">
              Recently Assigned
            </h2>
          </div>
          <Link 
            href="/dashboard/trainer/students"
            className="hidden text-sm font-semibold text-[#1D5FA7] hover:text-[#0F2747] sm:block"
          >
            View All &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-150 text-left">
            <thead className="border-b border-[#E2E8F0] bg-[#F7F9FC]">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-[#172033]">Student</th>
                <th className="px-6 py-4 text-sm font-semibold text-[#172033]">Skill</th>
                <th className="px-6 py-4 text-sm font-semibold text-[#172033]">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAssignments.map((assignment) => (
                <tr key={assignment.id} className="border-b border-[#E2E8F0] transition hover:bg-[#F7F9FC]/50 last:border-b-0">
                  <td className="px-6 py-4">
                    <p className="font-medium text-[#172033]">{assignment.application.student.fullName}</p>
                    <p className="mt-1 text-sm text-[#7A8494]">{assignment.application.student.matricNumber}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#5B6474]">
                    {assignment.application.skill.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      assignment.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                      assignment.status === 'ACTIVE' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {assignment.status.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {recentAssignments.length === 0 && (
            <div className="p-8 text-center text-sm text-[#7A8494]">
              No students assigned yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}