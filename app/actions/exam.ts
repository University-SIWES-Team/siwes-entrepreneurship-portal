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
      include: { questions: true }, // <-- Fixed this line from [] to true
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
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete question." };
  }
}

// 4. Toggle Exam Live Status
export async function toggleExamStatus(examId: string, isLive: boolean) {
  try {
    await prisma.exam.update({
      where: { id: examId },
      data: { isLive },
    });
    revalidatePath("/dashboard/trainer");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update exam status." };
  }
}

export async function updateExamDuration(examId: string, durationMins: number) {
  try {
    await prisma.exam.update({
      where: { id: examId },
      data: { durationMins },
    });
    return { success: true };
  } catch (error) {
    return { error: "Failed to update duration." };
  }
}