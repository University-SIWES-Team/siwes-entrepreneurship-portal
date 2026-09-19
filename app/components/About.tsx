// About.tsx
// This is a React component. Think of it as a function that returns HTML.
// Differences from plain HTML you'll notice below:
//   - we use "className" instead of "class" (class is a reserved word in JS)
//   - the whole block of HTML-like code is returned from a function
//   - {" "} or {variable} would insert JS values, but we don't need that here

export default function About() {
  return (
    <section id="about" className="bg-white py-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Section heading */}
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          About the Programme
        </h2>

        {/* What the programme is */}
        <p className="text-gray-700 leading-relaxed mb-4">
          The SIWES & Entrepreneurship Programme is a university programme
          that combines the Student Industrial Work Experience Scheme
          (SIWES) with entrepreneurship training. This portal digitizes and
          manages the entire programme, from application through to
          completion.
        </p>

        {/* Why students go through it */}
        <p className="text-gray-700 leading-relaxed mb-4">
          The programme is compulsory for eligible students after 200 level
          and before proceeding to 300 level. It gives students practical,
          hands-on experience alongside entrepreneurial skills that
          complement their academic studies.
        </p>

        {/* What the portal helps manage */}
        <p className="text-gray-700 leading-relaxed mb-4">
          The portal replaces manual, paper-based processes with a single
          centralized system. It helps students and administrators manage:
        </p>

        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
          <li>Registration and profile management</li>
          <li>Programme application and approval</li>
          <li>Secure online payment and verification</li>
          <li>Skill training category selection</li>
          <li>Training assignment and details</li>
          <li>Practical project submission</li>
          <li>Examinations and results</li>
        </ul>
      </div>
    </section>
  );
}