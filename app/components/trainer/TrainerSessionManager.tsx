"use client";

import { useState, useEffect } from "react";
import { startClassSession, rotateSessionCode, endClassSession } from "@/app/actions/attendance";
import { SessionType } from "@/app/generated/prisma/client";

interface StudentAudit {
  id: string;
  fullName: string;
  matricNumber: string;
  level: number;
}

export default function TrainerSessionManager({ 
  trainerId, 
  initialSession 
}: { 
  trainerId: string, 
  initialSession?: { id: string; type: SessionType } | null 
}) {
  const [session, setSession] = useState<{ id: string; type: SessionType } | null>(initialSession || null);
  const [currentCode, setCurrentCode] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [loading, setLoading] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<{
    students: StudentAudit[];
    totalPresent: number;
  } | null>(null);

  // Sync state if a new initialSession is passed down from the server (e.g., page refresh)
  useEffect(() => {
    if (initialSession) {
      setSession(initialSession);
    }
  }, [initialSession]);

  // Rotate code every 15 seconds when a physical session is active
  useEffect(() => {
    if (!session || session.type !== "PHYSICAL") return;

    // Immediately fetch the current code on mount so we don't wait 15 seconds to see it
    rotateSessionCode(session.id, trainerId).then((res) => {
      if (res.code) setCurrentCode(res.code);
    });

    const interval = setInterval(async () => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Trigger code refresh
          rotateSessionCode(session.id, trainerId).then((res) => {
            if (res.code) setCurrentCode(res.code);
          });
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [session, trainerId]);

  const handleStart = async (type: SessionType) => {
    setLoading(true);
    setAuditResult(null);
    const res = await startClassSession(trainerId, type);
    setLoading(false);

    if (res.session) {
      setSession({ id: res.session.id, type: res.session.type });
      if (res.session.currentCode) {
        setCurrentCode(res.session.currentCode);
      }
      setTimeLeft(15);
    }
  };

  const handleEnd = async () => {
    if (!session) return;
    setLoading(true);
    const res = await endClassSession(session.id, trainerId);
    setLoading(false);

    if (res.success && res.auditList) {
      setAuditResult({
        students: res.auditList as StudentAudit[],
        totalPresent: res.totalPresent || 0,
      });
    }
    setSession(null);
    setCurrentCode("");
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Class Session & Attendance</h2>

      {!session ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Start an attendance register for students currently participating.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => handleStart("PHYSICAL")}
              disabled={loading}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50"
            >
              Start Physical Session
            </button>
            <button
              onClick={() => handleStart("VIRTUAL")}
              disabled={loading}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg disabled:opacity-50"
            >
              Start Virtual Session
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-gray-500">
                Active Session
                </span>
                <p className="text-base font-bold text-gray-800">
                {session.type} Class in Progress
                </p>
            </div>
            <button
                onClick={handleEnd}
                disabled={loading}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg"
            >
                End Session & Audit
            </button>
            </div>

          {session.type === "PHYSICAL" && (
            <div className="text-center py-6 bg-slate-900 rounded-xl text-white">
              <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">
                Projected Live Attendance Code
              </p>
              <div className="text-6xl tracking-widest my-4 select-none animate-pulse">
                {currentCode || "...."}
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                <span>Rotating in</span>
                <span className="font-mono font-bold text-amber-400">{timeLeft}s</span>
              </div>
            </div>
          )}

          {session.type === "VIRTUAL" && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-purple-900 text-sm">
              Virtual session is live. Automated pulse checks are monitoring student tabs.
            </div>
          )}
        </div>
      )}

      {/* 3-Student Spot Audit Modal / Panel */}
      {auditResult && (
        <div className="mt-6 p-5 bg-amber-50 border border-amber-300 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-amber-900 text-base">Spot Verification Audit</h3>
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-200 text-amber-900 rounded-full">
              {auditResult.totalPresent} Marked Present
            </span>
          </div>
          <p className="text-xs text-amber-800 mb-4">
            Call out these randomly selected students to verify physical presence in the room:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {auditResult.students.length > 0 ? (
              auditResult.students.map((st) => (
                <div key={st.id} className="p-3 bg-white border border-amber-200 rounded-lg shadow-sm">
                  <p className="font-bold text-sm text-gray-900">{st.fullName}</p>
                  <p className="text-xs text-gray-500">{st.matricNumber}</p>
                  <span className="text-[11px] text-gray-400">Level {st.level}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 italic">No attendees were recorded for this session.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}