import { ApiError } from "@/lib/apiClient";

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