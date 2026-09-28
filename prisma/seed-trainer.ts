import { prisma } from "../app/lib/prisma";

async function main() {
  const trainer = await prisma.trainer.upsert({
    where: {
      email: "trainer@ouisiwes.local",
    },
    update: {},
    create: {
      fullName: "OUI Training Coordinator",
      email: "trainer@ouisiwes.local",
      specialty: "General Vocational Training",
    },
  });

  console.log("Trainer:", trainer);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());