"use client";

import { useState } from "react";
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
    <form action={handleSubmit} className="mx-auto max-w-md space-y-4 py-16 px-6">
      <h1 className="text-2xl font-bold">Create your account</h1>

      {error && (
        <p className="rounded bg-red-50 p-3 text-sm text-red-600">{error}</p>
      )}

      <input
        name="fullName"
        type="text"
        placeholder="Full name"
        required
        className="w-full rounded border p-3"
      />
      <input
        name="matricNumber"
        type="text"
        placeholder="Matric number"
        required
        className="w-full rounded border p-3"
      />
      <input
        name="level"
        type="number"
        placeholder="Level (e.g. 200)"
        required
        className="w-full rounded border p-3"
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        className="w-full rounded border p-3"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        minLength={8}
        className="w-full rounded border p-3"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-black py-3 text-white disabled:opacity-50"
      >
        {loading ? "Creating account..." : "Register"}
      </button>
    </form>
  );
}