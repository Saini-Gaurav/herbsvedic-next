import { apiFetch } from "@/lib/apiClient";
import { Profile } from "@/types/profile";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function getProfile(): Promise<{ profile: Profile }> {
  return apiFetch(`${API_URL}/auth/profile`);
}

export function updateProfile(input: {
  name: string;
  phone: string;
}): Promise<{ profile: Profile }> {
  return apiFetch(`${API_URL}/auth/profile`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}