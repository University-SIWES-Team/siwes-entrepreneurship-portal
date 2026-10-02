export default function Hero() {
  return (
    <section className="bg-[#F7F9FC] px-6 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1D5FA7]">
            OUI Entrepreneurship Programme Management System
          </p>

          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-[#0F2747] sm:text-5xl lg:text-6xl">
            Manage Your Programme Journey in One Place
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-[#5B6474] sm:text-lg">
            A centralized platform for student registration, programme
            applications, payment verification, skill selection, training,
            project submission, examinations, and results.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="/register"
              className="inline-flex items-center justify-center rounded-md bg-[#1D5FA7] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0F2747]"
            >
              Get Started
            </a>

            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-md border border-[#E2E8F0] bg-white px-6 py-3 text-sm font-semibold text-[#0F2747] transition-colors hover:border-[#1D5FA7] hover:text-[#1D5FA7]"
            >
              How It Works
            </a>
          </div>
        </div>

        <div className="border border-[#E2E8F0] bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#1D5FA7]">
            Programme Journey
          </p>

          <div className="mt-6 space-y-4">
            {[
              "Registration & Profile",
              "Application & Payment",
              "Skill Selection",
              "Training & Project",
              "Examination & Results",
            ].map((item, index) => (
              <div
                key={item}
                className="flex items-center gap-4 border-b border-[#E2E8F0] pb-4 last:border-b-0 last:pb-0"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0F2747] text-xs font-bold text-white">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="text-sm font-medium text-[#172033]">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}