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
    <section className="py-16 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Follow these simple steps to complete your SIWES and
            Entrepreneurship program journey.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-xl border p-6 shadow-sm"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                {step.number}
              </div>

              <h3 className="text-xl font-semibold">
                {step.title}
              </h3>

              <p className="mt-2 text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
