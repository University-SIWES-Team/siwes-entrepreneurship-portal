"use client";

import { useState, useEffect } from "react";
import { addExamQuestion, deleteExamQuestion, toggleExamStatus, updateExamDuration } from "@/app/actions/exam";
import LoadingButton from "@/app/components/LoadingButton";

interface Question {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
}

interface Exam {
  id: string;
  title: string;
  durationMins: number;
  isLive: boolean;
  questions: Question[];
}

export default function TrainerExamManager({ exam }: { exam: Exam }) {
  const [isLive, setIsLive] = useState(exam.isLive);
  const [duration, setDuration] = useState(exam.durationMins);
  const [isUpdatingDuration, setIsUpdatingDuration] = useState(false);
  const [loading, setLoading] = useState(false);
  const [elapsedMins, setElapsedMins] = useState(0);

  // Form state
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("A");

  // Mock elapsed timer for the trainer when live
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLive) {
      interval = setInterval(() => {
        setElapsedMins((prev) => prev + 1);
      }, 60000); // Ticks every minute
    } else {
      setElapsedMins(0);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await addExamQuestion({ examId: exam.id, question, optionA, optionB, optionC, optionD, correctAnswer });
    setQuestion(""); setOptionA(""); setOptionB(""); setOptionC(""); setOptionD("");
    setLoading(false);
  };

  const handleToggleLive = async () => {
    const nextState = !isLive;
    setIsLive(nextState);
    await toggleExamStatus(exam.id, nextState);
  };

  const handleUpdateDuration = async () => {
    setIsUpdatingDuration(true);
    await updateExamDuration(exam.id, duration);
    setIsUpdatingDuration(false);
    alert(`Exam duration set to ${duration} minutes.`);
  };

  return (
    <div className="space-y-6">
      {/* Exam Status & Controls Header */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-[#0F2747]">{exam.title}</h2>
          <p className="text-sm text-[#7A8494] mt-1">Total Questions in Vault: {exam.questions.length}</p>
          
          {/* Duration Setter */}
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs font-semibold text-[#7A8494] uppercase">Duration (Mins):</span>
            <input 
              type="number" 
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              disabled={isLive}
              className="w-16 rounded border border-[#E2E8F0] px-2 py-1 text-sm text-center focus:outline-none focus:border-[#1D5FA7] disabled:bg-gray-100"
            />
            {!isLive && (
              <button 
                onClick={handleUpdateDuration} 
                disabled={isUpdatingDuration || duration === exam.durationMins}
                className="text-xs font-semibold text-[#1D5FA7] hover:underline disabled:opacity-50"
              >
                {isUpdatingDuration ? "Saving..." : "Save"}
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Trainer Active Timer Indicator */}
          {isLive && (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
              <span className="text-sm font-bold text-red-700">
                Live: {elapsedMins}m elapsed
              </span>
            </div>
          )}
          <button
            onClick={handleToggleLive}
            className={`w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-white rounded-lg transition ${isLive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
          >
            {isLive ? "Stop Exam Now" : "Start Exam Live"}
          </button>
        </div>
      </div>

      {/* Add Question Form */}
      <div className={`rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition ${isLive ? "opacity-50 pointer-events-none" : ""}`}>
        <h3 className="text-lg font-bold text-[#0F2747] mb-4">Add Question to Vault</h3>
        <form onSubmit={handleAddQuestion} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-[#7A8494] mb-1">Question Text</label>
            <textarea rows={2} value={question} onChange={(e) => setQuestion(e.target.value)} required className="w-full rounded-md border border-[#E2E8F0] px-4 py-2.5 text-sm focus:border-[#1D5FA7] focus:outline-none" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="block text-xs font-semibold uppercase text-[#7A8494] mb-1">Option A</label><input type="text" value={optionA} onChange={(e) => setOptionA(e.target.value)} required className="w-full rounded-md border border-[#E2E8F0] px-3 py-2 text-sm focus:border-[#1D5FA7] focus:outline-none" /></div>
            <div><label className="block text-xs font-semibold uppercase text-[#7A8494] mb-1">Option B</label><input type="text" value={optionB} onChange={(e) => setOptionB(e.target.value)} required className="w-full rounded-md border border-[#E2E8F0] px-3 py-2 text-sm focus:border-[#1D5FA7] focus:outline-none" /></div>
            <div><label className="block text-xs font-semibold uppercase text-[#7A8494] mb-1">Option C</label><input type="text" value={optionC} onChange={(e) => setOptionC(e.target.value)} required className="w-full rounded-md border border-[#E2E8F0] px-3 py-2 text-sm focus:border-[#1D5FA7] focus:outline-none" /></div>
            <div><label className="block text-xs font-semibold uppercase text-[#7A8494] mb-1">Option D</label><input type="text" value={optionD} onChange={(e) => setOptionD(e.target.value)} required className="w-full rounded-md border border-[#E2E8F0] px-3 py-2 text-sm focus:border-[#1D5FA7] focus:outline-none" /></div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="w-full sm:w-48">
              <label className="block text-xs font-semibold uppercase text-[#7A8494] mb-1">Correct Answer</label>
              <select value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)} className="w-full rounded-md border border-[#E2E8F0] px-3 py-2 text-sm bg-white focus:border-[#1D5FA7] focus:outline-none">
                <option value="A">Option A</option><option value="B">Option B</option><option value="C">Option C</option><option value="D">Option D</option>
              </select>
            </div>
            <div className="self-end"><LoadingButton loadingText="Adding..." className="px-6 py-2.5">Add Question</LoadingButton></div>
          </div>
        </form>
      </div>

      {/* Question List Vault */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-[#0F2747] mb-4">Question Vault ({exam.questions.length})</h3>
        {exam.questions.length === 0 ? (
          <p className="text-sm text-[#7A8494] italic">No questions added to the vault yet.</p>
        ) : (
          <div className="space-y-4">
            {exam.questions.map((q, index) => (
              <div key={q.id} className="border border-[#E2E8F0] rounded-lg p-4 bg-[#F7F9FC] space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm font-semibold text-[#172033]">{index + 1}. {q.question}</p>
                  {!isLive && (
                    <button onClick={() => deleteExamQuestion(q.id)} className="text-xs text-red-600 hover:text-red-800 font-semibold px-2 py-1 rounded bg-red-50 border border-red-200 shrink-0">Delete</button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-[#5B6474] pt-1">
                  <div className={`p-1.5 rounded ${q.correctAnswer === 'A' ? 'bg-green-100 text-green-800 font-semibold border border-green-200' : 'bg-white'}`}>A: {q.optionA}</div>
                  <div className={`p-1.5 rounded ${q.correctAnswer === 'B' ? 'bg-green-100 text-green-800 font-semibold border border-green-200' : 'bg-white'}`}>B: {q.optionB}</div>
                  <div className={`p-1.5 rounded ${q.correctAnswer === 'C' ? 'bg-green-100 text-green-800 font-semibold border border-green-200' : 'bg-white'}`}>C: {q.optionC}</div>
                  <div className={`p-1.5 rounded ${q.correctAnswer === 'D' ? 'bg-green-100 text-green-800 font-semibold border border-green-200' : 'bg-white'}`}>D: {q.optionD}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}