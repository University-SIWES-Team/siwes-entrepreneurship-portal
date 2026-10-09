import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import TrainerNavigation from "@/app/components/trainer/TrainerNavigation";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

async function verifyTrainer() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) redirect("/login");

  let payload;
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    payload = verified.payload;
  } catch {
    redirect("/login");
  }

  if (!payload?.userId) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: payload.userId as string },
    include: { trainer: true },
  });

  if (!user) {
    throw new Error("DEBUG: User account does not exist.");
  }
  if (user.role !== "TRAINER") {
    throw new Error(`DEBUG: Role is not TRAINER. It is: ${user.role}`);
  }
  if (!user.trainer) {
    throw new Error("DEBUG: Trainer profile is missing! The user exists but has no linked Trainer data.");
  }
  
  return user;
}

export default async function TrainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await verifyTrainer();
  const trainer = user.trainer!;

  const navItems = [
    { name: "Overview", href: "/dashboard/trainer" },
    { name: "My Students", href: "/dashboard/trainer/students" },
    { name: "Projects & Grading", href: "/dashboard/trainer/projects" },
    { name: "Examinations", href: "/dashboard/trainer/exams" },
  ];

  const initials = trainer.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#172033] flex flex-col lg:flex-row">
      <TrainerNavigation 
        navItems={navItems}
        trainerName={trainer.fullName}
        trainerSpecialty={trainer.specialty}
        initials={initials}
      />
      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 w-full">
        {children}
      </main>
    </div>
  );
}