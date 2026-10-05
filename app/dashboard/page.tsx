import Link from "next/link";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { logout } from "@/app/actions/auth";
import { getApplicationData } from "@/app/actions/application";
import { resubmitApplication } from "@/app/actions/student";
import { getActiveSessionForStudent } from "@/app/actions/attendance";
import LoadingButton from "@/app/components/LoadingButton";
import StudentAttendanceInput from "@/app/components/student/StudentAttendanceInput";
import StudentPulseCheck from "@/app/components/student/StudentPulseCheck";

// Re-submit form component injected for rejected applications
function ResubmitForm({ applicationId }: { applicationId: string }) {
  const resubmit = async () => {
    "use server";
    await resubmitApplication(applicationId);
  };

  return (
    <form action={resubmit}>
      <button
        type="submit"
        className="block w-full rounded-lg bg-red-500 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-red-600"
      >
        Re-submit Application
      </button>
    </form>
  );
}

export default async function DashboardPage() {
  const data = await getApplicationData();

  if ("error" in data) {
    return null;
  }

  const { application } = data;

  // Retrieve user ID for attendance validation
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  let userId = "";
  if (token) {
    try {
      const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
      const { payload } = await jwtVerify(token, JWT_SECRET);
      userId = payload.userId as string;
    } catch (e) {}
  }

  // Fetch active session if user is linked
  const activeSession = userId ? await getActiveSessionForStudent(userId) : null;

  const paymentsPaid =
    application?.payments.filter((payment) => payment.status === "PAID")
      .length ?? 0;

  const totalPayments = application?.payments.length ?? 0;

  // 1. FIXED LOGIC: ACCURATE STAGE CALCULATION
  let currentStepNum = 2; // Default to Application & Skill Selection
  
  if (application && application.status === "APPROVED") {
    if (totalPayments > 0 && paymentsPaid < totalPayments) {
      currentStepNum = 3; // Payments phase
    } else if (paymentsPaid === totalPayments && totalPayments > 0) {
      if (!application.trainingAssignment) {
         currentStepNum = 4; // Awaiting Trainer
      } else if (application.trainingAssignment.status !== "COMPLETED") {
         currentStepNum = 4; // Active Training phase
      } else {
         currentStepNum = 5; // Project phase
      }
    }
  } else if (application?.status === "REJECTED") {
    currentStepNum = 2; // Force them back to the application stage
  }

  // 2. REAL-WORLD STREAMLINED PROGRAMME JOURNEY
  const journey = [
    { 
      number: "01", 
      title: "Account & Registration", 
      description: "Portal account and student registry records created.", 
      status: "complete" 
    },
    { 
      number: "02", 
      title: "Application & Skill Selection", 
      description: "Submitted your programme application and selected your vocational skill.", 
      status: application?.status === "APPROVED" ? "complete" : "current" 
    },
    { 
      number: "03", 
      title: "Programme Payments", 
      description: "Upload and verify your registration and training fee receipts.", 
      status: paymentsPaid === totalPayments && totalPayments > 0 ? "complete" : application?.status === "APPROVED" ? "current" : "upcoming" 
    },
    { 
      number: "04", 
      title: "Training", 
      description: "Assigned to an expert instructor for practical skill acquisition.", 
      status: application?.trainingAssignment?.status === "COMPLETED" ? "complete" : paymentsPaid === totalPayments && totalPayments > 0 ? "current" : "upcoming" 
    },
    { 
      number: "05", 
      title: "Final Project", 
      description: "Complete and submit your vocational training project for review.", 
      status: application?.trainingAssignment?.status === "COMPLETED" ? "current" : "upcoming" 
    },
    { 
      number: "06", 
      title: "Examination & Results", 
      description: "Take the entrepreneurship exam and access your final certified results.", 
      status: "upcoming" 
    },
  ];

  // 3. DYNAMIC OVERVIEW CARDS
  const overviewItems = [
    {
      label: "Application",
      value: application ? application.status : "Not started",
      description: "Programme application",
    },
    {
      label: "Payment",
      value: application
        ? `${paymentsPaid}/${totalPayments} paid`
        : "Not available",
      description: "Payment verification",
    },
    {
      label: "Skill",
      value: application?.skill.name ?? "Not selected",
      description: "Training skill",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#172033]">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-[#E2E8F0] bg-white lg:flex lg:flex-col">
        <div className="border-b border-[#E2E8F0] px-6 py-6">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-[#0F2747]"
          >
            Entrepreneurship Portal
          </Link>
          <p className="mt-1 text-xs text-[#7A8494]">Student Portal</p>
        </div>

        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <p className="px-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#7A8494]">
            Portal
          </p>

          <div className="mt-3 space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center rounded-lg bg-[#F0F5FA] px-3 py-2.5 text-sm font-semibold text-[#1D5FA7]"
            >
              Dashboard
            </Link>

            <Link
              href="/dashboard/profile"
              className="flex items-center rounded-lg px-3 py-2.5 text-sm text-[#5B6474] transition duration-200 hover:bg-[#F7F9FC] hover:text-[#172033]"
            >
              My Profile
            </Link>

            <Link
              href="/dashboard/application"
              className="flex items-center rounded-lg px-3 py-2.5 text-sm text-[#5B6474] transition duration-200 hover:bg-[#F7F9FC] hover:text-[#172033]"
            >
              Application
            </Link>

            <Link
              href="/dashboard/payments"
              className="flex items-center rounded-lg px-3 py-2.5 text-sm text-[#5B6474] transition duration-200 hover:bg-[#F7F9FC] hover:text-[#172033]"
            >
              Payments
            </Link>

            <Link
              href="/dashboard/training"
              className="flex items-center rounded-lg px-3 py-2.5 text-sm text-[#5B6474] transition duration-200 hover:bg-[#F7F9FC] hover:text-[#172033]"
            >
              Training
            </Link>

            <Link
              href="/dashboard/project"
              className="flex items-center rounded-lg px-3 py-2.5 text-sm text-[#5B6474] transition duration-200 hover:bg-[#F7F9FC] hover:text-[#172033]"
            >
              Project
            </Link>

            <Link
              href="/dashboard/examination"
              className="flex items-center rounded-lg px-3 py-2.5 text-sm text-[#5B6474] transition duration-200 hover:bg-[#F7F9FC] hover:text-[#172033]"
            >
              Examination
            </Link>

            <Link
              href="/dashboard/results"
              className="flex items-center rounded-lg px-3 py-2.5 text-sm text-[#5B6474] transition duration-200 hover:bg-[#F7F9FC] hover:text-[#172033]"
            >
              Results
            </Link>
          </div>
        </nav>

        <div className="border-t border-[#E2E8F0] p-4">
          <form action={logout}>
            <LoadingButton
              loadingText="Signing out..."
              className="w-full"
            >
              Sign out
            </LoadingButton>
          </form>
        </div>
      </aside>

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-[#E2E8F0] bg-white/95 backdrop-blur lg:ml-64">
        <div className="flex h-16 items-center justify-between px-5 sm:px-8">
          <div>
            <p className="text-sm font-semibold text-[#0F2747]">
              Entrepreneurship Portal
            </p>
            <p className="hidden text-xs text-[#7A8494] sm:block">
              Student Dashboard
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-[#172033]">
                Student Account
              </p>
              <p className="text-xs text-[#7A8494]">
                Programme participant
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F2747] text-sm font-semibold text-white">
              S
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex gap-2 overflow-x-auto border-t border-[#E2E8F0] bg-white px-5 py-3 shadow-sm lg:hidden [&::-webkit-scrollbar]:hidden">
          <Link href="/dashboard" className="shrink-0 rounded-lg bg-[#F0F5FA] px-4 py-2 text-sm font-semibold text-[#1D5FA7]">Dashboard</Link>
          <Link href="/dashboard/profile" className="shrink-0 rounded-lg px-4 py-2 text-sm font-medium text-[#5B6474] transition hover:bg-[#F7F9FC]">Profile</Link>
          <Link href="/dashboard/application" className="shrink-0 rounded-lg px-4 py-2 text-sm font-medium text-[#5B6474] transition hover:bg-[#F7F9FC]">Application</Link>
          <Link href="/dashboard/payments" className="shrink-0 rounded-lg px-4 py-2 text-sm font-medium text-[#5B6474] transition hover:bg-[#F7F9FC]">Payments</Link>
          <Link href="/dashboard/training" className="shrink-0 rounded-lg px-4 py-2 text-sm font-medium text-[#5B6474] transition hover:bg-[#F7F9FC]">Training</Link>
          <Link href="/dashboard/project" className="shrink-0 rounded-lg px-4 py-2 text-sm font-medium text-[#5B6474] transition hover:bg-[#F7F9FC]">Project</Link>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="lg:ml-64">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          <section className="border-b border-[#E2E8F0] pb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1D5FA7]">
              Dashboard
            </p>

            <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-[#0F2747] sm:text-4xl">
                  Welcome back
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5B6474] sm:text-base">
                  Manage your Entrepreneurship Programme journey from
                  registration through completion.
                </p>
              </div>

              <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#7A8494]">
                  Current stage
                </p>

                <p className="mt-1 text-sm font-semibold text-[#172033]">
                  {journey.find((j) => j.status === "current")?.title || "Completed"}
                </p>
              </div>
            </div>
          </section>

          {/* ACTIVE CLASS SESSION ALERT */}
          {activeSession && (
            <section className="py-6">
              <div className="overflow-hidden rounded-xl border border-blue-200 bg-blue-50 shadow-sm">
                <div className="bg-blue-600 px-5 py-3 flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                  </span>
                  <span className="text-sm font-bold tracking-wider text-white uppercase">
                    Live {activeSession.type} Class in Progress
                  </span>
                </div>
                <div className="p-5 md:p-8 flex justify-center">
                  {activeSession.type === "PHYSICAL" ? (
                    <StudentAttendanceInput sessionId={activeSession.id} studentUserId={userId} />
                  ) : (
                    <StudentPulseCheck sessionId={activeSession.id} studentUserId={userId} />
                  )}
                </div>
              </div>
            </section>
          )}

          <section className="py-8">
            <div className="grid gap-4 md:grid-cols-3">
              {overviewItems.map((item) => (
                <article
                  key={item.label}
                  className="rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <p className="text-sm font-medium text-[#5B6474]">
                    {item.label}
                  </p>

                  <p className="mt-3 text-xl font-bold text-[#0F2747]">
                    {item.value}
                  </p>

                  <p className="mt-1 text-xs text-[#7A8494]">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-8 xl:grid-cols-[1.4fr_0.6fr]">
            <div className="rounded-lg border border-[#E2E8F0] bg-white shadow-sm">
              <div className="border-b border-[#E2E8F0] px-6 py-5">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#1D5FA7]">
                  Programme Journey
                </p>

                <h2 className="mt-2 text-xl font-bold text-[#0F2747]">
                  Track your progress
                </h2>
              </div>

              <div className="divide-y divide-[#E2E8F0]">
                {journey.map((item) => (
                  <div
                    key={item.number}
                    className="flex gap-4 px-6 py-5 transition duration-200 hover:bg-[#F7F9FC]"
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        item.status === "complete"
                          ? "bg-[#0F2747] text-white"
                          : item.status === "current"
                            ? "bg-[#D4A72C] text-[#0F2747]"
                            : "border border-[#E2E8F0] bg-white text-[#7A8494]"
                      }`}
                    >
                      {item.status === "complete" ? "✓" : item.number}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-[#172033]">
                          {item.title}
                        </h3>

                        {item.status === "current" && (
                          <span className="rounded-full bg-[#FFF7DB] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#8A6A00]">
                            Current
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm leading-6 text-[#7A8494]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FIXED LOGIC: DYNAMIC NEXT STEP BLOCK */}
            <aside className="h-fit rounded-lg border border-[#E2E8F0] bg-[#0F2747] p-6 text-white shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#D4A72C]">
                Next Step
              </p>

              <h2 className="mt-3 text-xl font-bold">
                {application?.status === "REJECTED" ? "Update and Re-submit"
                : currentStepNum === 2 ? "Complete your programme application"
                : currentStepNum === 3 ? "Complete your programme payments"
                : currentStepNum === 4 && !application?.trainingAssignment ? "Awaiting Trainer Assignment"
                : currentStepNum === 4 ? "Begin Vocational Training"
                : "Proceed to Project Phase"}
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/70">
                {application?.status === "REJECTED" ? "Your application was rejected by the admin. Please review your details and re-submit for approval."
                : currentStepNum === 2 ? "Your next stage is to submit the information required for your programme application."
                : currentStepNum === 3 ? "Complete your outstanding programme payments and submit your payment evidence."
                : currentStepNum === 4 && !application?.trainingAssignment ? "Your application and payments are approved. The Admin will assign your trainer shortly."
                : currentStepNum === 4 ? "Your trainer has been assigned. You may now begin your vocational syllabus."
                : "Your training is complete. You may now proceed to the final project and examinations."}
              </p>

              <div className="mt-6">
                {application?.status === "REJECTED" ? (
                  <ResubmitForm applicationId={application.id} />
                ) : currentStepNum === 2 ? (
                  <Link
                    href="/dashboard/application"
                    className="block w-full rounded-lg bg-white px-4 py-3 text-center text-sm font-semibold text-[#0F2747] transition hover:-translate-y-0.5 hover:bg-[#F7F9FC]"
                  >
                    Start Application
                  </Link>
                ) : currentStepNum === 3 ? (
                  <Link
                    href="/dashboard/payments"
                    className="block w-full rounded-lg bg-[#1D5FA7] px-4 py-3 text-center text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#154b85]"
                  >
                    Make Payments
                  </Link>
                ) : currentStepNum === 4 ? (
                  <Link
                    href="/dashboard/training"
                    className="block w-full rounded-lg bg-[#1D5FA7] px-4 py-3 text-center text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#154b85]"
                  >
                    Go to Training
                  </Link>
                ) : (
                  <Link
                    href="/dashboard/project"
                    className="block w-full rounded-lg bg-[#1D5FA7] px-4 py-3 text-center text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#154b85]"
                  >
                    Submit Project
                  </Link>
                )}
              </div>
            </aside>
          </section>

          {/* SEQUENTIAL NAVIGATION BUTTON */}
          <div className="mt-12 flex items-center justify-between border-t border-[#E2E8F0] pt-6">
            <span className="text-sm text-[#7A8494] hidden sm:block">
              Navigate to your profile to view your personal records.
            </span>
            <Link
              href="/dashboard/profile"
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg bg-[#0F2747] px-8 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#173a6a]"
            >
              Next: My Profile &rarr;
            </Link>
          </div>

          <section className="mt-8 rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#0F2747]">
                  Your portal is ready
                </p>

                <p className="mt-1 text-sm leading-6 text-[#5B6474]">
                  Application, payment, training, project, examination, and
                  result modules are now fully active.
                </p>
              </div>

              <span className="text-xs font-medium uppercase tracking-[0.12em] text-[#7A8494]">
                Entrepreneurship Programme
              </span>
            </div>
          </section>
        </div>
      </main>

      {/* Mobile Logout block */}
      <div className="border-t border-[#E2E8F0] bg-white p-4 lg:hidden">
        <form action={logout}>
          <LoadingButton
            loadingText="Signing out..."
            className="w-full"
          >
            Sign out
          </LoadingButton>
        </form>
      </div>
    </div>
  );
}