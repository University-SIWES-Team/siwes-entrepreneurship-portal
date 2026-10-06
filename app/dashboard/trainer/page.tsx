import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import TrainerSessionManager from "@/app/components/trainer/TrainerSessionManager";
import { getTrainerExam } from "@/app/actions/exam";
import TrainerExamManager from "@/app/components/trainer/TrainerExamManager";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

async function getTrainerData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) redirect("/login");

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload.userId) redirect("/login");

    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      include: {
        trainer: {
          include: {
            assignments: {
              include: { project: true },
            },
          },
        },
      },
    });

    if (!user || user.role !== "TRAINER" || !user.trainer) redirect("/dashboard");
    return user.trainer;
  } catch {
    redirect("/login");
  }
}

export default async function TrainerOverviewPage() {
  const trainer = await getTrainerData();
  const baseExam = await getTrainerExam(trainer.id);

  const examMonitor = await prisma.exam.findUnique({
    where: { id: baseExam.id },
    include: {
      questions: true,
      attempts: {
        include: {
          studentUser: { include: { student: true } },
        },
        orderBy: { startedAt: "desc" },
      },
    },
  });

  const pendingReviews = trainer.assignments.filter((a) => a.project && !a.project.reviewed).length;
  const completedReviews = trainer.assignments.filter((a) => a.project?.reviewed).length;

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
      <div className="border-b border-[#E2E8F0] pb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1D5FA7]">Overview</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0F2747] sm:text-4xl">
          Trainer Dashboard
        </h1>
        <p className="mt-3 text-sm text-[#5B6474] sm:text-base">
          Manage live classes, monitor examinations, and track overall student progress.
        </p>
      </div>

      <section className="mt-8 grid gap-5 sm:grid-cols-3">
        <div className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-[#7A8494]">Total Assigned Students</p>
          <p className="mt-2 text-3xl font-bold text-[#0F2747]">{trainer.assignments.length}</p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 shadow-sm">
          <p className="text-sm font-medium text-amber-800">Pending Project Reviews</p>
          <p className="mt-2 text-3xl font-bold text-amber-900">{pendingReviews}</p>
        </div>
        <div className="rounded-lg border border-green-200 bg-green-50 p-6 shadow-sm">
          <p className="text-sm font-medium text-green-800">Completed Reviews</p>
          <p className="mt-2 text-3xl font-bold text-green-900">{completedReviews}</p>
        </div>
      </section>

      <section className="mt-8">
        <TrainerSessionManager trainerId={trainer.id} />
      </section>

      <section className="mt-8">
        <TrainerExamManager exam={baseExam} />
        
        {examMonitor?.isLive && (
          <div className="mt-8 rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-[#7A8494]">Live Examination Monitor</h4>
              <p className="text-xs text-[#1D5FA7] font-medium flex items-center gap-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1D5FA7] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1D5FA7]"></span>
                </span>
                Monitoring Active Session
              </p>
            </div>
            
            <div className="overflow-x-auto rounded-lg border border-[#E2E8F0]">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#F7F9FC] text-[#5B6474]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Student Name</th>
                    <th className="px-4 py-3 font-medium">Matric No</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] bg-white">
                  {!examMonitor.attempts || examMonitor.attempts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-[#7A8494]">
                        No students have started the examination yet.
                      </td>
                    </tr>
                  ) : (
                    examMonitor.attempts.map((attempt) => (
                      <tr key={attempt.id} className="hover:bg-[#F7F9FC]/50 transition">
                        <td className="px-4 py-3 text-[#172033] font-medium">
                          {attempt.studentUser?.student?.fullName || "Unknown"}
                        </td>
                        <td className="px-4 py-3 text-[#7A8494]">
                          {attempt.studentUser?.student?.matricNumber || "N/A"}
                        </td>
                        <td className="px-4 py-3">
                          {attempt.status === 'IN_PROGRESS' && <span className="inline-flex text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-semibold">In Progress</span>}
                          {attempt.status === 'SUBMITTED' && <span className="inline-flex text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full text-xs font-semibold">Submitted</span>}
                          {attempt.status === 'TERMINATED' && <span className="inline-flex text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full text-xs font-semibold">Terminated</span>}
                        </td>
                        <td className="px-4 py-3 font-bold text-[#0F2747]">
                          {attempt.status !== 'IN_PROGRESS' ? `${attempt.score} / ${examMonitor.questions.length}` : '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}