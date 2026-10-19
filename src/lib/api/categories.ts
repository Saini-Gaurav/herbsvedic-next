import { apiFetch } from "@/lib/apiClient";
import { AdminCategory, CategoryInput } from "@/types/category";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function listCategories(): Promise<{ categories: AdminCategory[] }> {
  return apiFetch(`${API_URL}/categories`);
}

export function createCategory(input: CategoryInput): Promise<{ category: AdminCategory }> {
  return apiFetch(`${API_URL}/categories`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateCategory(id: string, input: CategoryInput): Promise<{ category: AdminCategory }> {
  return apiFetch(`${API_URL}/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function deleteCategory(id: string): Promise<{ message: string }> {
  return apiFetch(`${API_URL}/categories/${id}`, { method: "DELETE" });
}