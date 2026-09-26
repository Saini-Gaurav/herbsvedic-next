"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { getAllOrders, updateOrderStatus } from "@/lib/api/orders";
import { Order } from "@/types/order";
import OrderStatusBadge from "@/components/ui/OrderStatusBadge";
import { ApiError } from "@/lib/apiClient";
import { refundPayment } from "@/lib/api/payments";

const STATUS_OPTIONS = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [refundingId, setRefundingId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await getAllOrders(statusFilter || undefined, page, 20);
        setOrders(data.orders);
        setTotalPages(data.pagination.totalPages);
      } catch (err) {
        console.error("Failed to load orders", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [statusFilter, page]);

  async function handleStatusChange(order: Order, newStatus: string) {
    try {
      const updated = await updateOrderStatus(order.id, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === order.id ? updated : o)));
      toast.success(`Order updated to ${newStatus}`);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Couldn't update order status";
      toast.error(message);
    }
  }

  async function handleRefund(order: Order) {
    if (
      !confirm(
        `Refund order #${order.id.slice(0, 8)}? This restores stock and cannot be undone.`,
      )
    ) {
      return;
    }
    setRefundingId(order.id);
    try {
      await refundPayment(order.id);
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: "REFUNDED" } : o)),
      );
      toast.success("Refund processed");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Refund failed";
      toast.error(message);
    } finally {
      setRefundingId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-bark">Orders</h1>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 rounded-lg border border-bark/20 bg-sand font-body text-sm focus:outline-none focus:border-canopy transition"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <p className="font-body text-sm text-bark/50 py-8">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="font-body text-sm text-bark/50 py-8">No orders found.</p>
      ) : (
        <>
          <div className="overflow-x-auto bg-white/60 border border-bark/10 rounded-2xl">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-bark/10">
                  <th className="px-4 py-3 font-body text-xs uppercase tracking-wide text-bark/40">
                    Order
                  </th>
                  <th className="px-4 py-3 font-body text-xs uppercase tracking-wide text-bark/40">
                    Placed
                  </th>
                  <th className="px-4 py-3 font-body text-xs uppercase tracking-wide text-bark/40">
                    Total
                  </th>
                  <th className="px-4 py-3 font-body text-xs uppercase tracking-wide text-bark/40">
                    Status
                  </th>
                  <th className="px-4 py-3 font-body text-xs uppercase tracking-wide text-bark/40">
                    Update
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-bark/5 last:border-0"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-body text-sm text-canopy hover:text-ink transition"
                      >
                        #{order.id.slice(0, 8)}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-body text-sm text-bark/60">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                    <td className="px-4 py-3 font-body text-sm text-bark">
                      ₹{order.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order, e.target.value)
                          }
                          className="px-2 py-1.5 rounded-lg border border-bark/20 bg-sand font-body text-xs focus:outline-none focus:border-canopy transition"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>

                        {order.status === "PROCESSING" && (
                          <button
                            onClick={() => handleRefund(order)}
                            disabled={refundingId === order.id}
                            className="font-body text-xs text-red-700/70 hover:text-red-700 transition disabled:opacity-50"
                          >
                            {refundingId === order.id
                              ? "Refunding..."
                              : "Refund"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
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
    </div>
  );
}
