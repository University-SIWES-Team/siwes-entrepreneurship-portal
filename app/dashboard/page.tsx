import Link from "next/link";
import { logout } from "@/app/actions/auth";

const journey = [
  {
    number: "01",
    title: "Account Created",
    description: "Your portal account has been created.",
    status: "complete",
  },
  {
    number: "02",
    title: "Registration",
    description: "Your student registration details are on record.",
    status: "complete",
  },
  {
    number: "03",
    title: "Programme Application",
    description: "Submit your programme application to continue.",
    status: "current",
  },
  {
    number: "04",
    title: "Payment",
    description: "Complete and verify your programme payment.",
    status: "upcoming",
  },
  {
    number: "05",
    title: "Skill Selection",
    description: "Select an available training skill.",
    status: "upcoming",
  },
  {
    number: "06",
    title: "Training",
    description: "View your training assignment and programme schedule.",
    status: "upcoming",
  },
  {
    number: "07",
    title: "Project",
    description: "Complete and submit your programme project.",
    status: "upcoming",
  },
  {
    number: "08",
    title: "Examination & Results",
    description: "Access examination information and results.",
    status: "upcoming",
  },
];

const overviewItems = [
  {
    label: "Application",
    value: "Not started",
    description: "Programme application",
  },
  {
    label: "Payment",
    value: "Not available",
    description: "Payment verification",
  },
  {
    label: "Skill",
    value: "Not selected",
    description: "Training skill",
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#172033]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-[#E2E8F0] bg-white lg:flex lg:flex-col">
        <div className="border-b border-[#E2E8F0] px-6 py-6">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-[#0F2747]"
          >
            OUI SIWES Portal
          </Link>

          <p className="mt-1 text-xs text-[#7A8494]">Student Portal</p>
        </div>

        <nav className="flex-1 px-4 py-6">
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

            {[
              "My Profile",
              "Application",
              "Payment",
              "Training",
              "Project",
              "Examination",
              "Results",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center rounded-lg px-3 py-2.5 text-sm text-[#5B6474] transition duration-200 hover:bg-[#F7F9FC] hover:text-[#172033]"
              >
                {item}
              </div>
            ))}
          </div>
        </nav>

        <div className="border-t border-[#E2E8F0] p-4">
          <form action={logout}>
            <button
              type="submit"
              className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2.5 text-sm font-medium text-[#5B6474] transition duration-200 hover:border-[#1D5FA7]/30 hover:bg-[#F7F9FC] hover:text-[#0F2747]"
            >
              Log out
            </button>
          </form>
        </div>
      </aside>

      <header className="sticky top-0 z-20 border-b border-[#E2E8F0] bg-white/95 backdrop-blur lg:ml-64">
        <div className="flex h-16 items-center justify-between px-5 sm:px-8">
          <div>
            <p className="text-sm font-semibold text-[#0F2747]">
              OUI SIWES Portal
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
              <p className="text-xs text-[#7A8494]">Programme participant</p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F2747] text-sm font-semibold text-white">
              S
            </div>
          </div>
        </div>
      </header>

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
                  Manage your SIWES and Entrepreneurship Programme journey from
                  registration through completion.
                </p>
              </div>

              <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#7A8494]">
                  Current stage
                </p>
                <p className="mt-1 text-sm font-semibold text-[#172033]">
                  Programme Application
                </p>
              </div>
            </div>
          </section>

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

            <aside className="h-fit rounded-lg border border-[#E2E8F0] bg-[#0F2747] p-6 text-white shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#D4A72C]">
                Next Step
              </p>

              <h2 className="mt-3 text-xl font-bold">
                Complete your programme application
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/70">
                Your next stage is to submit the information required for your
                programme application.
              </p>

              <div className="mt-6">
                <button
                  type="button"
                  disabled
                  className="w-full rounded-lg bg-white px-4 py-3 text-sm font-semibold text-[#0F2747] opacity-70"
                >
                  Application Module Coming Next
                </button>
              </div>
            </aside>
          </section>

          <section className="mt-8 rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#0F2747]">
                  Your portal is ready
                </p>

                <p className="mt-1 text-sm leading-6 text-[#5B6474]">
                  Application, payment, training, project, examination, and
                  result modules will appear here as you progress through the
                  programme.
                </p>
              </div>

              <span className="text-xs font-medium uppercase tracking-[0.12em] text-[#7A8494]">
                OUI SIWES Portal
              </span>
            </div>
          </section>
        </div>
      </main>

      <div className="border-t border-[#E2E8F0] bg-white p-4 lg:hidden">
        <form action={logout}>
          <button
            type="submit"
            className="w-full rounded-lg border border-[#E2E8F0] px-4 py-3 text-sm font-semibold text-[#5B6474] transition hover:bg-[#F7F9FC]"
          >
            Log out
          </button>
        </form>
      </div>
    </div>
  );
}