"use client";

import { useActionState } from "react";
import { initializePaystackPayment } from "@/app/actions/payment";
import LoadingButton from "@/app/components/LoadingButton";

type PaymentState = {
  error?: string;
};

type PaystackPaymentButtonProps = {
  paymentId: string;
  amount: string;
};

const initialState: PaymentState = {};

export default function PaystackPaymentButton({
  paymentId,
  amount,
}: PaystackPaymentButtonProps) {
  const [state, formAction, pending] = useActionState(
    initializePaystackPayment,
    initialState,
  );

  return (
    <div className="mt-4">
      <form action={formAction}>
        <input type="hidden" name="paymentId" value={paymentId} />

        <LoadingButton
          loading={pending}
          loadingText="Connecting to Paystack..."
          className="w-full"
        >
          Pay {amount} with Paystack
        </LoadingButton>
      </form>

      {state.error && (
        <p className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}
    </div>
  );
}