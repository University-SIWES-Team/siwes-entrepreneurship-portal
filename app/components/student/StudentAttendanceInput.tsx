"use client";

import { useState } from "react";
import { submitPhysicalAttendance } from "@/app/actions/attendance";
import { getDeviceFingerprint } from "@/app/lib/fingerprint";

const EMOJI_PALETTE = ["🔴", "🔵", "🟢", "🟡", "🟣", "🟠", "⭐", "💎", "🚀", "⚡"];

interface StudentAttendanceInputProps {
  sessionId: string;
  studentUserId: string;
}

export default function StudentAttendanceInput({
  sessionId,
  studentUserId,
}: StudentAttendanceInputProps) {
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSelect = (emoji: string) => {
    if (selectedEmojis.length < 4 && status !== "submitting") {
      setSelectedEmojis((prev) => [...prev, emoji]);
    }
  };

  const handleClear = () => {
    if (status !== "submitting") {
      setSelectedEmojis([]);
      setErrorMessage("");
    }
  };

  const handleSubmit = async () => {
    if (selectedEmojis.length !== 4) {
      setErrorMessage("Select all 4 emojis shown on the screen.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    const fingerprint = getDeviceFingerprint();
    const code = selectedEmojis.join("");

    const res = await submitPhysicalAttendance({
      sessionId,
      studentUserId,
      code,
      fingerprint,
    });

    if (res.error) {
      setStatus("error");
      setErrorMessage(res.error);
      setSelectedEmojis([]);
      return;
    }

    setStatus("success");
  };

  if (status === "success") {
    return (
      <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center">
        <span className="text-4xl block mb-2">✅</span>
        <h3 className="text-lg font-bold text-green-900">Attendance Recorded</h3>
        <p className="text-sm text-green-700 mt-1">
          Your attendance has been verified for this session.
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm max-w-md mx-auto">
      <h3 className="text-base font-bold text-gray-900 text-center mb-1">
        Tap the 4 Emojis on the Board
      </h3>
      <p className="text-xs text-gray-500 text-center mb-4">
        Enter the current sequence before the timer rotates.
      </p>

      {/* Input Display Box */}
      <div className="flex justify-center items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg min-h-14 mb-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="w-10 h-10 rounded-md border border-gray-300 bg-white flex items-center justify-center text-2xl shadow-inner select-none"
          >
            {selectedEmojis[idx] || ""}
          </div>
        ))}
      </div>

      {errorMessage && (
        <div className="mb-4 p-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded text-center">
          {errorMessage}
        </div>
      )}

      {/* Keypad */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {EMOJI_PALETTE.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => handleSelect(emoji)}
            disabled={selectedEmojis.length >= 4 || status === "submitting"}
            className="h-12 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-lg text-2xl flex items-center justify-center transition-colors disabled:opacity-40"
          >
            {emoji}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleClear}
          disabled={selectedEmojis.length === 0 || status === "submitting"}
          className="flex-1 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-40"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={selectedEmojis.length !== 4 || status === "submitting"}
          className="flex-1 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-40"
        >
          {status === "submitting" ? "Checking..." : "Submit"}
        </button>
      </div>
    </div>
  );
}