import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";

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

export default async function TrainerStudentsPage() {
  const trainerId = await getTrainerId();

  const assignments = await prisma.trainingAssignment.findMany({
    where: { trainerId },
    orderBy: { createdAt: "desc" },
    include: {
      application: {
        include: {
          student: true,
          skill: true,
        },
      },
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <div className="border-b border-[#E2E8F0] pb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#0F2747] sm:text-4xl">
          My Students
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5B6474] sm:text-base">
          A complete list of all students assigned to your training program.
        </p>
      </div>

      <div className="mt-8 rounded-lg border border-[#E2E8F0] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-200 text-left">
            <thead className="border-b border-[#E2E8F0] bg-[#F7F9FC]">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-[#172033]">Student Details</th>
                <th className="px-6 py-4 text-sm font-semibold text-[#172033]">Level</th>
                <th className="px-6 py-4 text-sm font-semibold text-[#172033]">Skill</th>
                <th className="px-6 py-4 text-sm font-semibold text-[#172033]">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-[#172033]">Assigned On</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment.id} className="border-b border-[#E2E8F0] transition hover:bg-[#F7F9FC]/50 last:border-b-0">
                  <td className="px-6 py-4">
                    <p className="font-medium text-[#172033]">{assignment.application.student.fullName}</p>
                    <p className="mt-1 text-sm text-[#7A8494]">{assignment.application.student.matricNumber}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#5B6474]">
                    {assignment.application.student.level}L
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
                  <td className="px-6 py-4 text-sm text-[#5B6474]">
                    {new Date(assignment.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {assignments.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-base font-medium text-[#172033]">No students found</p>
              <p className="mt-1 text-sm text-[#7A8494]">You haven't been assigned any students yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}