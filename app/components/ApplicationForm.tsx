"use client";

import { useActionState } from "react";
import {
  submitApplication,
  type ApplicationState,
} from "@/app/actions/application";

type Skill = {
  id: string;
  name: string;
  category: string;
};

const initialState: ApplicationState = {};

export default function ApplicationForm({
  skills,
}: {
  skills: Skill[];
}) {
  const [state, formAction, isPending] = useActionState(
    submitApplication,
    initialState,
  );

  return (
    <section className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-[#172033]">
        Select your skill
      </h2>

      <p className="mt-2 text-sm leading-6 text-[#5B6474]">
        Choose the training area you want to apply for.
      </p>

      <form action={formAction} className="mt-6">
        <label
          htmlFor="skillId"
          className="block text-sm font-medium text-[#172033]"
        >
          Training skill
        </label>

        <select
          id="skillId"
          name="skillId"
          required
          disabled={isPending}
          className="mt-2 w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#172033] outline-none transition focus:border-[#1D5FA7] focus:ring-2 focus:ring-[#1D5FA7]/10 disabled:bg-[#F7F9FC]"
        >
          <option value="">Select a skill</option>

          {skills.map((skill) => (
            <option key={skill.id} value={skill.id}>
              {skill.name}
            </option>
          ))}
        </select>

        {state.error && (
          <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.error}
          </p>
        )}

        {state.success && (
          <p className="mt-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            Application submitted successfully.
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="mt-6 rounded-lg bg-[#1D5FA7] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#174F8C] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </section>
  );
}