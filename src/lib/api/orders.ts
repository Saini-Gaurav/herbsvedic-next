import { apiFetch } from "@/lib/apiClient";
import { Order, CreateOrderInput } from "@/types/order";

// const ORDER_API = process.env.NEXT_PUBLIC_ORDER_API_URL;
const ORDER_API = process.env.NEXT_PUBLIC_API_URL;

export function createOrder(input: CreateOrderInput): Promise<{ order: Order }> {
  return apiFetch<{ order: Order }>(`${ORDER_API}/orders`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getOrderById(orderId: string): Promise<{ order: Order }> {
  return apiFetch<{ order: Order }>(`${ORDER_API}/orders/${orderId}`);
}