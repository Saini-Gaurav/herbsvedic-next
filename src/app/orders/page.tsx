"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getMyOrders } from "@/lib/api/orders";
import { Order } from "@/types/order";
import OrderStatusBadge from "@/components/ui/OrderStatusBadge";
import RootDivider from "@/components/ui/RootDivider";

export default function OrdersPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login");
    }
  }, [isAuthLoading, user, router]);

  useEffect(() => {
    if (!user) return;

    async function loadOrders() {
      setIsLoading(true);
      try {
        const data = await getMyOrders(page, 10);
        setOrders(data.orders);
        setTotalPages(data.pagination.totalPages);
      } catch (err) {
        console.error("Failed to load orders", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrders();
  }, [user, page]);

  if (isAuthLoading || !user) {
    return null;
  }

  return (
    <div className="bg-sand min-h-[calc(100vh-117px)]">
      <section className="max-w-4xl mx-auto px-5 md:px-8 pt-16 pb-10 md:pt-20 md:pb-14 text-center">
        <span className="inline-block mb-4 font-body text-[11px] uppercase tracking-[0.25em] text-canopy/70">
          Your Account
        </span>
        <h1 className="font-display text-4xl md:text-5xl text-bark leading-tight">My Orders</h1>
        <RootDivider className="mt-6" />
      </section>

      <section className="max-w-3xl mx-auto px-5 md:px-8 pb-20">
        {isLoading ? (
          <p className="text-center font-body text-bark/50 py-12">Loading your orders...</p>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center text-center gap-4 py-12">
            <p className="font-display text-xl text-bark">No orders yet</p>
            <p className="font-body text-sm text-bark/60">
              Once you place an order, it&apos;ll show up here.
            </p>
            <Link
              href="/shop"
              className="mt-2 px-6 py-2.5 bg-canopy text-sand font-body tracking-wide uppercase text-sm rounded-full hover:bg-ink transition"
            >
              Browse the Shop
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="block bg-white/60 border border-bark/10 rounded-2xl p-5 hover:border-canopy/40 transition"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="font-body text-xs text-bark/40 uppercase tracking-wide mb-1">
                        Order placed
                      </p>
                      <p className="font-body text-sm text-bark">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="font-body text-sm text-bark/60">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </p>
                    <p className="font-display text-lg text-bark">₹{order.totalPrice.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="font-body text-sm text-canopy disabled:text-bark/20 transition"
                >
                  ← Previous
                </button>
                <span className="font-body text-sm text-bark/50">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="font-body text-sm text-canopy disabled:text-bark/20 transition"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}