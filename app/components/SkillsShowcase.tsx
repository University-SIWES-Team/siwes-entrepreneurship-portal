import { skillsShowcaseGroups } from "../data/skills";

export default function SkillsShowcase() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-showcase-heading"
      className="bg-[#F7F9FC] py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1D5FA7]">
            Training areas
          </p>
          <h2
            id="skills-showcase-heading"
            className="mt-3 text-3xl font-semibold tracking-tight text-[#0F2747] sm:text-4xl"
          >
            Skills Showcase
          </h2>
          <p className="mt-4 text-base leading-7 text-[#5B6474] sm:text-lg">
            Review the training areas currently identified for the programme.
            The final institutional skill list is still being confirmed and may
            change.
          </p>
        </div>

        <div className="mt-10 space-y-10 sm:mt-12">
          {skillsShowcaseGroups.map((group) => (
            <section key={group.id} aria-labelledby={`${group.id}-heading`}>
              <div className="max-w-3xl">
                <h3
                  id={`${group.id}-heading`}
                  className="text-xl font-semibold text-[#172033] sm:text-2xl"
                >
                  {group.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#5B6474] sm:text-base">
                  {group.description}
                </p>
              </div>

              <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.skills.map((skill) => (
                  <li
                    key={skill.name}
                    className="rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-sm transition-colors hover:border-[#1D5FA7]/40 sm:p-6"
                  >
                    <span className="inline-flex rounded-md bg-[#0F2747]/[0.06] px-2.5 py-1 text-xs font-medium text-[#0F2747]">
                      {skill.label}
                    </span>
                    <h4 className="mt-4 text-lg font-semibold text-[#172033]">
                      {skill.name}
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-[#5B6474]">
                      {skill.description}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
