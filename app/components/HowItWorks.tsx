const steps = [
  {
    number: "01",
    title: "Create Your Account",
    description: "Register and create your student account.",
  },
  {
    number: "02",
    title: "Complete Your Profile",
    description: "Provide and update your required student information.",
  },
  {
    number: "03",
    title: "Apply for the Program",
    description: "Submit your SIWES and Entrepreneurship program application.",
  },
  {
    number: "04",
    title: "Make Payment",
    description: "Complete the required payment and wait for verification.",
  },
  {
    number: "05",
    title: "Select Your Skill",
    description: "Choose an available training skill after payment verification.",
  },
  {
    number: "06",
    title: "Get Approved & Assigned Training",
    description:
      "Your application is reviewed and accepted students receive training information and trainer details.",
  },
  {
    number: "07",
    title: "Complete Your Training",
    description: "Attend your assigned training.",
  },
  {
    number: "08",
    title: "Submit Your Project",
    description: "Complete and submit your practical project.",
  },
  {
    number: "09",
    title: "Complete Your Examination",
    description: "Complete the theoretical examination.",
  },
  {
    number: "10",
    title: "View Results & Complete the Program",
    description:
      "View your published results and complete the program.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-16 px-6 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-16 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1D5FA7]">
            The Process
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0F2747] sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-[#5B6474]">
            Follow these ten steps to complete your SIWES and Entrepreneurship
            programme journey, from registration through to your final results.
          </p>
        </div>

        <div className="relative">
          <div
            className="absolute left-5 top-0 bottom-0 w-px bg-[#E2E8F0]"
            aria-hidden="true"
          />
          <ol className="space-y-10">
            {steps.map((step) => (
              <li key={step.number} className="group relative flex gap-6">
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0F2747] text-sm font-bold text-white ring-4 ring-white transition-colors group-hover:bg-[#1D5FA7]">
                  {step.number}
                </div>
                <div className="flex-1 pt-1.5">
                  <h3 className="text-lg font-semibold text-[#172033] transition-colors group-hover:text-[#1D5FA7]">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm text-[#5B6474]">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}