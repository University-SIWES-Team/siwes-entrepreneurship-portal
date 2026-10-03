"use client";

import { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/app/actions/password";
import LoadingButton from "@/app/components/LoadingButton";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = await requestPasswordReset(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#F7F9FC] lg:grid lg:grid-cols-[1.1fr_0.9fr]">
      {/* Left Sidebar Layout */}
      <section className="hidden bg-[#0F2747] px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between xl:px-16">
        <div>
          <Link href="/" className="text-xl font-bold tracking-tight transition-opacity hover:opacity-80">
            Entrepreneurship Portal
          </Link>
          <div className="mt-24 max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#D4A72C]">Account Recovery</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
              Get back into your account.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/70">
              Enter your registered email address, and we will send you secure instructions to reset your password and regain access to the portal.
            </p>
          </div>
        </div>
        <p className="text-sm text-white/45">Oduduwa University · Entrepreneurship Programme</p>
      </section>

      {/* Right Form Area */}
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
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#0F2747]">Forgot password?</h2>
              {!success && (
                <p className="mt-3 text-sm leading-6 text-[#5B6474]">
                  No worries, we'll send you reset instructions.
                </p>
              )}
            </div>

            {error && (
              <div role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
                {error}
              </div>
            )}

            {success ? (
              <div className="rounded-lg border border-green-200 bg-green-50 p-5 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="mx-auto h-12 w-12 text-green-600 mb-3">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 11.22a.75.75 0 00-1.06 1.06l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
                <h3 className="text-lg font-bold text-green-900">Check your email</h3>
                <p className="mt-2 text-sm text-green-800">
                  If an account exists for that email, we have sent a secure password reset link.
                </p>
              </div>
            ) : (
              <form action={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#172033]">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your registered email"
                    required
                    className="w-full rounded-lg border border-[#E2E8F0] px-4 py-3.5 text-sm text-[#172033] outline-none transition focus:border-[#1D5FA7] focus:ring-2 focus:ring-[#1D5FA7]/10"
                  />
                </div>

                <LoadingButton loading={loading} loadingText="Sending instructions..." className="mt-2 w-full">
                  Reset Password
                </LoadingButton>
              </form>
            )}

            <div className="mt-6 border-t border-[#E2E8F0] pt-6 text-center">
              <Link href="/login" className="text-sm font-semibold text-[#1D5FA7] transition hover:text-[#0F2747]">
                &larr; Back to log in
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}