"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { resetPassword } from "@/app/actions/password";
import LoadingButton from "@/app/components/LoadingButton";
import PasswordInput from "@/app/components/PasswordInput";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = await resetPassword(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-sm text-red-600 mb-4">No reset token found in the URL.</p>
        <Link href="/forgot-password" className="font-semibold text-[#1D5FA7]">
          Request a new link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-5 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="mx-auto h-12 w-12 text-green-600 mb-3">
          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 11.22a.75.75 0 00-1.06 1.06l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
        </svg>
        <h3 className="text-lg font-bold text-green-900">Password Updated</h3>
        <p className="mt-2 text-sm text-green-800 mb-6">
          Your password has been successfully reset.
        </p>
        <Link href="/login" className="inline-block rounded-lg bg-[#0F2747] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#172033]">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      {/* Hidden input to pass the token to the server action */}
      <input type="hidden" name="token" value={token} />

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium text-[#172033]">
          New Password
        </label>
        <PasswordInput id="password" name="password" placeholder="Enter new password" required minLength={8} />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-[#172033]">
          Confirm New Password
        </label>
        <PasswordInput id="confirmPassword" name="confirmPassword" placeholder="Type new password again" required minLength={8} />
      </div>

      <LoadingButton loading={loading} loadingText="Updating..." className="mt-4 w-full">
        Save New Password
      </LoadingButton>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-[#F7F9FC] lg:grid lg:grid-cols-[1.1fr_0.9fr]">
      <section className="hidden bg-[#0F2747] px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between xl:px-16">
        <div>
          <Link href="/" className="text-xl font-bold tracking-tight transition-opacity hover:opacity-80">
            Entrepreneurship Portal
          </Link>
          <div className="mt-24 max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#D4A72C]">Account Recovery</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
              Create a new password.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/70">
              Choose a strong, secure password that you haven't used before.
            </p>
          </div>
        </div>
        <p className="text-sm text-white/45">Oduduwa University · Entrepreneurship Programme</p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link href="/" className="text-xl font-bold tracking-tight text-[#0F2747]">
              Entrepreneurship Portal
            </Link>
          </div>

          <div className="rounded-lg border border-[#E2E8F0] bg-white p-7 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-9">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1D5FA7]">Recovery</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#0F2747]">Reset password</h2>
            </div>

            <Suspense fallback={<div className="text-center text-sm text-gray-500">Loading form...</div>}>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}