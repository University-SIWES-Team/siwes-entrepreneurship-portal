"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateTrainingStatus } from "@/app/actions/training";

type TrainingStatusFormProps = {
  assignmentId: string;
  currentStatus: "ASSIGNED" | "ACTIVE" | "COMPLETED";
};

type FormState = {
  error?: string;
  success?: boolean;
};

export default function TrainingStatusForm({
  assignmentId,
  currentStatus,
}: TrainingStatusFormProps) {
  const router = useRouter();

  const [state, formAction, pending] = useActionState(
    async (
      _previousState: FormState,
      formData: FormData,
    ): Promise<FormState> => {
      const status = formData.get("status");

      if (
        status !== "ASSIGNED" &&
        status !== "ACTIVE" &&
        status !== "COMPLETED"
      ) {
        return { error: "Invalid training status." };
      }

      return updateTrainingStatus(assignmentId, status);
    },
    {},
  );

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <form action={formAction} className="mt-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <select
          name="status"
          defaultValue={currentStatus}
          className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-xs text-[#172033]"
        >
          <option value="ASSIGNED">Assigned</option>
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
        </select>

        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-[#1D5FA7] px-3 py-2 text-xs font-medium text-white hover:bg-[#0F2747] disabled:opacity-60"
        >
          {pending ? "Saving..." : "Update"}
        </button>
      </div>

      {state.error && (
        <p className="mt-2 text-xs text-red-600">{state.error}</p>
      )}
    </form>
  );
}