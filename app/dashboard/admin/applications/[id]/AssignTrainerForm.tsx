"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { assignTrainer } from "@/app/actions/training";

type Trainer = {
  id: string;
  fullName: string;
  email: string;
  specialty: string;
};

type AssignTrainerFormProps = {
  applicationId: string;
  trainers: Trainer[];
  currentTrainerId?: string;
};

type FormState = {
  error?: string;
  success?: boolean;
};

export default function AssignTrainerForm({
  applicationId,
  trainers,
  currentTrainerId,
}: AssignTrainerFormProps) {
  const router = useRouter();

  const [state, formAction, pending] = useActionState(
    async (
      _previousState: FormState,
      formData: FormData,
    ): Promise<FormState> => {
      const trainerId = formData.get("trainerId");

      if (typeof trainerId !== "string" || !trainerId) {
        return { error: "Please select a trainer." };
      }

      return assignTrainer(applicationId, trainerId);
    },
    {},
  );

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [state.success, router]);

  if (trainers.length === 0) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <p className="font-medium text-amber-800">
          No trainers are available.
        </p>
        <p className="mt-1 text-sm text-amber-700">
          Add a trainer before assigning this application.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="trainerId"
          className="mb-2 block text-sm font-medium text-[#172033]"
        >
          Trainer
        </label>

        <select
          id="trainerId"
          name="trainerId"
          defaultValue={currentTrainerId ?? ""}
          required
          className="w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 text-sm outline-none focus:border-[#1D5FA7] focus:ring-2 focus:ring-[#1D5FA7]/10"
        >
          <option value="">Select a trainer</option>

          {trainers.map((trainer) => (
            <option key={trainer.id} value={trainer.id}>
              {trainer.fullName} — {trainer.specialty}
            </option>
          ))}
        </select>
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      {state.success && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          Trainer assigned successfully.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-[#1D5FA7] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#0F2747] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Assigning..." : "Assign Trainer"}
      </button>
    </form>
  );
}