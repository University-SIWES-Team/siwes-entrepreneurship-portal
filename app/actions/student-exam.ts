"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. Fetch the live exam for the student
export async function getStudentLiveExam(trainerId: string, studentUserId: string) {
  const exam = await prisma.exam.findUnique({
    where: { trainerId },
    include: { questions: true },
  });

  if (!exam || !exam.isLive) {
    return { error: "No live exam available at the moment." };
  }

  const existingAttempt = await prisma.examAttempt.findUnique({
    where: {
      examId_studentUserId: {
        examId: exam.id,
        studentUserId,
      },
    },
  });

  if (existingAttempt?.status === "SUBMITTED" || existingAttempt?.status === "TERMINATED") {
    return { error: "You have already completed this examination." };
  }

  if (!existingAttempt) {
    await prisma.examAttempt.create({
      data: {
        examId: exam.id,
        studentUserId,
        status: "IN_PROGRESS",
      },
    });
  }

  return { exam, attempt: existingAttempt };
}

// 2. Submit the Exam & Master Auto-Grader
export async function submitExam(params: {
  examId: string;
  studentUserId: string;
  assignmentId: string;
  answers: Record<string, string>;
  tabSwitches: number;
  forced: boolean; 
}) {
  try {
    // A. Fetch Exam
    const exam = await prisma.exam.findUnique({
      where: { id: params.examId },
      include: { questions: true },
    });
    if (!exam) throw new Error("Exam not found");

    // B. Fetch Assignment (for Project Score) & Trainer (for Session counts)
    const assignment = await prisma.trainingAssignment.findUnique({
      where: { id: params.assignmentId },
      include: {
        project: true,
        trainer: {
          include: { classSessions: true }
        }
      }
    });

    // C. Calculate CBT Exam Score (Weighted to 60%)
    let correctAnswers = 0;
    exam.questions.forEach((q) => {
      if (params.answers[q.id] === q.correctAnswer) {
        correctAnswers += 1;
      }
    });
    const examPercentage = exam.questions.length > 0 
      ? (correctAnswers / exam.questions.length) * 100 
      : 0;
    const weightedExamScore = (examPercentage / 100) * 60; // Max 60 points

    // D. Calculate Project Score (Already out of 30)
    const projectScore = assignment?.project?.score || 0; 

    // E. Calculate Attendance Score (Weighted to 10%)
    let attendanceScore = 0;
    if (assignment?.trainer?.classSessions?.length) {
       const totalSessions = assignment.trainer.classSessions.length;
       const studentAttendances = await prisma.attendance.count({
         where: {
           trainingAssignmentId: params.assignmentId, // Fixed field name
           classSessionId: { in: assignment.trainer.classSessions.map(s => s.id) } // Fixed field name
         }
       });
       attendanceScore = Math.min((studentAttendances / totalSessions) * 10, 10);
    }

    // F. Final Aggregation (Out of 100)
    const totalScore = weightedExamScore + projectScore + attendanceScore;

    // G. Update Exam Attempt
    await prisma.examAttempt.update({
      where: {
        examId_studentUserId: {
          examId: params.examId,
          studentUserId: params.studentUserId,
        },
      },
      data: {
        status: params.forced ? "TERMINATED" : "SUBMITTED",
        score: correctAnswers,
        tabSwitches: params.tabSwitches,
        completedAt: new Date(),
        savedAnswers: params.answers,
      },
    });

    // H. Calculate NUC Grading Logic based on the TRUE total score
    const gradePoint = totalScore >= 70 ? 5.0 : totalScore >= 60 ? 4.0 : totalScore >= 50 ? 3.0 : totalScore >= 45 ? 2.0 : totalScore >= 40 ? 1.0 : 0.0;
    const grade = totalScore >= 70 ? "A" : totalScore >= 60 ? "B" : totalScore >= 50 ? "C" : totalScore >= 45 ? "D" : totalScore >= 40 ? "E" : "F";
    const classification = totalScore >= 70 ? "First Class" : totalScore >= 60 ? "Second Class Upper" : totalScore >= 50 ? "Second Class Lower" : totalScore >= 45 ? "Third Class" : totalScore >= 40 ? "Pass" : "Fail";

    // I. Save the Final Result
    await prisma.result.upsert({
      where: { trainingAssignmentId: params.assignmentId },
      update: {
        examScore: weightedExamScore, 
        totalScore: totalScore, 
        gradePoint,
        grade,
        classification,
        passed: totalScore >= 40,
      },
      create: {
        trainingAssignmentId: params.assignmentId,
        examScore: weightedExamScore,
        totalScore: totalScore,
        gradePoint,
        grade,
        classification,
        passed: totalScore >= 40,
      },
    });

    revalidatePath("/dashboard/student");
    revalidatePath("/dashboard/results");
    revalidatePath("/dashboard/examination");
    return { success: true, score: correctAnswers, total: exam.questions.length };
  } catch (error) {
    console.error(error);
    return { error: "Failed to submit exam. Please contact your trainer." };
  }
}