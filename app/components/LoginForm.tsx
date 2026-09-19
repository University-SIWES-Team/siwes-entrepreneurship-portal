"use client";

import { useState } from "react";
import { loginStudent } from "@/app/actions/auth";

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

    window.location.href = "/dashboard";
  }

  return (
    <form action={handleSubmit} className="mx-auto max-w-md space-y-4 py-16 px-6">
      <h1 className="text-2xl font-bold">Log in</h1>

      {error && (
        <p className="rounded bg-red-50 p-3 text-sm text-red-600">{error}</p>
      )}

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
        className="w-full rounded border p-3"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-black py-3 text-white disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Log in"}
      </button>
    </form>
  );
}