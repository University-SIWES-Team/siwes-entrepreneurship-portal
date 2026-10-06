import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import { getStudentLiveExam } from "@/app/actions/student-exam";
import ExamGateway from "@/app/components/student/ExamGateway";
import { logout } from "@/app/actions/auth";

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

  // Fetch Live Exam Status if assigned
  let examData = null;
  if (assignment?.trainerId) {
    examData = await getStudentLiveExam(assignment.trainerId, user.id);
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#172033]">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-[#E2E8F0] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <div>
            <p className="text-sm font-semibold text-[#0F2747]">Entrepreneurship Portal</p>
            <p className="text-xs text-[#7A8494]">Examination Module</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-[#172033]">{student.fullName}</p>
              <p className="text-xs text-[#7A8494]">{student.matricNumber}</p>
            </div>
            <form action={logout}>
              <button type="submit" className="rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-xs font-semibold text-[#5B6474] transition hover:bg-[#F7F9FC]">
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-5 py-8 sm:px-8 lg:py-10">
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
      </main>
    </div>
  );
}