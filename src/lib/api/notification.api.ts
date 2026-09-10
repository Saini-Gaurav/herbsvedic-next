import { ApiError } from "@/lib/apiClient";
import { apiFetch } from "@/lib/apiClient";
import { Subscriber, ContactMessage, NotificationPagination } from "@/types/notification";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Deliberately NOT using apiFetch here, matching product.api.ts's own
 * pattern - both newsletter/subscribe and contact are PUBLIC routes,
 * no cookie/auth concerns, so there's nothing for apiFetch's
 * credentials+401-refresh logic to actually do here. Plain fetch is
 * the right-sized tool, same reasoning as product.api.ts using it for
 * public product reads.
 *
 * Unlike product.api.ts's generic "Failed to load X" errors though,
 * THIS file reads the backend's real error message before throwing -
 * "This email is already subscribed" or a rate-limit message is
 * genuinely useful information the person submitting a form should
 * see, not something to hide behind a generic failure the way a
 * background product-list fetch error can be.
 */
async function parseErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json();
    return data.message || fallback;
  } catch {
    return fallback;
  }
}

export async function subscribeToNewsletter(email: string): Promise<void> {
  const res = await fetch(`${API_URL}/newsletter/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const message = await parseErrorMessage(res, "Failed to subscribe");
    throw new ApiError(message, res.status);
  }
}

export interface ContactFormPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function submitContactForm(data: ContactFormPayload): Promise<void> {
  const res = await fetch(`${API_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const message = await parseErrorMessage(res, "Failed to send message");
    throw new ApiError(message, res.status);
  }
}

/**
 * Unlike subscribeToNewsletter/submitContactForm above (plain fetch,
 * public routes), these two need apiFetch - both require a logged-in
 * ADMIN with a specific permission, so cookies + the 401-refresh
 * handling genuinely matter here, same split as order.api.ts vs
 * products.ts's public reads.
 */
export async function getSubscribers(
  page: number = 1,
  limit: number = 20
): Promise<{ subscribers: Subscriber[]; page: number; limit: number; total: number; totalPages: number }> {
  return apiFetch(`${API_URL}/newsletter/subscribers?page=${page}&limit=${limit}`);
}

export async function getContactMessages(
  page: number = 1,
  limit: number = 20
): Promise<{ messages: ContactMessage[]; page: number; limit: number; total: number; totalPages: number }> {
  return apiFetch(`${API_URL}/contact/messages?page=${page}&limit=${limit}`);
}