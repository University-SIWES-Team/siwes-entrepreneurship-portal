"use client";

import { useState } from "react";
import { acknowledgeVirtualPulse } from "@/app/actions/attendance";
import { getDeviceFingerprint } from "@/app/lib/fingerprint";

interface StudentPulseCheckProps {
  sessionId: string;
  studentUserId: string;
}

export default function StudentPulseCheck({ sessionId, studentUserId }: StudentPulseCheckProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handlePulse = async () => {
    setStatus("loading");
    setErrorMessage("");

    const fingerprint = getDeviceFingerprint();
    const res = await acknowledgeVirtualPulse({ sessionId, studentUserId, fingerprint });

    if (res.error) {
      setStatus("error");
      setErrorMessage(res.error);
      return;
    }

    setStatus("success");
    
    // Reset back to idle after 60 seconds so they can pulse again if the lecturer asks later
    setTimeout(() => {
      setStatus("idle");
    }, 60000); 
  };

  if (status === "success") {
    return (
      <div className="w-full py-4 bg-green-100 border border-green-300 text-green-800 rounded-lg text-center font-bold shadow-sm">
        ✅ Presence Acknowledged!
      </div>
    );
  }

  return (
    <div className="text-center w-full max-w-md mx-auto">
      <p className="text-sm text-blue-800 mb-4 font-medium">
        Virtual session is active. Please acknowledge your presence.
      </p>
      
      {errorMessage && (
        <div className="mb-3 p-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded">
          {errorMessage}
        </div>
      )}

      <button
        onClick={handlePulse}
        disabled={status === "loading"}
        className="w-full py-4 bg-purple-600 hover:bg-purple-700 active:scale-95 transition-all text-white rounded-lg font-bold shadow-md disabled:opacity-50"
      >
        {status === "loading" ? "Recording..." : "Acknowledge Pulse Check"}
      </button>
    </div>
  );
}