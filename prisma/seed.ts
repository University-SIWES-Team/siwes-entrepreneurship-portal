import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL!,
});

const prisma = new PrismaClient({ adapter });

const vocationalSkills = [
  "Barbing",
  "General Building",
  "Make Up",
  "Bead Making",
  "Fashion Designing",
  "Hair Dressing",
  "Web Development",
  "Electrical Installation",
  "Baking and Confectionaries",
  "Catering",
  "Event Planning",
  "Leather Works",
  "Household Products Production",
  "CCTV Camera Installation and Networking",
  "Photography",
  "Offset Printing",
];

async function main() {
  for (const name of vocationalSkills) {
    await prisma.skill.upsert({
      where: { name },
      update: {},
      create: {
        name,
        category: "Vocational",
      },
    });
  }

  console.log("Skills seeded successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });