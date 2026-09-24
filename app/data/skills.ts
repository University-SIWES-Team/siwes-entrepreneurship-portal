export type ShowcaseSkill = {
  name: string;
  description: string;
};

export type ShowcaseSkillGroup = {
  id: string;
  title: string;
  description: string;
  skills: ShowcaseSkill[];
};

export const skillsShowcaseGroups: ShowcaseSkillGroup[] = [
  {
    id: "vocational-digital-skills",
    title: "Available Skills",
    description:
      "Explore the practical, technical, creative, and digital training opportunities currently available through the programme.",
    skills: [
      {
        name: "Barbing",
        description:
          "Practical training in professional barbering techniques and services.",
      },
      {
        name: "General Building",
        description:
          "Practical training covering fundamental building and construction skills.",
      },
      {
        name: "Make Up",
        description:
          "Practical training in professional makeup techniques and beauty services.",
      },
      {
        name: "Bead Making",
        description:
          "Practical training in bead crafting and creative accessory production.",
      },
      {
        name: "Fashion Designing",
        description:
          "Practical training in clothing design, garment production, and fashion skills.",
      },
      {
        name: "Hair Dressing",
        description:
          "Practical training in professional hair styling and hair care services.",
      },
      {
        name: "Web Development",
        description:
          "Practical training in developing and building websites and web applications.",
      },
      {
        name: "Electrical Installation",
        description:
          "Practical training in electrical installation and related technical skills.",
      },
      {
        name: "Baking and Confectionaries",
        description:
          "Practical training in baking, confectionery preparation, and related skills.",
      },
      {
        name: "Catering",
        description:
          "Practical training in food preparation, service, and catering operations.",
      },
      {
        name: "Event Planning",
        description:
          "Practical training in planning, coordinating, and managing events.",
      },
      {
        name: "Leather Works",
        description:
          "Practical training in leather crafting and production of leather products.",
      },
      {
        name: "Household Products Production",
        description:
          "Practical training in the production of household products.",
      },
      {
        name: "CCTV Camera Installation and Networking",
        description:
          "Practical training in CCTV installation, configuration, and networking.",
      },
      {
        name: "Photography",
        description:
          "Practical training in photography techniques and professional image production.",
      },
      {
        name: "Offset Printing",
        description:
          "Practical training in offset printing and related printing processes.",
      },
    ],
  },
];