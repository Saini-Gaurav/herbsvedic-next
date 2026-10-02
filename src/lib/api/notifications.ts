import { apiFetch } from "@/lib/apiClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function registerDeviceToken(token: string): Promise<{ message: string }> {
  return apiFetch(`${API_URL}/notifications/register-device`, {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}