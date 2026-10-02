import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL!,
});

const prisma = new PrismaClient({ adapter });

// Pre-computed bcrypt hash for "password123"
const DEFAULT_PASSWORD_HASH = "$2a$10$3i9/lVd8UOIgJXaZgRXlCOm.MWeD8a1l92Xz3vA1Xv0W9Vb.wBv9G";

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
  // 1. Seed Skills
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

  // 2. Ensure Admin Exists
  await prisma.user.upsert({
    where: { email: "admin@ouisiwesportal.com" },
    update: {},
    create: {
      email: "admin@ouisiwesportal.com",
      passwordHash: DEFAULT_PASSWORD_HASH,
      role: "ADMIN",
    },
  });
  console.log("Admin verified.");

  // 3. Ensure Trainer Exists
  const trainerEmail = "trainer@ouisiwesportal.com";
  const existingTrainerUser = await prisma.user.findUnique({
    where: { email: trainerEmail },
    include: { trainer: true }
  });

  if (!existingTrainerUser) {
    await prisma.user.create({
      data: {
        email: trainerEmail,
        passwordHash: DEFAULT_PASSWORD_HASH,
        role: "TRAINER",
        trainer: {
          create: {
            fullName: "Dr. Jane Smith",
            specialty: "Web Development",
          }
        }
      }
    });
    console.log("Trainer seeded successfully.");
  } else if (!existingTrainerUser.trainer) {
    await prisma.trainer.create({
      data: {
        userId: existingTrainerUser.id,
        fullName: "Dr. Jane Smith",
        specialty: "Web Development",
      }
    });
    console.log("Trainer profile attached to existing user.");
  } else {
    console.log("Trainer already exists.");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });