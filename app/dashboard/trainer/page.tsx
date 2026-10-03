import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/auth";
import LoadingButton from "@/app/components/LoadingButton";
import { reviewProject } from "@/app/actions/trainer";

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
              include: {
                application: {
                  include: { student: true, skill: true },
                },
                project: true,
              },
              orderBy: { createdAt: "desc" },
            },
          },
        },
      },
    });

    // Kick out anyone who isn't a Trainer
    if (!user || user.role !== "TRAINER" || !user.trainer) {
      redirect("/dashboard");
    }

    return user.trainer;
  } catch {
    redirect("/login");
  }
}

export default async function TrainerDashboardPage() {
  const trainer = await getTrainerData();
  const assignments = trainer.assignments;

  const pendingReviews = assignments.filter((a) => a.project && !a.project.reviewed).length;
  const completedReviews = assignments.filter((a) => a.project?.reviewed).length;

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#172033]">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-[#E2E8F0] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <div>
            <p className="text-sm font-semibold text-[#0F2747]">Entrepreneurship Portal</p>
            <p className="text-xs text-[#7A8494]">Trainer Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-[#172033]">{trainer.fullName}</p>
              <p className="text-xs text-[#7A8494]">{trainer.specialty} Instructor</p>
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
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <div className="border-b border-[#E2E8F0] pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1D5FA7]">Workspace</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0F2747] sm:text-4xl">
            Student Projects
          </h1>
          <p className="mt-3 text-sm text-[#5B6474] sm:text-base">
            Review and grade practical projects submitted by your assigned students.
          </p>
        </div>

        <section className="mt-8 grid gap-5 sm:grid-cols-3">
          <div className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[#7A8494]">Total Assigned Students</p>
            <p className="mt-2 text-3xl font-bold text-[#0F2747]">{assignments.length}</p>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 shadow-sm">
            <p className="text-sm font-medium text-amber-800">Pending Reviews</p>
            <p className="mt-2 text-3xl font-bold text-amber-900">{pendingReviews}</p>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50 p-6 shadow-sm">
            <p className="text-sm font-medium text-green-800">Completed Reviews</p>
            <p className="mt-2 text-3xl font-bold text-green-900">{completedReviews}</p>
          </div>
        </section>

        <div className="mt-8 space-y-6">
          {assignments.length === 0 ? (
            <div className="rounded-lg border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
              <p className="text-sm text-[#7A8494]">No students have been assigned to you yet.</p>
            </div>
          ) : (
            assignments.map((assignment) => {
              const student = assignment.application.student;
              const project = assignment.project;

              return (
                <div key={assignment.id} className="rounded-lg border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
                  {/* Student Header */}
                  <div className="border-b border-[#E2E8F0] bg-[#F7F9FC] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-[#172033]">{student.fullName}</h3>
                      <p className="text-xs text-[#7A8494]">{student.matricNumber} • {assignment.application.skill.name}</p>
                    </div>
                    <div>
                      {!project ? (
                        <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">Awaiting Submission</span>
                      ) : project.reviewed ? (
                        <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">Reviewed</span>
                      ) : (
                        <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">Needs Review</span>
                      )}
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="p-6">
                    {!project ? (
                      <p className="text-sm text-[#7A8494] italic">The student has not submitted their final project yet.</p>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-semibold uppercase text-[#7A8494]">Project Title</p>
                          <p className="mt-1 font-medium text-[#172033]">{project.title}</p>
                        </div>
                        
                        <div>
                          <p className="text-xs font-semibold uppercase text-[#7A8494]">Description & Report</p>
                          <p className="mt-1 text-sm text-[#5B6474] whitespace-pre-wrap rounded-md bg-[#F7F9FC] p-4 border border-[#E2E8F0]">
                            {project.description}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase text-[#7A8494]">Evidence Link</p>
                          <a href={project.submissionUrl || "#"} target="_blank" rel="noreferrer" className="mt-1 inline-block break-all font-medium text-[#1D5FA7] hover:underline">
                            {project.submissionUrl}
                          </a>
                        </div>

                        {/* NEW FEEDBACK FORM & REVIEW DISPLAY */}
                        <div className="mt-6 border-t border-[#E2E8F0] pt-6">
                          {!project.reviewed ? (
                            <form action={reviewProject} className="space-y-4">
                              <input type="hidden" name="projectId" value={project.id} />
                              
                              <div>
                                <label className="block text-xs font-semibold uppercase text-[#7A8494]">Instructor Feedback</label>
                                <textarea 
                                  name="feedback" 
                                  rows={3} 
                                  placeholder="e.g. Excellent fade technique. Next time, ensure the C-cup is a bit sharper..." 
                                  className="mt-2 block w-full rounded-md border border-[#E2E8F0] px-4 py-3 text-sm text-[#172033] focus:border-[#1D5FA7] focus:outline-none focus:ring-1 focus:ring-[#1D5FA7]"
                                ></textarea>
                              </div>

                              <div className="flex justify-end">
                                <LoadingButton loadingText="Saving Review..." className="w-full sm:w-auto px-6 py-2.5">
                                  Submit Review & Feedback
                                </LoadingButton>
                              </div>
                            </form>
                          ) : (
                            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                              <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-green-600">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                </svg>
                                <p className="font-semibold text-green-800">Project Reviewed</p>
                              </div>
                              {project.feedback && (
                                <div className="mt-3 border-t border-green-200 pt-3">
                                  <p className="text-xs font-semibold uppercase tracking-wider text-green-800/70">Your Feedback</p>
                                  <p className="mt-1 text-sm text-green-900 whitespace-pre-wrap">{project.feedback}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}