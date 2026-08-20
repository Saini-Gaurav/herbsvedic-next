import { apiFetch } from "@/lib/apiClient";
import { InitiatePaymentResult, VerifyPaymentInput } from "@/types/payment";

// const PAYMENT_API = process.env.NEXT_PUBLIC_PAYMENT_API_URL;
const PAYMENT_API = process.env.NEXT_PUBLIC_API_URL;

export function initiatePayment(orderId: string): Promise<{ payment: InitiatePaymentResult }> {
  return apiFetch<{ payment: InitiatePaymentResult }>(`${PAYMENT_API}/payments/initiate`, {
    method: "POST",
    body: JSON.stringify({ orderId }),
  });
}

export function verifyPayment(
  input: VerifyPaymentInput
): Promise<{ payment: { status: string; orderId: string } }> {
  return apiFetch(`${PAYMENT_API}/payments/verify`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}