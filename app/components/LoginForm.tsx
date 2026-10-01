"use client";

import { useState } from "react";
import Link from "next/link";
import { loginStudent } from "@/app/actions/auth";
import LoadingButton from "@/app/components/LoadingButton";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
  setLoading(true);
  setError(null);

  const result = await loginStudent(formData);

  if (result?.error) {
    setError(result.error);
    setLoading(false);
    return;
  }

  if (result?.role === "ADMIN") {
    window.location.href = "/dashboard/admin";
    return;
  }

  if (result?.role === "TRAINER") {
    window.location.href = "/dashboard/trainer";
    return;
  }

  window.location.href = "/dashboard";
}

  return (
    <main className="min-h-screen bg-[#F7F9FC] lg:grid lg:grid-cols-[1.1fr_0.9fr]">
      <section className="hidden bg-[#0F2747] px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between xl:px-16">
        <div>
          <Link
            href="/"
            className="text-xl font-bold tracking-tight transition-opacity hover:opacity-80"
          >
            OUI SIWES Portal
          </Link>

          <div className="mt-24 max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#D4A72C]">
              Student Portal
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
              Your programme, organized in one place.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-white/70">
              Sign in to continue your SIWES and Entrepreneurship Programme
              journey and access the information relevant to your current
              stage.
            </p>

            <div className="mt-10 border-t border-white/10 pt-8">
              <p className="text-sm font-medium text-white/90">
                From registration to completion
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  "Applications",
                  "Payment",
                  "Skill selection",
                  "Training",
                  "Projects",
                  "Examinations",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-lg border border-white/10 px-4 py-3 text-sm text-white/75 transition duration-200 hover:border-white/20 hover:bg-white/5"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-white/45">
          Oduduwa University · SIWES & Entrepreneurship Programme
        </p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-[#0F2747]"
            >
              OUI SIWES Portal
            </Link>
          </div>

          <div className="rounded-lg border border-[#E2E8F0] bg-white p-7 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-9">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1D5FA7]">
                Student Portal
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#0F2747]">
                Welcome back
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#5B6474]">
                Sign in to continue managing your programme journey.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
              >
                {error}
              </div>
            )}

            <form action={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[#172033]"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  required
                  className="w-full rounded-lg border border-[#E2E8F0] px-4 py-3.5 text-sm text-[#172033] outline-none transition focus:border-[#1D5FA7] focus:ring-2 focus:ring-[#1D5FA7]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-[#172033]"
                >
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-lg border border-[#E2E8F0] px-4 py-3.5 text-sm text-[#172033] outline-none transition focus:border-[#1D5FA7] focus:ring-2 focus:ring-[#1D5FA7]/10"
                />
              </div>

              <LoadingButton
                loading={loading}
                loadingText="Signing in..."
                className="mt-2 w-full"
              >
                Log In
              </LoadingButton>
            </form>

            <div className="mt-6 border-t border-[#E2E8F0] pt-6 text-center">
              <p className="text-sm text-[#5B6474]">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-[#1D5FA7] transition hover:text-[#0F2747]"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}