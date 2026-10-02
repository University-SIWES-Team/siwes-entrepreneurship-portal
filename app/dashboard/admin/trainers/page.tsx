import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import TrainingStatusForm from "./TrainingStatusForm";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

async function getAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) redirect("/login");

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (!payload.userId) redirect("/login");

    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId as string,
      },
    });

    if (!user || user.role !== "ADMIN") {
      redirect("/dashboard");
    }

    return user;
  } catch {
    redirect("/login");
  }
}

function getStatusClass(status: string) {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-700";
    case "ACTIVE":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-amber-100 text-amber-700";
  }
}

export default async function AdminTrainersPage() {
  await getAdmin();

  const trainers = await prisma.trainer.findMany({
    include: {
      user: true,
      assignments: {
        include: {
          application: {
            include: {
              student: true,
              skill: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      fullName: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-[#F7F9FC] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <a
          href="/dashboard/admin"
          className="text-sm font-semibold text-[#1D5FA7] hover:underline"
        >
          ← Back to Admin Dashboard
        </a>

        <div className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1D5FA7]">
            Administration
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-[#0F2747]">
            Trainers
          </h1>

          <p className="mt-2 text-[#5B6474]">
            View trainers, assigned students and training progress.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {trainers.length === 0 ? (
            <section className="rounded-lg border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
              <h2 className="font-semibold text-[#172033]">
                No trainers available
              </h2>

              <p className="mt-2 text-sm text-[#7A8494]">
                Add a trainer before assigning students.
              </p>
            </section>
          ) : (
            trainers.map((trainer) => (
              <section
                key={trainer.id}
                className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  <div>
                    <h2 className="text-xl font-semibold text-[#172033]">
                      {trainer.fullName}
                    </h2>

                    <p className="mt-1 text-sm text-[#5B6474]">
                      {trainer.specialty}
                    </p>

                    <p className="mt-1 text-sm text-[#7A8494]">
                      {trainer.user.email}
                    </p>
                  </div>

                  <div className="text-sm text-[#5B6474]">
                    {trainer.assignments.length} assigned student
                    {trainer.assignments.length === 1 ? "" : "s"}
                  </div>
                </div>

                {trainer.assignments.length > 0 && (
                  <div className="mt-6 space-y-4 border-t border-[#E2E8F0] pt-6">
                    {trainer.assignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="rounded-lg border border-[#E2E8F0] p-4"
                      >
                        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                          <div>
                            <h3 className="font-semibold text-[#172033]">
                              {assignment.application.student.fullName}
                            </h3>

                            <p className="mt-1 text-sm text-[#7A8494]">
                              {assignment.application.student.matricNumber}
                            </p>

                            <p className="mt-1 text-sm text-[#1D5FA7]">
                              {assignment.application.skill.name}
                            </p>
                          </div>

                          <span
                            className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                              assignment.status,
                            )}`}
                          >
                            {assignment.status}
                          </span>
                        </div>

                        <TrainingStatusForm
                          assignmentId={assignment.id}
                          currentStatus={assignment.status as "ASSIGNED" | "ACTIVE" | "COMPLETED"}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))
          )}
        </div>
      </div>
    </main>
  );
}