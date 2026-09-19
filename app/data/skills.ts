export type ShowcaseSkill = {
  name: string;
  description: string;
  label: string;
};

export type ShowcaseSkillGroup = {
  id: string;
  title: string;
  description: string;
  skills: ShowcaseSkill[];
};

export const skillsShowcaseGroups: ShowcaseSkillGroup[] = [
  {
    id: "vocational-skills",
    title: "Vocational Skills",
    description:
      "Hands-on and trade-based training opportunities offered through the programme.",
    skills: [
      {
        name: "Vocational training options",
        description:
          "The university's approved vocational skill options will be listed here once the institutional list is confirmed.",
        label: "Institutional list pending",
      },
    ],
  },
  {
    id: "digital-skills",
    title: "Digital Skills",
    description:
      "The current requirements identify the following as example digital training areas.",
    skills: [
      {
        name: "Software",
        description:
          "An example digital training area identified in the current requirements. Final training scope will be confirmed by the institution.",
        label: "Example area",
      },
      {
        name: "Hardware",
        description:
          "An example digital training area identified in the current requirements. Final training scope will be confirmed by the institution.",
        label: "Example area",
      },
      {
        name: "Electronics",
        description:
          "An example digital training area identified in the current requirements. Final training scope will be confirmed by the institution.",
        label: "Example area",
      },
    ],
  },
];
