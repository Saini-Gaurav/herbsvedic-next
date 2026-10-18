import { apiFetch } from "@/lib/apiClient";
import { OrderStats, UserStats } from "@/types/admin";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getOrderStats(): Promise<OrderStats> {
  const data = await apiFetch<{ stats: OrderStats }>(`${API_URL}/orders/stats`);
  return data.stats;
}

export async function getUserStats(): Promise<UserStats> {
  const data = await apiFetch<{ stats: UserStats }>(`${API_URL}/auth/admin/stats`);
  return data.stats;
}

// limit=1 because only the total matters here
export async function getProductCount(): Promise<number> {
  const data = await apiFetch<{ pagination: { total: number } }>(`${API_URL}/products?limit=1`);
  return data.pagination.total;
}