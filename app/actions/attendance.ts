"use server";

import { prisma } from "@/app/lib/prisma";
import { AttendanceStatus, SessionType } from "@/app/generated/prisma/client";
import { revalidatePath } from "next/cache";

const EMOJI_PALETTE = ["🔴", "🔵", "🟢", "🟡", "🟣", "🟠", "⭐", "💎", "🚀", "⚡"];

function generateEmojiCode(): string {
  const shuffled = [...EMOJI_PALETTE].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 4).join("");
}

// 1. Trainer starts a new class session
export async function startClassSession(trainerId: string, type: SessionType) {
  try {
    // End any previously active session for this trainer
    await prisma.classSession.updateMany({
      where: { trainerId, isActive: true },
      data: { isActive: false, endedAt: new Date() },
    });

    const initialCode = type === "PHYSICAL" ? generateEmojiCode() : null;
    const expiresAt = type === "PHYSICAL" ? new Date(Date.now() + 20 * 1000) : null; // 15s + 5s network buffer

    const session = await prisma.classSession.create({
      data: {
        trainerId,
        type,
        isActive: true,
        currentCode: initialCode,
        codeExpiresAt: expiresAt,
      },
    });

    revalidatePath("/dashboard/trainer");
    return { session };
  } catch (error) {
    console.error("Failed to start session:", error);
    return { error: "Unable to start session." };
  }
}

// 2. Trainer screen calls this every 15s to rotate the code
export async function rotateSessionCode(sessionId: string, trainerId: string) {
  try {
    const session = await prisma.classSession.findFirst({
      where: { id: sessionId, trainerId, isActive: true },
    });

    if (!session) return { error: "Session not active." };

    const newCode = generateEmojiCode();
    const expiresAt = new Date(Date.now() + 20 * 1000);

    const updated = await prisma.classSession.update({
      where: { id: sessionId },
      data: {
        currentCode: newCode,
        codeExpiresAt: expiresAt,
      },
      select: { currentCode: true, codeExpiresAt: true },
    });

    return { code: updated.currentCode };
  } catch (error) {
    return { error: "Failed to rotate code." };
  }
}

// 3. Student submits code with browser device fingerprint
export async function submitPhysicalAttendance(params: {
  sessionId: string;
  studentUserId: string;
  code: string;
  fingerprint: string;
}) {
  const { sessionId, studentUserId, code, fingerprint } = params;

  if (!sessionId || !code || !fingerprint) {
    return { error: "Missing required attendance data." };
  }

  const session = await prisma.classSession.findUnique({
    where: { id: sessionId },
  });

  if (!session || !session.isActive) {
    return { error: "Attendance session has ended or is invalid." };
  }

  // Verify code expiration
  if (session.codeExpiresAt && new Date() > session.codeExpiresAt) {
    return { error: "Code expired. Look up at the board for the new code." };
  }

  // Verify emoji sequence
  if (session.currentCode !== code) {
    return { error: "Incorrect code sequence. Try again." };
  }

  // Find student's active assignment
  const assignment = await prisma.trainingAssignment.findFirst({
    where: {
      trainerId: session.trainerId,
      application: {
        student: { userId: studentUserId },
      },
    },
  });

  if (!assignment) {
    return { error: "You are not assigned to this trainer's course." };
  }

  try {
    await prisma.attendance.create({
      data: {
        classSessionId: sessionId,
        trainingAssignmentId: assignment.id,
        status: AttendanceStatus.PRESENT,
        deviceFingerprint: fingerprint,
      },
    });

    revalidatePath("/dashboard/student");
    return { success: true };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { error: "You have already marked attendance for this session." };
    }
    return { error: "Failed to submit attendance." };
  }
}

// 4. Trainer ends session and gets 3 random students for spot audit
export async function endClassSession(sessionId: string, trainerId: string) {
  try {
    await prisma.classSession.update({
      where: { id: sessionId },
      data: { isActive: false, endedAt: new Date() },
    });

    // Fetch present students to pick 3 random names for audit
    const attendees = await prisma.attendance.findMany({
      where: { classSessionId: sessionId, status: AttendanceStatus.PRESENT },
      include: {
        assignment: {
          include: {
            application: {
              include: {
                student: true,
              },
            },
          },
        },
      },
    });

    const students = attendees.map((a) => a.assignment.application.student);
    const shuffled = [...students].sort(() => 0.5 - Math.random());
    const auditList = shuffled.slice(0, 3);

    revalidatePath("/dashboard/trainer");
    return { success: true, auditList, totalPresent: students.length };
  } catch (error) {
    return { error: "Failed to close session." };
  }
}

export async function getActiveSessionForStudent(studentUserId: string) {
  try {
    const session = await prisma.classSession.findFirst({
      where: {
        isActive: true,
        trainer: {
          assignments: {
            some: {
              application: { student: { userId: studentUserId } },
            },
          },
        },
      },
      select: { id: true, type: true },
    });
    return session;
  } catch (error) {
    return null;
  }
}

export async function acknowledgeVirtualPulse(params: {
  sessionId: string;
  studentUserId: string;
  fingerprint: string;
}) {
  const { sessionId, studentUserId, fingerprint } = params;

  if (!sessionId || !fingerprint) return { error: "Missing data." };

  const session = await prisma.classSession.findUnique({ where: { id: sessionId } });
  if (!session || !session.isActive || session.type !== "VIRTUAL") {
    return { error: "Virtual session is no longer active." };
  }

  const assignment = await prisma.trainingAssignment.findFirst({
    where: {
      trainerId: session.trainerId,
      application: { student: { userId: studentUserId } },
    },
  });

  if (!assignment) return { error: "You are not assigned to this trainer." };

  try {
    const existingAttendance = await prisma.attendance.findUnique({
      where: {
        trainingAssignmentId_classSessionId: {
          trainingAssignmentId: assignment.id,
          classSessionId: sessionId,
        }
      }
    });

    if (existingAttendance) {
      await prisma.attendance.update({
        where: { id: existingAttendance.id },
        data: { pulseChecksPassed: (existingAttendance.pulseChecksPassed || 0) + 1 }
      });
    } else {
      await prisma.attendance.create({
        data: {
          classSessionId: sessionId,
          trainingAssignmentId: assignment.id,
          status: AttendanceStatus.PRESENT,
          deviceFingerprint: fingerprint,
          pulseChecksPassed: 1,
        }
      });
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { error: "Failed to acknowledge presence." };
  }
}