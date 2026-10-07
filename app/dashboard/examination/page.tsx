import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import { getStudentLiveExam } from "@/app/actions/student-exam";
import ExamGateway from "@/app/components/student/ExamGateway";
import { logout } from "@/app/actions/auth";
import Link from "next/link";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

async function getStudentAssignment() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) redirect("/login");

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload.userId) redirect("/login");

    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      include: {
        student: {
          include: {
            applications: {
              include: { trainingAssignment: true },
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        },
      },
    });

    if (!user || user.role !== "STUDENT" || !user.student) {
      redirect("/dashboard");
    }

    return { user, student: user.student };
  } catch {
    redirect("/login");
  }
}

export default async function ExaminationPage() {
  const { user, student } = await getStudentAssignment();
  const latestApp = student.applications[0];
  const assignment = latestApp?.trainingAssignment;

  let examData = null;
  if (assignment?.trainerId) {
    examData = await getStudentLiveExam(assignment.trainerId, user.id);
  }

  const initials = student.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#172033] flex flex-col lg:flex-row">
      
      {/* Desktop Sidebar (Dark Theme) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-[#0F2747] text-white lg:flex">
        <div className="border-b border-white/10 px-6 py-6 text-center lg:text-left">
          <Link href="/" className="text-lg font-black tracking-tight text-white uppercase">
            OUI PORTAL
          </Link>
          <p className="mt-1 text-xs font-bold tracking-widest text-[#4A90E2] uppercase">
            Student Dashboard
          </p>
        </div>
        <nav className="flex-1 px-4 py-6">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-4">
            Learning Menu
          </p>
          <div className="space-y-1.5">
            <Link
              href="/dashboard/examination"
              className="flex items-center rounded-lg bg-[#1D5FA7] px-4 py-3 text-sm font-semibold text-white shadow-md transition-all"
            >
              CBT Examination
            </Link>
          </div>
        </nav>
        <div className="border-t border-white/10 p-4">
          <div className="mb-4 flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1D5FA7] text-sm font-bold text-white shadow-sm">
              {initials}
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-sm font-bold text-white">{student.fullName}</p>
              <p className="truncate text-xs text-white/60">{student.matricNumber}</p>
            </div>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center justify-center rounded-lg bg-white/5 px-4 py-2.5 text-sm font-bold text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
            >
              Sign out of Portal
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile Header & Pill Nav (Dark Theme) */}
      <div className="sticky top-0 z-20 w-full bg-[#0F2747] text-white shadow-md lg:hidden">
        <div className="flex h-16 items-center justify-between px-5 sm:px-8">
          <div>
            <p className="text-sm font-black tracking-tight text-white uppercase">
              OUI PORTAL
            </p>
            <p className="text-[10px] font-bold tracking-widest text-[#4A90E2] uppercase">
              Student Dashboard
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1D5FA7] text-xs font-bold text-white">
              {initials}
            </div>
          </div>
        </div>
        <nav className="flex gap-2 overflow-x-auto border-t border-white/10 px-4 py-3 hide-scrollbar">
          <Link
            href="/dashboard/examination"
            className="shrink-0 rounded-full bg-[#1D5FA7] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all"
          >
            CBT Examination
          </Link>
        </nav>
      </div>

      {/* Main Examination Content */}
      <main className="flex-1 lg:ml-64 w-full">
        <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 lg:py-10">
          <div className="border-b border-[#E2E8F0] pb-6 mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-[#0F2747]">
              Final Examination
            </h1>
            <p className="mt-2 text-sm text-[#5B6474]">
              Computer-Based Testing (CBT) Module
            </p>
          </div>

          {!assignment ? (
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
              <p className="text-[#7A8494]">You have not been assigned to a trainer yet.</p>
            </div>
          ) : examData?.exam && !examData.error ? (
            
            <ExamGateway 
              exam={examData.exam} 
              studentUserId={user.id} 
              assignmentId={assignment.id} 
            />

          ) : examData?.error === "You have already completed this examination." ? (
            <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center shadow-sm">
              <h2 className="text-2xl font-bold text-green-900 mb-2">Examination Completed</h2>
              <p className="text-green-800">You have successfully submitted your final examination. Your NUC grade is processing.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#7A8494] mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <h3 className="text-xl font-bold text-[#0F2747] mb-2">No Active Examination</h3>
              <p className="text-[#7A8494] max-w-md mx-auto">
                Your instructor has not opened the final examination yet. Please wait for instructions and refresh this page when told to begin.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}