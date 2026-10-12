import { apiFetch } from "@/lib/apiClient";
import { SavedAddress, AddressInput } from "@/types/address";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function getAddresses(): Promise<{ addresses: SavedAddress[] }> {
  return apiFetch(`${API_URL}/addresses`);
}

export function createAddress(input: AddressInput): Promise<{ address: SavedAddress }> {
  return apiFetch(`${API_URL}/addresses`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function setDefaultAddress(id: string): Promise<{ message: string }> {
  return apiFetch(`${API_URL}/addresses/${id}/default`, { method: "PUT" });
}

export function deleteAddress(id: string): Promise<{ message: string }> {
  return apiFetch(`${API_URL}/addresses/${id}`, { method: "DELETE" });
}

export function updateAddress(id: string, input: AddressInput): Promise<{ address: SavedAddress }> {
  return apiFetch(`${API_URL}/addresses/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}