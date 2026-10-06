"use client";

import { useState } from "react";
import StudentCBTEngine from "./StudentCBTEngine";

interface ExamGatewayProps {
  exam: any;
  studentUserId: string;
  assignmentId: string;
}

export default function ExamGateway({ exam, studentUserId, assignmentId }: ExamGatewayProps) {
  const [hasStarted, setHasStarted] = useState(false);

  if (!hasStarted) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-blue-900">Examination is LIVE</h2>
          <p className="text-sm text-blue-800 mt-2">
            Your instructor has opened the final exam portal. The timer will <strong>not</strong> start until you click the begin button below.
          </p>
        </div>
        
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-8 shadow-sm">
          <h3 className="text-lg font-bold text-[#0F2747] mb-4">Examination Rules & Guidelines</h3>
          <ul className="list-disc pl-5 space-y-3 text-sm text-[#5B6474] mb-8">
            <li><strong>Duration:</strong> The exam will strictly last for {exam.duration || 45} minutes.</li>
            <li><strong>Tab Switching:</strong> This is a proctored CBT. Switching browser tabs will be recorded and may terminate your exam.</li>
            <li><strong>Auto-Submission:</strong> When the timer hits 0:00, your current answers will be submitted automatically.</li>
            <li><strong>Stable Connection:</strong> Ensure you have a stable internet connection before proceeding.</li>
          </ul>

          <button 
            onClick={() => setHasStarted(true)} 
            className="w-full rounded-lg bg-[#1D5FA7] px-4 py-3 font-semibold text-white transition hover:bg-[#15467e]"
          >
            I Understand, Begin Exam Now
          </button>
        </div>
      </div>
    );
  }

  // Once they click start, render the actual exam engine (which starts your timer)
  return (
    <StudentCBTEngine 
      exam={exam} 
      studentUserId={studentUserId} 
      assignmentId={assignmentId} 
    />
  );
}