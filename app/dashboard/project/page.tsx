import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import { submitProject } from "@/app/actions/project";
import LoadingButton from "@/app/components/LoadingButton";
import StudentNavigation from "@/app/components/student/StudentNavigation";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

async function getStudentData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) redirect("/login");

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload.userId) redirect("/login");

    const student = await prisma.student.findUnique({
      where: { userId: payload.userId as string },
      include: {
        applications: {
          include: {
            trainingAssignment: {
              include: {
                project: true,
                trainer: true,
              },
            },
          },
        },
      },
    });

    if (!student) redirect("/login");
    return student;
  } catch {
    redirect("/login");
  }
}

export default async function StudentProjectPage() {
  const student = await getStudentData();
  const application = student.applications?.[0];
  const assignment = application?.trainingAssignment;
  const project = assignment?.project;

  const studentName = student.fullName || "Student Account";
  const matricNumber = student.matricNumber || "Programme participant";
  const initials = studentName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "S";

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#172033] flex flex-col lg:flex-row">
      
      {/* Universal Dark Sidebar & Mobile Nav Component */}
      <StudentNavigation 
        studentName={studentName}
        matricNumber={matricNumber}
        initials={initials}
      />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 w-full">
        <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          
          {!assignment ? (
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
              <h2 className="text-xl font-bold text-[#0F2747]">Not Ready for Project Submission</h2>
              <p className="mt-2 text-[#5B6474]">You must be assigned to a trainer before you can submit a final project.</p>
            </div>
          ) : (
            <>
              <div className="border-b border-[#E2E8F0] pb-6">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1D5FA7]">Stage 05</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0F2747] sm:text-4xl">
                  Final Project Submission
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-[#5B6474] sm:text-base leading-6">
                  Submit your practical project, report, and evidence for review by your trainer ({assignment.trainer.fullName}).
                </p>
              </div>

              <div className="mt-8 rounded-xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
                <div className="border-b border-[#E2E8F0] bg-[#F7F9FC] px-6 py-4">
                  <h2 className="font-semibold text-[#172033]">Project Details</h2>
                </div>

                <div className="p-6 sm:p-8">
                  {project ? (
                    <div className="space-y-6">
                      <div className="rounded-lg border border-green-200 bg-green-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <p className="font-bold text-green-800">Project Submitted Successfully</p>
                          <p className="text-sm text-green-700 mt-1">Your work is currently {project.reviewed ? "reviewed and graded" : "awaiting review"}.</p>
                        </div>
                        <span className={`w-fit px-3 py-1 text-xs font-bold rounded-full border ${project.reviewed ? "bg-green-100 text-green-800 border-green-200" : "bg-amber-100 text-amber-800 border-amber-200"}`}>
                          {project.reviewed ? "REVIEWED" : "PENDING REVIEW"}
                        </span>
                      </div>

                      {project.reviewed && project.feedback && (
                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-5 shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-blue-600">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                            </svg>
                            <p className="font-bold text-blue-900">Instructor Feedback</p>
                          </div>
                          <p className="text-sm leading-relaxed text-blue-800 whitespace-pre-wrap">
                            {project.feedback}
                          </p>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 gap-4">
                        <div className="rounded-lg bg-[#F7F9FC] p-5">
                          <p className="text-xs font-semibold uppercase text-[#7A8494] mb-1">Project Title</p>
                          <p className="font-medium text-[#172033]">{project.title}</p>
                        </div>
                        
                        <div className="rounded-lg bg-[#F7F9FC] p-5">
                          <p className="text-xs font-semibold uppercase text-[#7A8494] mb-1">Project Description & Report</p>
                          <p className="whitespace-pre-wrap text-sm text-[#5B6474] leading-relaxed">{project.description}</p>
                        </div>

                        <div className="rounded-lg bg-[#F7F9FC] p-5">
                          <p className="text-xs font-semibold uppercase text-[#7A8494] mb-1">Evidence Link</p>
                          <a href={project.submissionUrl || "#"} target="_blank" rel="noreferrer" className="block truncate font-medium text-[#1D5FA7] hover:underline hover:text-blue-700 transition">
                            {project.submissionUrl}
                          </a>
                        </div>
                      </div>
                      
                      {!project.reviewed && (
                        <div className="border-t border-[#E2E8F0] pt-6 mt-8">
                          <p className="text-sm font-semibold text-[#172033] mb-4">Update Submission</p>
                          <form action={submitProject} className="space-y-4">
                            <input type="text" name="title" defaultValue={project.title || ""} required placeholder="Project Title" className="block w-full rounded-lg border border-[#E2E8F0] px-4 py-3 text-sm focus:border-[#1D5FA7] focus:outline-none focus:ring-1 focus:ring-[#1D5FA7]" />
                            <textarea name="description" defaultValue={project.description || ""} required rows={4} placeholder="Briefly describe your project, the process, and what you achieved..." className="block w-full rounded-lg border border-[#E2E8F0] px-4 py-3 text-sm focus:border-[#1D5FA7] focus:outline-none focus:ring-1 focus:ring-[#1D5FA7]"></textarea>
                            <input type="url" name="submissionUrl" defaultValue={project.submissionUrl || ""} required placeholder="Google Drive, YouTube, or PDF link..." className="block w-full rounded-lg border border-[#E2E8F0] px-4 py-3 text-sm focus:border-[#1D5FA7] focus:outline-none focus:ring-1 focus:ring-[#1D5FA7]" />
                            <LoadingButton loadingText="Updating..." className="w-full bg-[#0F2747] hover:bg-[#173a6a] transition">Update Submission</LoadingButton>
                          </form>
                        </div>
                      )}
                    </div>
                  ) : (
                    <form action={submitProject} className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-[#172033] mb-1">Project Title</label>
                        <input type="text" name="title" required placeholder="e.g. Bridal Cake Practical, Barbing Fade Cut, E-Commerce App" className="block w-full rounded-lg border border-[#E2E8F0] px-4 py-3 text-sm placeholder-[#7A8494] focus:border-[#1D5FA7] focus:outline-none focus:ring-1 focus:ring-[#1D5FA7]" />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-[#172033] mb-1">Project Description / Report</label>
                        <p className="mb-2 text-xs text-[#7A8494]">Describe the steps you took, materials used, and your final result.</p>
                        <textarea name="description" required rows={5} placeholder="I started by preparing the materials..." className="block w-full rounded-lg border border-[#E2E8F0] px-4 py-3 text-sm placeholder-[#7A8494] focus:border-[#1D5FA7] focus:outline-none focus:ring-1 focus:ring-[#1D5FA7]"></textarea>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#172033] mb-1">Evidence Link (Cloud URL)</label>
                        <p className="mb-2 text-xs text-[#7A8494]">Upload photos, videos, or PDFs of your work to Google Drive, OneDrive, or YouTube. Ensure the link is public, then paste it here.</p>
                        <input type="url" name="submissionUrl" required placeholder="https://drive.google.com/..." className="block w-full rounded-lg border border-[#E2E8F0] px-4 py-3 text-sm placeholder-[#7A8494] focus:border-[#1D5FA7] focus:outline-none focus:ring-1 focus:ring-[#1D5FA7]" />
                      </div>
                      
                      <div className="pt-4">
                        <LoadingButton loadingText="Submitting..." className="w-full px-8 py-3 sm:w-auto bg-[#1D5FA7] hover:bg-[#154b85] transition">
                          Submit Final Project
                        </LoadingButton>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}