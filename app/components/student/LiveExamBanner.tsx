import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import Link from "next/link";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export default async function LiveExamBanner() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
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

    const assignment = user?.student?.applications[0]?.trainingAssignment;
    if (!assignment?.trainerId) return null;

    const liveExam = await prisma.exam.findUnique({
      where: { trainerId: assignment.trainerId },
    });

    if (!liveExam?.isLive) return null;

    const attempt = await prisma.examAttempt.findUnique({
      where: {
        examId_studentUserId: {
          examId: liveExam.id,
          studentUserId: user.id,
        }
      }
    });

    // Hide banner if they already finished or got terminated
    if (attempt?.status === "SUBMITTED" || attempt?.status === "TERMINATED") {
      return null;
    }

    return (
      <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 shadow-sm sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
          </span>
          <div>
            <h3 className="font-bold text-red-900">Final Examination is LIVE</h3>
            <p className="text-sm text-red-800">Your instructor has opened the examination portal. Please proceed to the exam module immediately.</p>
          </div>
        </div>
        <Link 
          href="/dashboard/examination" 
          className="whitespace-nowrap rounded-md bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
        >
          Go to Exam
        </Link>
      </div>
    );
  } catch {
    return null;
  }
}