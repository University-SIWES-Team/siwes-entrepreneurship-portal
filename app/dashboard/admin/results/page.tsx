import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import Link from "next/link";

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

export default async function AdminResultsPage() {
  await verifyAdmin();

  const assignments = await prisma.trainingAssignment.findMany({
    include: {
      application: {
        include: {
          student: true,
          skill: true,
        },
      },
      trainer: true,
      project: true,
      result: true,
      attendances: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="border-b border-slate-200 pb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">Administration</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Results & Examination Oversight
        </h1>
        <p className="mt-3 text-sm text-slate-600 sm:text-base">
          Monitor student performance, audit NUC classifications, and manage final grades across all OUI skill tracks.
        </p>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Student Name / Matric</th>
                <th className="px-6 py-4 font-semibold">Skill Track</th>
                <th className="px-6 py-4 font-semibold">Trainer</th>
                <th className="px-6 py-4 font-semibold">Attendance (10%)</th>
                <th className="px-6 py-4 font-semibold">Project (60%)</th>
                <th className="px-6 py-4 font-semibold">CBT Exam (30%)</th>
                <th className="px-6 py-4 font-semibold">Total & Grade</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assignments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                    No student assignments or results found.
                  </td>
                </tr>
              ) : (
                assignments.map((assignment) => {
                  const student = assignment.application.student;
                  const result = assignment.result;
                  const projectScore = assignment.project?.score ?? 0;
                  
                  return (
                    <tr key={assignment.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900">{student?.fullName || "Unknown"}</p>
                        <p className="text-xs text-slate-500">{student?.matricNumber || "N/A"}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {assignment.application.skill.name}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {assignment.trainer?.fullName || "Unassigned"}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-blue-600 font-medium">
                        {assignment.attendances.length} Sessions
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-700">
                        {assignment.project?.reviewed ? `${Number(projectScore).toFixed(1)} / 60` : <span className="text-amber-600 font-semibold bg-amber-50 px-2 py-1 rounded-md">Pending</span>}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-700">
                        {/* FIXED: Added .toFixed(1) to the exam score here */}
                        {result ? `${Number(result.examScore).toFixed(1)} / 30` : "-"}
                      </td>
                      <td className="px-6 py-4">
                        {result ? (
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{Number(result.totalScore).toFixed(1)}%</span>
                            <span className="inline-flex rounded-full bg-blue-50 border border-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                              {result.classification}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Not Computed</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/dashboard/admin/results/${assignment.id}`}>
                          <button className="font-semibold text-blue-700 text-xs bg-blue-50 hover:bg-blue-600 hover:text-white transition-all px-4 py-2 rounded-lg border border-blue-100 shadow-sm cursor-pointer">
                            Audit View
                          </button>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}