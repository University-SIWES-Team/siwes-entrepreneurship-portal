import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import TrainerSessionManager from "@/app/components/trainer/TrainerSessionManager";
import Link from "next/link";

export const dynamic = "force-dynamic";

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
            exam: true, // Include the master exam to check live status & banner details
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
  const exam = trainer.exam;

  const activeSession = await prisma.classSession.findFirst({
    where: {
      trainerId: trainer.id,
      isActive: true
    },
    select: {
      id: true,
      type: true
    }
  });

  const pendingReviews = trainer.assignments.filter((a) => a.project && !a.project.reviewed).length;
  const completedReviews = trainer.assignments.filter((a) => a.project?.reviewed).length;

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10 space-y-8">
      {/* --- ACTIVE EXAM ALERT BANNER --- */}
      {exam?.isLive && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            </span>
            <div>
              <h4 className="text-sm font-bold text-red-900">Examination is Currently Live!</h4>
              <p className="text-xs text-red-700 mt-0.5">
                Students are actively taking <span className="font-semibold">{exam.title}</span>. The window failsafe is active.
              </p>
            </div>
          </div>
          <Link 
            href="/dashboard/trainer/exams" 
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition shadow-sm shrink-0"
          >
            Open Live Monitor
          </Link>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E2E8F0] pb-8 gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1D5FA7]">Overview</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0F2747] sm:text-4xl">
            Trainer Dashboard
          </h1>
          <p className="mt-3 text-sm text-[#5B6474] sm:text-base">
            Manage live classes, monitor attendance, and track overall student progress.
          </p>
        </div>
        
        <a 
          href="/api/export/results" 
          download="siwes_registry_export.csv"
          className="inline-flex items-center justify-center rounded-lg bg-[#0F2747] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#173a6a]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mr-2 h-4 w-4">
            <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clipRule="evenodd" />
          </svg>
          Export Registry CSV
        </a>
      </div>

      <section className="grid gap-5 sm:grid-cols-3">
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

      <section>
        <TrainerSessionManager trainerId={trainer.id} initialSession={activeSession} />
      </section>
    </div>
  );
}