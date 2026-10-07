import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) redirect("/login");

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload.userId) redirect("/login");

    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
    });

    if (!user || user.role !== "ADMIN") redirect("/dashboard");
    return user;
  } catch {
    redirect("/login");
  }
}

export default async function AuditResultPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  await verifyAdmin();
  
  const resolvedParams = await Promise.resolve(params);
  // We strictly pull the string ID here to use safely inside the server action
  const assignmentId = resolvedParams.id;

  const assignment = await prisma.trainingAssignment.findUnique({
    where: { id: assignmentId },
    include: {
      application: { include: { student: true, skill: true } },
      trainer: true,
      project: true,
      result: true,
      attendances: true,
    },
  });

  if (!assignment) redirect("/dashboard/admin/results");

  const student = assignment.application.student;
  const attendanceCount = assignment.attendances.length;
  const projectScore = assignment.project?.score ?? 0;
  const currentExam = assignment.result?.examScore ?? 0;
  const currentTotal = assignment.result?.totalScore ?? 0;
  const currentClass = assignment.result?.classification ?? "Pending";

  // Server Action
  async function overrideGrade(formData: FormData) {
    "use server";
    const newProjectScore = Number(formData.get("projectScore"));
    const newExamScore = Number(formData.get("examScore"));
    const newTotalScore = Number(formData.get("totalScore"));
    const newClassification = String(formData.get("classification"));

    // FIX: Re-fetch the strict record inside the server action to avoid Next.js closure serialization bugs
    const currentStatus = await prisma.trainingAssignment.findUnique({
      where: { id: assignmentId },
      include: { project: true, result: true }
    });

    if (!currentStatus) return;

    // 1. Update or Create Project
    if (currentStatus.project) {
      await prisma.project.update({
        where: { id: currentStatus.project.id },
        data: { score: newProjectScore, reviewed: true },
      });
    } else {
      await prisma.trainingAssignment.update({
        where: { id: assignmentId },
        data: {
          project: {
            create: {
              score: newProjectScore,
              reviewed: true,
              repoUrl: "Admin Override",
              liveUrl: "Admin Override",
              status: "PASSED"
            }
          }
        }
      });
    }

    // 2. Update or Create Final Result
    if (currentStatus.result) {
      await prisma.result.update({
        where: { id: currentStatus.result.id },
        data: {
          examScore: newExamScore,
          totalScore: newTotalScore,
          classification: newClassification,
        },
      });
    } else {
      await prisma.trainingAssignment.update({
        where: { id: assignmentId },
        data: {
          result: {
            create: {
              examScore: newExamScore,
              totalScore: newTotalScore,
              classification: newClassification,
            }
          }
        }
      });
    }

    revalidatePath("/dashboard/admin/results");
    redirect("/dashboard/admin/results");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mb-6">
        <Link 
          href="/dashboard/admin/results" 
          className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-2 w-fit"
        >
          <span>&larr;</span> Back to Results
        </Link>
      </div>

      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Audit Student Record
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Review and manually override scores for <span className="font-semibold text-slate-900">{student?.fullName}</span>.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Attendance (10%)</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{attendanceCount}</p>
          <p className="mt-1 text-sm text-slate-500">Sessions Logged</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Project Score (60%)</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{Number(projectScore).toFixed(1)}</p>
          <p className="mt-1 text-sm text-slate-500">Out of 60</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">CBT Exam (30%)</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{Number(currentExam).toFixed(1)}</p>
          <p className="mt-1 text-sm text-slate-500">Out of 30</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Total & Grade</p>
          <p className="mt-2 text-3xl font-bold text-blue-900">{Number(currentTotal).toFixed(1)}%</p>
          <p className="mt-1 text-sm font-medium text-blue-700">{currentClass}</p>
        </div>
      </div>

      <div className="mt-10 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Administrator Override</h2>
            <p className="text-sm text-slate-500">Only adjust these values if there is an authorized grading correction.</p>
          </div>
        </div>
        
        <form action={overrideGrade} className="p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-slate-700">Attendance Score</label>
              <input
                type="text"
                disabled
                defaultValue={`${attendanceCount} Sessions Logged`}
                className="mt-2 block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-500 sm:text-sm cursor-not-allowed"
              />
              <p className="mt-1.5 text-[11px] text-slate-400">Based on physical registry check-ins.</p>
            </div>

            <div>
              <label htmlFor="projectScore" className="block text-sm font-medium text-slate-700">Project Score (Max 60)</label>
              <input
                type="number"
                name="projectScore"
                id="projectScore"
                step="0.1"
                defaultValue={Number(projectScore).toFixed(1)}
                required
                className="mt-2 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="examScore" className="block text-sm font-medium text-slate-700">CBT Exam Score (Max 30)</label>
              <input
                type="number"
                name="examScore"
                id="examScore"
                step="0.1"
                defaultValue={Number(currentExam).toFixed(1)}
                required
                className="mt-2 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="totalScore" className="block text-sm font-medium text-slate-700">Total Score (Max 100)</label>
              <input
                type="number"
                name="totalScore"
                id="totalScore"
                step="0.1"
                defaultValue={Number(currentTotal).toFixed(1)}
                required
                className="mt-2 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            
            <div className="lg:col-span-2">
              <label htmlFor="classification" className="block text-sm font-medium text-slate-700">Final NUC Classification</label>
              <select
                name="classification"
                id="classification"
                defaultValue={currentClass}
                className="mt-2 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white"
              >
                <option value="First Class">First Class</option>
                <option value="Second Class Upper">Second Class Upper</option>
                <option value="Second Class Lower">Second Class Lower</option>
                <option value="Third Class">Third Class</option>
                <option value="Pass">Pass</option>
                <option value="Fail">Fail</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-4 border-t border-slate-100 pt-6">
            <Link 
              href="/dashboard/admin/results"
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-4 py-2"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="rounded-lg bg-[#0F2747] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#1a3a66] transition-colors cursor-pointer"
            >
              Confirm Grade Override
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}