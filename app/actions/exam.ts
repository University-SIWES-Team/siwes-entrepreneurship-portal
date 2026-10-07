"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. Get or create the master exam for a trainer
export async function getTrainerExam(trainerId: string) {
  let exam = await prisma.exam.findUnique({
    where: { trainerId },
    include: { questions: { orderBy: { createdAt: "desc" } } },
  });

  if (!exam) {
    exam = await prisma.exam.create({
      data: { trainerId },
      include: { questions: true },
    });
  }

  return exam;
}

// 2. Add a new question to the vault
export async function addExamQuestion(params: {
  examId: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
}) {
  try {
    await prisma.examQuestion.create({
      data: params,
    });
    revalidatePath("/dashboard/trainer");
    revalidatePath("/dashboard/trainer/exams");
    return { success: true };
  } catch (error) {
    return { error: "Failed to add question." };
  }
}

// 3. Delete a question
export async function deleteExamQuestion(questionId: string) {
  try {
    await prisma.examQuestion.delete({
      where: { id: questionId },
    });
    revalidatePath("/dashboard/trainer");
    revalidatePath("/dashboard/trainer/exams");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete question." };
  }
}

// 4. Toggle Exam Live Status with clean payload mapping
export async function toggleExamStatus(examId: string, isLive: boolean, windowMinutes?: number) {
  try {
    const updateData: any = {
      isLive,
      windowEndsAt: isLive ? new Date(Date.now() + (windowMinutes || 60) * 60000) : null,
      startedAt: isLive ? new Date() : null,
    };

    const updatedExam = await prisma.exam.update({
      where: { id: examId },
      data: updateData,
    });

    revalidatePath("/dashboard/trainer");
    revalidatePath("/dashboard/trainer/exams");
    return { success: true, exam: updatedExam };
  } catch (error: any) {
    console.error("CRITICAL EXAM TOGGLE ERROR:", error);
    return { error: `Failed to update exam status: ${error.message || "Unknown database error"}` };
  }
}

// 5. Initialize or fetch a student's exam attempt with Automatic Window Failsafe Check
export async function getStudentExamForAttempt(examId: string, studentUserId: string) {
  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    include: { questions: true },
  });

  if (!exam) {
    return { error: "Exam not found." };
  }

  // --- LAZY CHECK FAILSAFE ---
  if (exam.isLive && exam.windowEndsAt && new Date() > new Date(exam.windowEndsAt)) {
    await prisma.exam.update({
      where: { id: examId },
      data: { isLive: false, windowEndsAt: null, startedAt: null },
    });
    return { error: "This examination window has expired and is now closed." };
  }

  if (!exam.isLive) {
    return { error: "Exam is not currently live." };
  }

  let attempt = await prisma.examAttempt.findUnique({
    where: {
      examId_studentUserId: {
        examId,
        studentUserId,
      },
    },
  });

  let questionIds: string[] = [];

  if (attempt && attempt.shuffledQuestionIds) {
    questionIds = attempt.shuffledQuestionIds as string[];
  } else {
    const allQuestionIds = exam.questions.map((q) => q.id);
    for (let i = allQuestionIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allQuestionIds[i], allQuestionIds[j]] = [allQuestionIds[j], allQuestionIds[i]];
    }
    questionIds = allQuestionIds;

    attempt = await prisma.examAttempt.upsert({
      where: {
        examId_studentUserId: { examId, studentUserId },
      },
      create: {
        examId,
        studentUserId,
        status: "IN_PROGRESS",
        shuffledQuestionIds: questionIds,
      },
      update: {
        shuffledQuestionIds: questionIds,
      },
    });
  }

  const orderedQuestions = questionIds
    .map((id) => exam.questions.find((q) => q.id === id))
    .filter(Boolean);

  return {
    exam,
    attempt,
    questions: orderedQuestions,
  };
}

export async function updateExamDuration(examId: string, durationMins: number) {
  try {
    await prisma.exam.update({
      where: { id: examId },
      data: { durationMins },
    });
    revalidatePath("/dashboard/trainer");
    revalidatePath("/dashboard/trainer/exams");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update duration." };
  }
}