"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

function getNucClassification(total: number) {
  if (total >= 70) return "First Class";
  if (total >= 60) return "Second Class Upper";
  if (total >= 50) return "Second Class Lower";
  if (total >= 45) return "Third Class";
  if (total >= 40) return "Pass";
  return "Fail";
}

function getGradeLetter(total: number) {
  if (total >= 70) return "A";
  if (total >= 60) return "B";
  if (total >= 50) return "C";
  if (total >= 45) return "D";
  if (total >= 40) return "E";
  return "F";
}

function getGradePoint(total: number) {
  if (total >= 70) return 5.0;
  if (total >= 60) return 4.0;
  if (total >= 50) return 3.0;
  if (total >= 45) return 2.0;
  if (total >= 40) return 1.0;
  return 0.0;
}

export async function reviewProject(formData: FormData) {
  const projectId = formData.get("projectId") as string;
  const feedback = formData.get("feedback") as string;
  const projectScore = Number(formData.get("score"));

  try {
    const project = await prisma.project.update({
      where: { id: projectId },
      data: { reviewed: true, feedback, score: projectScore },
      include: {
        trainingAssignment: {
          include: {
            application: { include: { student: true } },
            trainer: { include: { exam: { include: { questions: true } } } },
          },
        },
      },
    });

    const assignment = project.trainingAssignment;
    const studentUserId = assignment.application.student.userId;
    const trainerExam = assignment.trainer.exam;

    // 1. Calculate CBT Score (/30)
    let scaledCbtScore = 0;
    if (trainerExam) {
      const attempt = await prisma.examAttempt.findUnique({
        where: { examId_studentUserId: { examId: trainerExam.id, studentUserId } },
      });
      const totalQuestions = trainerExam.questions.length || 1;
      scaledCbtScore = Math.round(((attempt?.score || 0) / totalQuestions) * 30);
    }

    // 2. Calculate Dynamic Attendance Score (/10)
    const totalSessions = await prisma.classSession.count({
      where: { trainerId: assignment.trainerId }
    });
    const attendedSessions = await prisma.attendance.count({
      where: { trainingAssignmentId: assignment.id, status: "PRESENT" }
    });

    let attendanceScore = 10; // Default to 10 if trainer held 0 classes
    if (totalSessions > 0) {
      attendanceScore = Math.round((attendedSessions / totalSessions) * 10);
    }

    // 3. Finalize Totals
    const finalTotal = projectScore + scaledCbtScore + attendanceScore;

    // 4. Save to Result Database
    await prisma.result.upsert({
      where: { trainingAssignmentId: assignment.id },
      create: {
        trainingAssignmentId: assignment.id,
        projectScore,
        examScore: scaledCbtScore,
        attendanceScore,
        totalScore: finalTotal,
        grade: getGradeLetter(finalTotal),
        classification: getNucClassification(finalTotal),
        gradePoint: getGradePoint(finalTotal),
        passed: finalTotal >= 40,
      },
      update: {
        projectScore,
        examScore: scaledCbtScore,
        attendanceScore,
        totalScore: finalTotal,
        grade: getGradeLetter(finalTotal),
        classification: getNucClassification(finalTotal),
        gradePoint: getGradePoint(finalTotal),
        passed: finalTotal >= 40,
      },
    });

    revalidatePath("/dashboard/trainer");
    revalidatePath("/dashboard/results");
  } catch (error) {
    console.error(error);
  }
}