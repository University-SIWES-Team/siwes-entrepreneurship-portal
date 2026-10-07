import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import StudentNavigation from "@/app/components/student/StudentNavigation";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

async function getStudentProfile() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) redirect("/login");

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload.userId) redirect("/login");

    const student = await prisma.student.findUnique({
      where: { userId: payload.userId as string },
      include: {
        user: true,
        applications: {
          include: {
            skill: true,
            trainingAssignment: {
              include: { trainer: true },
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

export default async function StudentProfilePage() {
  const student = await getStudentProfile();
  const application = student.applications?.[0];

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
        <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          <section className="border-b border-[#E2E8F0] pb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1D5FA7]">Student Records</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0F2747] sm:text-4xl">My Profile</h1>
            <p className="mt-3 text-sm leading-6 text-[#5B6474] sm:text-base">
              View your registered personal details and current programme standing.
            </p>
          </section>

          <section className="mt-8 grid gap-8 lg:grid-cols-2">
            {/* Personal Info Card */}
            <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
              <div className="border-b border-[#E2E8F0] bg-[#F7F9FC] px-6 py-4">
                <h2 className="font-semibold text-[#172033]">Personal Information</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-[#7A8494]">Full Name</p>
                  <p className="mt-1 font-medium text-[#172033]">{student.fullName}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-[#7A8494]">Email Address</p>
                  <p className="mt-1 font-medium text-[#172033]">{student.user.email}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[#7A8494]">Matric Number</p>
                    <p className="mt-1 font-medium text-[#172033]">{student.matricNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[#7A8494]">Academic Level</p>
                    <p className="mt-1 font-medium text-[#172033]">{student.level}L</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Programme Info Card */}
            <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
              <div className="border-b border-[#E2E8F0] bg-[#F7F9FC] px-6 py-4">
                <h2 className="font-semibold text-[#172033]">Programme Status</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-[#7A8494]">Selected Skill Track</p>
                  <p className="mt-1 font-medium text-[#1D5FA7]">
                    {application?.skill?.name || "Not selected yet"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-[#7A8494]">Application Status</p>
                  <span className={`mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    application?.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                    application?.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                    application?.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {application?.status || "INCOMPLETE"}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-[#7A8494]">Assigned Trainer</p>
                  <p className="mt-1 font-medium text-[#172033]">
                    {application?.trainingAssignment?.trainer?.fullName || "Awaiting assignment"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SEQUENTIAL NAVIGATION BUTTON */}
          <div className="mt-12 flex items-center justify-between border-t border-[#E2E8F0] pt-6">
            <span className="text-sm text-[#7A8494] hidden sm:block">
              Proceed to review your application status.
            </span>
            <Link
              href="/dashboard/application"
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg bg-[#0F2747] px-8 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#173a6a]"
            >
              Next: Application &rarr;
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}