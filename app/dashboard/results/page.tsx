import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import CertificateDownloader from "@/app/components/student/CertificateDownloader";
import StudentNavigation from "@/app/components/student/StudentNavigation";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

async function getStudentResult() {
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
                    trainer: true,
                    result: true 
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

    return { student: user.student };
  } catch {
    redirect("/login");
  }
}

export default async function ResultsPage() {
  const { student } = await getStudentResult();
  const latestApp = student.applications[0];
  const assignment = latestApp?.trainingAssignment;
  const result = assignment?.result;

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
        <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 lg:py-12">
          
          <div className="border-b border-[#E2E8F0] pb-6 mb-8 text-center sm:text-left">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1D5FA7]">Stage 06</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0F2747] sm:text-4xl">
              Academic Performance
            </h1>
            <p className="mt-3 text-sm text-[#5B6474]">
              Official grading and classification for your SIWES entrepreneurship training.
            </p>
          </div>

          {!assignment ? (
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
              <p className="text-[#7A8494]">You are not currently assigned to a training track.</p>
            </div>
          ) : !result ? (
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-12 text-center shadow-sm flex flex-col items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-amber-500 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-bold text-[#0F2747] mb-2">Results Pending</h3>
              <p className="text-[#7A8494] max-w-md mx-auto">
                Your final examination and project scores have not been fully processed yet. Please check back after the assessment period concludes.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
              {/* Result Header */}
              <div className={`p-6 sm:p-10 text-center border-b ${result.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <span className="inline-block px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase mb-4 bg-white border shadow-sm">
                  {result.passed ? <span className="text-green-700">Pass</span> : <span className="text-red-700">Fail</span>}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0F2747]">{latestApp.skill.name} Track</h2>
                <p className="text-sm font-medium text-[#7A8494] mt-2">Instructor: {assignment.trainer.fullName}</p>
              </div>

              {/* Metrics Grid */}
              <div className="p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-[#E2E8F0] bg-white">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#7A8494] mb-2">CBT Score</p>
                  <p className="text-3xl font-bold text-[#1D5FA7]">{result.examScore.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#7A8494] mb-2">Total Score</p>
                  <p className="text-3xl font-bold text-[#0F2747]">{result.totalScore.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#7A8494] mb-2">Grade</p>
                  <p className="text-3xl font-bold text-[#0F2747]">{result.grade}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#7A8494] mb-2">GP</p>
                  <p className="text-3xl font-bold text-[#0F2747]">{result.gradePoint.toFixed(1)}</p>
                </div>
              </div>

              {/* Classification Footer */}
              <div className="bg-[#F7F9FC] p-8 border-t border-[#E2E8F0] text-center flex flex-col items-center">
                <p className="text-xs text-[#7A8494] uppercase tracking-[0.2em] font-bold mb-2">Final Classification</p>
                <p className="text-2xl font-bold text-[#172033] mb-6">{result.classification}</p>
                
                {/* Dynamic Certificate Download */}
                {result.passed && (
                  <CertificateDownloader 
                    studentName={student.fullName}
                    matricNumber={student.matricNumber}
                    skillTrack={latestApp.skill.name}
                    classification={result.classification}
                    date={new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}