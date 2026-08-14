"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getOrderById } from "@/lib/api/orders";
import { Order } from "@/types/order";
import { ApiError } from "@/lib/apiClient";

export default function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { order } = await getOrderById(orderId);
        setOrder(order);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Couldn't load this order");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center font-body text-bark/60">
        Loading your order...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-3xl text-bark mb-3">Couldn&apos;t find that order</h1>
        <p className="font-body text-bark/60 mb-8">{error}</p>
        <Link
          href="/shop"
          className="inline-block bg-canopy text-sand font-body font-semibold px-8 py-3 rounded-full hover:bg-canopy/90 transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-full bg-canopy/10 text-canopy flex items-center justify-center mx-auto mb-4 text-3xl">
          ✓
        </div>
        <h1 className="font-display text-3xl text-bark mb-2">Order confirmed!</h1>
        <p className="font-body text-bark/60">
          Order #{order.id.slice(0, 8)} · Status: {order.status}
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-bark/10">
        <h2 className="font-body font-semibold text-bark mb-4">Order summary</h2>
        <div className="divide-y divide-bark/10">
          {order.items.map((item) => (
            <div key={item.productId} className="flex justify-between py-3 text-sm font-body">
              <span>
                {item.productName} × {item.quantity}
              </span>
              <span>₹{item.lineTotal}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between pt-4 mt-2 border-t border-bark/10 font-body font-semibold text-bark">
          <span>Total</span>
          <span>₹{order.totalPrice}</span>
        </div>

        <div className="mt-6 pt-6 border-t border-bark/10">
          <h3 className="font-body font-semibold text-sm text-bark mb-1">Shipping to</h3>
          <p className="font-body text-sm text-bark/70">
            {order.shippingAddress1}
            {order.shippingAddress2 ? `, ${order.shippingAddress2}` : ""}
            <br />
            {order.city}, {order.zip}, {order.country}
            <br />
            {order.phone}
          </p>
        </div>
      </div>

      <div className="text-center mt-8">
        <Link href="/shop" className="font-body text-canopy underline underline-offset-4">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}