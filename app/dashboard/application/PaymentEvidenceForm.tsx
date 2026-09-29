"use client";

import { useActionState, useState, type FormEvent } from "react";
import { submitPaymentEvidence } from "@/app/actions/payment";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

type PaymentEvidenceFormProps = {
  paymentId: string;
  paymentName: string;
};

export default function PaymentEvidenceForm({
  paymentId,
  paymentName,
}: PaymentEvidenceFormProps) {
  const [state, formAction, pending] = useActionState(
    submitPaymentEvidence,
    {},
  );
  const [fileError, setFileError] = useState("");

  if (state.success) {
    return (
      <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <p className="font-medium text-amber-800">
          Payment evidence submitted successfully.
        </p>
        <p className="mt-1 text-sm text-amber-700">
          Your payment is now awaiting administrator review.
        </p>
      </div>
    );
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    const fileInput = form.elements.namedItem(
      "evidence",
    ) as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (file && file.size > MAX_FILE_SIZE) {
      event.preventDefault();
      setFileError("File size must be 5MB or less.");
      return;
    }

    setFileError("");
  };

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      className="mt-4 space-y-4"
    >
      <input type="hidden" name="paymentId" value={paymentId} />

      <div>
        <label
          htmlFor={`reference-${paymentId}`}
          className="mb-1 block text-sm font-medium text-[#172033]"
        >
          Payment Reference
        </label>

        <input
          id={`reference-${paymentId}`}
          name="manualReference"
          type="text"
          required
          placeholder="Enter your payment reference"
          className="w-full rounded-lg border border-[#E2E8F0] px-4 py-3 text-sm outline-none transition focus:border-[#1D5FA7] focus:ring-2 focus:ring-[#1D5FA7]/10"
        />
      </div>

      <div>
        <label
          htmlFor={`date-${paymentId}`}
          className="mb-1 block text-sm font-medium text-[#172033]"
        >
          Payment Date
        </label>

        <input
          id={`date-${paymentId}`}
          name="paymentDate"
          type="date"
          required
          className="w-full rounded-lg border border-[#E2E8F0] px-4 py-3 text-sm outline-none transition focus:border-[#1D5FA7] focus:ring-2 focus:ring-[#1D5FA7]/10"
        />
      </div>

      <div>
        <label
          htmlFor={`evidence-${paymentId}`}
          className="mb-1 block text-sm font-medium text-[#172033]"
        >
          Payment Receipt
        </label>

        <input
          id={`evidence-${paymentId}`}
          name="evidence"
          type="file"
          required
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          className="block w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-3 text-sm"
        />

        <p className="mt-1 text-xs text-[#7A8494]">
          {paymentName}: PDF, JPG or PNG. Maximum 5MB.
        </p>
      </div>

      {(fileError || state.error) && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {fileError || state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-[#1D5FA7] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#0F2747] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Submitting..." : "Submit Payment Evidence"}
      </button>
    </form>
  );
}

