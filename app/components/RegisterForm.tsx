"use client";

import { useState } from "react";
import Link from "next/link";
import { registerStudent } from "@/app/actions/auth";

export default function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = await registerStudent(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <main className="min-h-screen bg-[#F7F9FC] lg:grid lg:grid-cols-[0.9fr_1.1fr]">
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
              Student Registration
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
              Start your programme journey.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-white/70">
              Create your student account to access the SIWES and
              Entrepreneurship Programme portal and manage your journey from
              registration through completion.
            </p>

            <div className="mt-10 max-w-lg border-t border-white/10 pt-8">
              <p className="text-sm font-medium text-white/90">
                Your programme journey
              </p>

              <div className="mt-5 space-y-4">
                {[
                  "Registration and profile",
                  "Programme application and payment",
                  "Skill selection and approval",
                  "Training and project work",
                  "Examination and results",
                ].map((item, index) => (
                  <div key={item} className="flex items-center gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/20 text-xs font-semibold text-[#D4A72C]">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="text-sm text-white/75">{item}</span>
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
        <div className="w-full max-w-xl">
          <div className="mb-8 lg:hidden">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-[#0F2747]"
            >
              OUI SIWES Portal
            </Link>
          </div>

          <div className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-8">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1D5FA7]">
                Create account
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#0F2747]">
                Create your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#5B6474]">
                Enter your student details to get started with the programme
                portal.
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

            <form action={handleSubmit} className="space-y-7">
              <div>
                <div className="mb-4 border-b border-[#E2E8F0] pb-3">
                  <h3 className="text-sm font-semibold text-[#172033]">
                    Student information
                  </h3>
                  <p className="mt-1 text-xs text-[#7A8494]">
                    Use the details associated with your student record.
                  </p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="mb-2 block text-sm font-medium text-[#172033]"
                    >
                      Full name
                    </label>

                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      required
                      className="w-full rounded-lg border border-[#E2E8F0] px-4 py-3 text-sm text-[#172033] outline-none transition focus:border-[#1D5FA7] focus:ring-2 focus:ring-[#1D5FA7]/10"
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="matricNumber"
                        className="mb-2 block text-sm font-medium text-[#172033]"
                      >
                        Matric number
                      </label>

                      <input
                        id="matricNumber"
                        name="matricNumber"
                        type="text"
                        placeholder="Enter matric number"
                        required
                        className="w-full rounded-lg border border-[#E2E8F0] px-4 py-3 text-sm text-[#172033] outline-none transition focus:border-[#1D5FA7] focus:ring-2 focus:ring-[#1D5FA7]/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="level"
                        className="mb-2 block text-sm font-medium text-[#172033]"
                      >
                        Level
                      </label>

                      <input
                        id="level"
                        name="level"
                        type="number"
                        min="200"
                        max="600"
                        placeholder="e.g. 200"
                        required
                        className="w-full rounded-lg border border-[#E2E8F0] px-4 py-3 text-sm text-[#172033] outline-none transition focus:border-[#1D5FA7] focus:ring-2 focus:ring-[#1D5FA7]/10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-4 border-b border-[#E2E8F0] pb-3">
                  <h3 className="text-sm font-semibold text-[#172033]">
                    Account information
                  </h3>
                  <p className="mt-1 text-xs text-[#7A8494]">
                    These details will be used to access your portal account.
                  </p>
                </div>

                <div className="space-y-5">
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
                      className="w-full rounded-lg border border-[#E2E8F0] px-4 py-3 text-sm text-[#172033] outline-none transition focus:border-[#1D5FA7] focus:ring-2 focus:ring-[#1D5FA7]/10"
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
                      placeholder="Create a password"
                      required
                      minLength={8}
                      className="w-full rounded-lg border border-[#E2E8F0] px-4 py-3 text-sm text-[#172033] outline-none transition focus:border-[#1D5FA7] focus:ring-2 focus:ring-[#1D5FA7]/10"
                    />

                    <p className="mt-2 text-xs text-[#7A8494]">
                      Minimum 8 characters.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#1D5FA7] px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#174F8B] hover:shadow-md disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create Student Account"}
              </button>
            </form>

            <div className="mt-6 border-t border-[#E2E8F0] pt-6 text-center">
              <p className="text-sm text-[#5B6474]">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-[#1D5FA7] transition hover:text-[#0F2747]"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}