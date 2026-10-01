"use client";

import { useFormStatus } from "react-dom";

type LoadingButtonProps = {
  children: React.ReactNode;
  loadingText: string;
  loading?: boolean;
  type?: "submit" | "button";
  className?: string;
};

function CircularLoader() {
  return (
    <svg
      className="h-4 w-4 shrink-0 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="8.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="18 36"
      />
    </svg>
  );
}

export default function LoadingButton({
  children,
  loadingText,
  loading = false,
  type = "submit",
  className = "",
}: LoadingButtonProps) {
  const { pending } = useFormStatus();
  const isLoading = loading || pending;

  return (
    <button
      type={type}
      disabled={isLoading}
      aria-busy={isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-[#1D5FA7] px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#174F8B] hover:shadow-md disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60 ${className}`}
    >
      {isLoading && <CircularLoader />}
      <span>{isLoading ? loadingText : children}</span>
    </button>
  );
}