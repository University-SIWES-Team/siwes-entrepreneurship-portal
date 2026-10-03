import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

async function getAdmin() {
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

export default async function AdminStudentsPage() {
  await getAdmin();

  const students = await prisma.student.findMany({
    include: {
      user: true,
      // FIXED: Changed to plural 'applications' to match your Prisma schema
      applications: {
        include: {
          skill: true,
          trainingAssignment: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-[#F7F9FC] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="border-b border-[#E2E8F0] pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1D5FA7]">Administration</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0F2747] sm:text-4xl">
            Students Registry
          </h1>
          <p className="mt-3 text-sm text-[#5B6474] sm:text-base">
            Master directory of all registered students, academic levels, and programme progress.
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-sm">
          <div className="border-b border-[#E2E8F0] bg-[#F7F9FC] px-6 py-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#172033]">
              Total Enrolled ({students.length})
            </h2>
          </div>

          {students.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#7A8494]">
              No students registered in the system yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="border-b border-[#E2E8F0] bg-[#F7F9FC]">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-[#172033]">Student Name</th>
                    <th className="px-6 py-4 text-sm font-semibold text-[#172033]">Matric Number</th>
                    <th className="px-6 py-4 text-sm font-semibold text-[#172033]">Level</th>
                    <th className="px-6 py-4 text-sm font-semibold text-[#172033]">Skill Track</th>
                    <th className="px-6 py-4 text-sm font-semibold text-[#172033]">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-[#172033]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] text-sm">
                  {students.map((studentRaw) => {
                    const student = studentRaw as any;
                    // Grab the first application from the array
                    const app = student.applications && student.applications.length > 0 ? student.applications[0] : null;

                    return (
                      <tr key={student.id} className="hover:bg-[#F7F9FC] transition">
                        <td className="px-6 py-4 font-semibold text-[#172033]">
                          {student.fullName}
                          <span className="block text-xs font-normal text-[#7A8494]">{student.user?.email || "No email"}</span>
                        </td>
                        <td className="px-6 py-4 text-[#5B6474]">{student.matricNumber}</td>
                        <td className="px-6 py-4 text-[#5B6474]">{student.level}L</td>
                        <td className="px-6 py-4 text-[#5B6474]">
                          {app?.skill ? app.skill.name : <span className="text-xs text-[#7A8494] italic">Not selected</span>}
                        </td>
                        <td className="px-6 py-4">
                          {app ? (
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              app.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                              app.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {app.status}
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
                              INCOMPLETE
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {app ? (
                            <Link
                              href={`/dashboard/admin/applications/${app.id}`}
                              className="inline-flex items-center rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#1D5FA7] transition hover:bg-[#F0F5FA]"
                            >
                              View File
                            </Link>
                          ) : (
                            <span className="text-xs text-[#7A8494]">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}