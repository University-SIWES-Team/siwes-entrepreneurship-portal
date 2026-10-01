const PAYSTACK_API_URL = "https://api.paystack.co";

function getPaystackSecretKey() {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!secretKey) {
    throw new Error("PAYSTACK_SECRET_KEY is not configured.");
  }

  return secretKey;
}

export type PaystackInitializeResponse = {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
};

export type PaystackVerifyResponse = {
  status: boolean;
  message: string;
  data?: {
    status: string;
    reference: string;
    amount: number;
    currency: string;
    paid_at?: string | null;
    transaction_date?: string | null;
    gateway_response?: string | null;
  };
};

export async function initializePaystackTransaction({
  email,
  amount,
  reference,
  callbackUrl,
  metadata,
}: {
  email: string;
  amount: number;
  reference: string;
  callbackUrl: string;
  metadata: Record<string, string>;
}) {
  const response = await fetch(
    `${PAYSTACK_API_URL}/transaction/initialize`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getPaystackSecretKey()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount,
        currency: "NGN",
        reference,
        callback_url: callbackUrl,
        metadata: JSON.stringify(metadata),
      }),
      cache: "no-store",
    },
  );

  const result =
    (await response.json()) as PaystackInitializeResponse;

  if (!response.ok || !result.status || !result.data) {
    throw new Error(
      result.message || "Could not initialize Paystack transaction.",
    );
  }

  return result.data;
}

export async function verifyPaystackTransaction(reference: string) {
  const response = await fetch(
    `${PAYSTACK_API_URL}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getPaystackSecretKey()}`,
      },
      cache: "no-store",
    },
  );

  const result = (await response.json()) as PaystackVerifyResponse;

  if (!response.ok || !result.status || !result.data) {
    throw new Error(
      result.message || "Could not verify Paystack transaction.",
    );
  }

  return result.data;
}