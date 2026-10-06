import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/auth";

// Components
import StudentAttendanceInput from "@/app/components/student/StudentAttendanceInput";
import StudentPulseCheck from "@/app/components/student/StudentPulseCheck";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

async function getStudentData() {
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
              include: {
                skill: true,
                trainingAssignment: {
                  include: { 
                    trainer: {
                      include: {
                        classSessions: {
                          where: { isActive: true },
                          take: 1
                        }
                      }
                    }, 
                    project: true 
                  }
                }
              },
              orderBy: { createdAt: "desc" },
              take: 1,
            }
          }
        }
      }
    });

    if (!user || user.role !== "STUDENT" || !user.student) {
      redirect("/dashboard");
    }

    return { user, student: user.student };
  } catch {
    redirect("/login");
  }
}

export default async function StudentDashboardPage() {
  const { user, student } = await getStudentData();
  const latestApp = student.applications[0];
  const assignment = latestApp?.trainingAssignment;
  const activeSession = assignment?.trainer?.classSessions[0];

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#172033]">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-[#E2E8F0] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <div>
            <p className="text-sm font-semibold text-[#0F2747]">Entrepreneurship Portal</p>
            <p className="text-xs text-[#7A8494]">Student Dashboard</p>
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
        <div className="space-y-8">
          <div className="border-b border-[#E2E8F0] pb-6">
            <h1 className="text-3xl font-bold tracking-tight text-[#0F2747] sm:text-4xl">
              Welcome, {student.fullName.split(' ')[0]}
            </h1>
            <p className="mt-2 text-sm text-[#5B6474]">
              Manage your SIWES entrepreneurship training, attendance, and projects.
            </p>
          </div>

          {!assignment ? (
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
              <p className="text-[#7A8494]">You have not been assigned to a trainer yet. Please check back later.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
                <h3 className="font-bold text-[#0F2747] mb-4">Training Assignment</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-[#7A8494] text-xs font-semibold uppercase">Skill Track</p>
                    <p className="font-medium text-[#172033]">{latestApp.skill.name}</p>
                  </div>
                  <div>
                    <p className="text-[#7A8494] text-xs font-semibold uppercase">Instructor</p>
                    <p className="font-medium text-[#172033]">{assignment.trainer.fullName}</p>
                  </div>
                  <div>
                    <p className="text-[#7A8494] text-xs font-semibold uppercase">Status</p>
                    <span className="inline-flex mt-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      {assignment.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {activeSession ? (
                  <>
                    <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
                      <StudentAttendanceInput sessionId={activeSession.id} studentUserId={user.id} />
                    </div>
                    <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
                      <h3 className="text-base font-bold text-[#0F2747] mb-4 text-center">Virtual Pulse Check</h3>
                      <StudentPulseCheck sessionId={activeSession.id} studentUserId={user.id} />
                    </div>
                  </>
                ) : (
                  <div className="rounded-xl border border-[#E2E8F0] bg-white p-8 text-center shadow-sm h-full flex flex-col justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-[#7A8494] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-[#7A8494]">No active class session right now.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}