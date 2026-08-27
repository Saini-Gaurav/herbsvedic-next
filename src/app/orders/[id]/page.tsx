"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getOrderById } from "@/lib/api/orders";
import { Order } from "@/types/order";
import { ApiError } from "@/lib/apiClient";
import OrderStatusBadge from "@/components/ui/OrderStatusBadge";
import RootDivider from "@/components/ui/RootDivider";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login");
    }
  }, [isAuthLoading, user, router]);

  useEffect(() => {
    if (!user) return;

    async function loadOrder() {
      try {
        const data = await getOrderById(id);
        setOrder(data.order); // unwrapped here - getOrderById returns { order }
      } catch (err) {
        const message = err instanceof ApiError ? err.message : "Couldn't load this order";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrder();
  }, [user, id]);

  if (isAuthLoading || !user) return null;

  if (isLoading) {
    return <p className="text-center font-body text-bark/50 py-20">Loading order...</p>;
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-20">
        <p className="font-display text-xl text-bark">{error || "Order not found"}</p>
        <Link href="/orders" className="text-canopy font-body text-sm hover:text-ink transition">
          ← Back to my orders
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-sand min-h-[calc(100vh-117px)]">
      <section className="max-w-3xl mx-auto px-5 md:px-8 pt-14 pb-8">
        <Link href="/orders" className="font-body text-sm text-bark/50 hover:text-canopy transition">
          ← Back to my orders
        </Link>

        <div className="flex items-start justify-between gap-4 mt-6 mb-2">
          <div>
            <h1 className="font-display text-2xl md:text-3xl text-bark">Order Details</h1>
            <p className="font-body text-sm text-bark/50 mt-1">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <RootDivider className="mt-6 mb-8" />
      </section>

      <section className="max-w-3xl mx-auto px-5 md:px-8 pb-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 flex flex-col gap-4">
          <h2 className="font-body text-xs uppercase tracking-wide text-bark/40 mb-1">
            {order.items.length} Item{order.items.length !== 1 ? "s" : ""}
          </h2>
          {order.items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center justify-between bg-white/60 border border-bark/10 rounded-xl p-4"
            >
              <div>
                <p className="font-body text-sm text-bark font-medium">{item.productName}</p>
                <p className="font-body text-xs text-bark/50 mt-0.5">
                  Qty {item.quantity} × ₹{item.unitPrice.toFixed(2)}
                </p>
              </div>
              <p className="font-body text-sm text-bark">₹{item.lineTotal.toFixed(2)}</p>
            </div>
          ))}

          <div className="flex items-center justify-between border-t border-bark/10 pt-4 mt-2">
            <span className="font-body text-sm uppercase tracking-wide text-bark/60">Total</span>
            <span className="font-display text-xl text-bark">₹{order.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <div>
          <h2 className="font-body text-xs uppercase tracking-wide text-bark/40 mb-3">
            Shipping To
          </h2>
          <div className="bg-white/60 border border-bark/10 rounded-xl p-4 font-body text-sm text-bark/80 leading-6">
            <p>{order.shippingAddress1}</p>
            {order.shippingAddress2 && <p>{order.shippingAddress2}</p>}
            <p>
              {order.city}, {order.zip}
            </p>
            <p>{order.country}</p>
            <p className="mt-2 text-bark/50">{order.phone}</p>
          </div>
        </div>
      </section>
    </div>
  );
}