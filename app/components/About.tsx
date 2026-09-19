export default function About() {
  return (
    <section id="about" className="bg-white py-16 px-6 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1D5FA7] text-center">
          About
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0F2747] text-center sm:text-4xl">
          About the Programme
        </h2>

        <div className="mt-8 space-y-4">
          <p className="leading-relaxed text-[#5B6474]">
            The SIWES & Entrepreneurship Programme is a university programme
            that combines the Student Industrial Work Experience Scheme
            (SIWES) with entrepreneurship training. This portal digitizes and
            manages the entire programme, from application through to
            completion.
          </p>

          <p className="leading-relaxed text-[#5B6474]">
            The programme is compulsory for eligible students after 200 level
            and before proceeding to 300 level. It gives students practical,
            hands-on experience alongside entrepreneurial skills that
            complement their academic studies.
          </p>

          <p className="leading-relaxed text-[#5B6474]">
            The portal brings these programme processes into a single centralized
            system, reducing reliance on manual processes. It helps students and
            administrators manage
          </p>

          <ul className="list-inside list-disc space-y-2 text-[#5B6474]">
            <li>Registration and profile management</li>
            <li>Programme application and approval</li>
            <li>Secure online payment and verification</li>
            <li>Skill/training category selection</li>
            <li>Training assignment and details</li>
            <li>Practical project submission</li>
            <li>Examinations and results</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
