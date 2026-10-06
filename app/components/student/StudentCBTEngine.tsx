"use client";

import { useState, useEffect, useCallback } from "react";
import { submitExam } from "@/app/actions/student-exam";

interface Question {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
}

interface ExamProps {
  id: string;
  title: string;
  durationMins: number;
  questions: Question[];
}

export default function StudentCBTEngine({
  exam,
  studentUserId,
  assignmentId,
}: {
  exam: ExamProps;
  studentUserId: string;
  assignmentId: string;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(exam.durationMins * 60);
  const [strikes, setStrikes] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [examResult, setExamResult] = useState<{ score: number; total: number } | null>(null);

  const STORAGE_KEY = `siwes_exam_${exam.id}_${studentUserId}`;
  const MAX_STRIKES = 3;

  // 1. Initialize local storage answers
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setAnswers(JSON.parse(saved));
    }
  }, [STORAGE_KEY]);

  // 2. The Auto-Submit Function
  const finalizeExam = useCallback(async (forced: boolean = false, currentStrikes: number = strikes) => {
    if (isSubmitting || examResult) return;
    setIsSubmitting(true);

    const res = await submitExam({
      examId: exam.id,
      studentUserId,
      assignmentId,
      answers,
      tabSwitches: currentStrikes,
      forced,
    });

    if (res.success) {
      localStorage.removeItem(STORAGE_KEY);
      setExamResult({ score: res.score!, total: res.total! });
    } else {
      alert(res.error);
      setIsSubmitting(false);
    }
  }, [answers, assignmentId, exam.id, examResult, isSubmitting, strikes, studentUserId, STORAGE_KEY]);

  // 3. Anti-Cheat: Tab Switching Monitor
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !examResult) {
        setStrikes((prev) => {
          const newStrikes = prev + 1;
          if (newStrikes >= MAX_STRIKES) {
            alert("SECURITY VIOLATION: You left the exam tab too many times. Your exam has been automatically submitted.");
            finalizeExam(true, newStrikes);
          } else {
            alert(`WARNING: You left the exam tab! Strike ${newStrikes} of ${MAX_STRIKES}. Your exam will be submitted automatically on the 3rd strike.`);
          }
          return newStrikes;
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [examResult, finalizeExam]);

  // 4. Countdown Timer
  useEffect(() => {
    if (examResult || isSubmitting) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finalizeExam(true); // Time's up, force submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examResult, isSubmitting, finalizeExam]);

  // Handle Answer Selection
  const handleSelect = (questionId: string, option: string) => {
    const newAnswers = { ...answers, [questionId]: option };
    setAnswers(newAnswers);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newAnswers)); // Save to local storage instantly
  };

  // Format Timer
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // UI: If exam is finished
  if (examResult) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-green-900 mb-2">Examination Submitted</h2>
        <p className="text-green-800">Your answers have been securely recorded and auto-graded.</p>
        <p className="mt-4 text-sm text-green-700">You scored {examResult.score} out of {examResult.total}. Your final NUC grade is processing.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
      {/* Sticky Header with Timer & Anti-Cheat */}
      <div className="sticky top-16 z-10 bg-white border-b border-[#E2E8F0] p-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
        <div>
          <h2 className="font-bold text-[#0F2747]">{exam.title}</h2>
          <p className="text-xs text-[#7A8494]">Answered: {Object.keys(answers).length} of {exam.questions.length}</p>
        </div>
        
        <div className="flex items-center gap-4">
          {strikes > 0 && (
            <span className="animate-pulse rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700 border border-red-200">
              Strikes: {strikes}/{MAX_STRIKES}
            </span>
          )}
          <div className="flex items-center gap-2 rounded-lg bg-[#0F2747] px-4 py-2 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#3b82f6]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="font-mono text-xl font-bold tracking-wider">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Question List */}
      <div className="p-4 sm:p-6 space-y-8">
        {exam.questions.map((q, index) => (
          <div key={q.id} className="p-4 rounded-lg bg-[#F7F9FC] border border-[#E2E8F0]">
            <p className="font-semibold text-[#172033] mb-4 text-lg">
              {index + 1}. {q.question}
            </p>
            <div className="space-y-3">
              {['A', 'B', 'C', 'D'].map((opt) => {
                const optionText = q[`option${opt}` as keyof Question] as string;
                const isSelected = answers[q.id] === opt;
                return (
                  <label 
                    key={opt} 
                    className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors
                      ${isSelected ? 'bg-blue-50 border-[#1D5FA7]' : 'bg-white border-[#E2E8F0] hover:bg-gray-50'}`}
                  >
                    <input
                      type="radio"
                      name={`question_${q.id}`}
                      value={opt}
                      checked={isSelected}
                      onChange={() => handleSelect(q.id, opt)}
                      className="h-4 w-4 text-[#1D5FA7] focus:ring-[#1D5FA7]"
                    />
                    <span className="text-sm font-medium text-[#172033]">
                      <span className="mr-2 font-bold text-[#7A8494]">{opt}.</span> {optionText}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        <div className="pt-6 border-t border-[#E2E8F0] flex justify-end">
          <button 
            type="button"
            disabled={isSubmitting}
            onClick={() => {
              if (confirm("Are you sure you want to submit your final answers?")) {
                finalizeExam(false);
              }
            }} 
            className={`px-8 py-3 text-lg font-semibold text-white rounded-lg transition ${
              isSubmitting 
                ? "bg-[#7A8494] cursor-not-allowed" 
                : "bg-[#1D5FA7] hover:bg-[#15467e]"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Final Examination"}
          </button>
        </div>
      </div>
    </div>
  );
}