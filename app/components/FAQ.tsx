const faqs = [
  {
    question: "Who is eligible for the SIWES & Entrepreneurship Programme?",
    answer:
      "Students become eligible after completing 200 level and before proceeding to 300 level.",
  },
  {
    question: "What does the programme combine?",
    answer:
      "The programme combines the Student Industrial Work Experience Scheme (SIWES) with entrepreneurship training.",
  },
  {
    question: "How do I apply?",
    answer:
      "Create an account, complete your student profile, then submit your programme application through the portal.",
  },
  {
    question: "How is payment handled?",
    answer:
      "Payment is made online through the portal and verified before you can proceed to skill selection.",
  },
  {
    question: "Can I choose my own training skill?",
    answer:
      "Yes. Once your payment is verified, you select from the available training skills for the programme.",
  },
];

export default function FAQ() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="bg-[#F7F9FC] py-16 px-6 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1D5FA7]">
          FAQ
        </p>
        <h2
          id="faq-heading"
          className="mt-3 text-3xl font-bold tracking-tight text-[#0F2747] sm:text-4xl"
        >
          Frequently Asked Questions
        </h2>

        <div className="mt-10 divide-y divide-[#E2E8F0] border-t border-b border-[#E2E8F0]">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-left font-semibold text-[#172033]">
                {faq.question}
                <span className="ml-4 shrink-0 text-[#1D5FA7] transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 leading-relaxed text-[#5B6474]">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}