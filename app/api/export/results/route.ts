import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

function getNucClassification(total: number) {
  if (total >= 70) return "First Class";
  if (total >= 60) return "Second Class Upper";
  if (total >= 50) return "Second Class Lower";
  if (total >= 45) return "Third Class";
  if (total >= 40) return "Pass";
  return "Fail";
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      include: { trainer: true },
    });

    if (!user?.trainer) return new NextResponse("Forbidden", { status: 403 });

    // Fetch total sessions held by this trainer overall
    const totalSessions = await prisma.classSession.count({
      where: { trainerId: user.trainer.id }
    });

    // Fetch students with only their "PRESENT" attendance records attached
    const assignments = await prisma.trainingAssignment.findMany({
      where: { trainerId: user.trainer.id },
      include: {
        application: { include: { student: true, skill: true } },
        project: true,
        attendances: { where: { status: "PRESENT" } } 
      },
    });

    const exam = await prisma.exam.findUnique({
      where: { trainerId: user.trainer.id },
      include: { attempts: true, questions: true },
    });

    const totalQuestions = exam?.questions.length || 1;

    let csvContent = "Student Name,Matric Number,Skill Track,Project Score (/60),CBT Score (/30),Attendance (/10),Final Total (%),NUC Classification\n";

    for (const assignment of assignments) {
      const student = assignment.application.student;
      
      const projectScore = assignment.project?.score || 0;
      
      const attempt = exam?.attempts.find((a: any) => a.studentUserId === student.userId);
      const rawCbtScore = attempt?.score || 0;
      const scaledCbtScore = Math.round((rawCbtScore / totalQuestions) * 30);
      
      // Calculate Dynamic Attendance Ratio
      let attendanceScore = 10;
      if (totalSessions > 0) {
        attendanceScore = Math.round((assignment.attendances.length / totalSessions) * 10);
      }
      
      const finalTotal = projectScore + scaledCbtScore + attendanceScore; 
      const classification = getNucClassification(finalTotal);

      csvContent += `"${student.fullName}","${student.matricNumber}","${assignment.application.skill.name}",${projectScore},${scaledCbtScore},${attendanceScore},${finalTotal},"${classification}"\n`;
    }

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="siwes_registry_export.csv"',
      },
    });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}