"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiBox, FiMail, FiMessageSquare, FiShoppingBag, FiUsers } from "react-icons/fi";
import { getOrderStats, getUserStats, getProductCount } from "@/lib/api/admin";
import { getAllOrders } from "@/lib/api/orders";
import { getSubscribers, getContactMessages } from "@/lib/api/notification.api";
import { OrderStats, UserStats } from "@/types/admin";
import { Order } from "@/types/order";
import StatCard from "@/components/admin/StatCard";
import OrderStatusBadge from "@/components/ui/OrderStatusBadge";

interface DashboardData {
  orderStats: OrderStats | null;
  userStats: UserStats | null;
  productCount: number | null;
  subscriberCount: number | null;
  messageCount: number | null;
  recentOrders: Order[] | null;
}

const EMPTY: DashboardData = {
  orderStats: null,
  userStats: null,
  productCount: null,
  subscriberCount: null,
  messageCount: null,
  recentOrders: null,
};

const STATUS_ORDER = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

const BAR_COLORS: Record<string, string> = {
  PENDING: "bg-turmeric",
  PROCESSING: "bg-canopy",
  SHIPPED: "bg-leaf",
  DELIVERED: "bg-ink",
  CANCELLED: "bg-red-400",
  REFUNDED: "bg-bark/40",
};

function formatINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData>(EMPTY);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // allSettled so one service being down only blanks its own card
      const [orderStats, userStats, productCount, subscribers, messages, recent] =
        await Promise.allSettled([
          getOrderStats(),
          getUserStats(),
          getProductCount(),
          getSubscribers(1, 1),
          getContactMessages(1, 1),
          getAllOrders(undefined, 1, 5),
        ]);

      if (cancelled) return;

      setData({
        orderStats: orderStats.status === "fulfilled" ? orderStats.value : null,
        userStats: userStats.status === "fulfilled" ? userStats.value : null,
        productCount: productCount.status === "fulfilled" ? productCount.value : null,
        subscriberCount: subscribers.status === "fulfilled" ? subscribers.value.total : null,
        messageCount: messages.status === "fulfilled" ? messages.value.total : null,
        recentOrders: recent.status === "fulfilled" ? recent.value.orders : null,
      });
      setIsLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const { orderStats, userStats, recentOrders } = data;

  return (
    <div>
      <h1 className="font-display text-2xl text-bark mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Revenue"
          value={orderStats ? formatINR(orderStats.revenue) : null}
          hint={orderStats ? `${formatINR(orderStats.last30Days.revenue)} in the last 30 days` : undefined}
          icon={<span className="font-display text-base leading-none">₹</span>}
          isLoading={isLoading}
        />
        <StatCard
          label="Orders"
          value={orderStats ? String(orderStats.totalOrders) : null}
          hint={orderStats ? `${orderStats.last30Days.orders} in the last 30 days` : undefined}
          icon={<FiShoppingBag size={15} />}
          href="/admin/orders"
          isLoading={isLoading}
        />
        <StatCard
          label="Users"
          value={userStats ? String(userStats.total) : null}
          hint={userStats ? `${userStats.newLast30Days} joined in the last 30 days` : undefined}
          icon={<FiUsers size={15} />}
          isLoading={isLoading}
        />
        <StatCard
          label="Products"
          value={data.productCount !== null ? String(data.productCount) : null}
          icon={<FiBox size={15} />}
          href="/admin/products"
          isLoading={isLoading}
        />
        <StatCard
          label="Subscribers"
          value={data.subscriberCount !== null ? String(data.subscriberCount) : null}
          icon={<FiMail size={15} />}
          href="/admin/subscribers"
          isLoading={isLoading}
        />
        <StatCard
          label="Messages"
          value={data.messageCount !== null ? String(data.messageCount) : null}
          icon={<FiMessageSquare size={15} />}
          href="/admin/messages"
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <section className="lg:col-span-2 bg-white/60 border border-bark/10 rounded-2xl p-5">
          <h2 className="font-body font-semibold text-bark mb-4">Orders by status</h2>

          {isLoading ? (
            <div className="h-40 rounded bg-bark/10 animate-pulse" />
          ) : !orderStats ? (
            <p className="font-body text-sm text-bark/50">Couldn&apos;t load order data.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {STATUS_ORDER.map((status) => {
                const count = orderStats.byStatus[status] ?? 0;
                const pct = orderStats.totalOrders > 0 ? (count / orderStats.totalOrders) * 100 : 0;
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-body text-xs text-bark/70">{status}</span>
                      <span className="font-body text-xs text-bark">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-bark/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${BAR_COLORS[status]}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="lg:col-span-3 bg-white/60 border border-bark/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-body font-semibold text-bark">Recent orders</h2>
            <Link href="/admin/orders" className="font-body text-xs text-canopy hover:text-ink transition">
              View all →
            </Link>
          </div>

          {isLoading ? (
            <div className="h-40 rounded bg-bark/10 animate-pulse" />
          ) : !recentOrders ? (
            <p className="font-body text-sm text-bark/50">Couldn&apos;t load recent orders.</p>
          ) : recentOrders.length === 0 ? (
            <p className="font-body text-sm text-bark/50">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-bark/10">
              {recentOrders.map((order) => (
                <li key={order.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="font-body text-sm text-bark">#{order.id.slice(0, 8)}</p>
                    <p className="font-body text-xs text-bark/50">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-body text-sm text-bark">{formatINR(order.totalPrice)}</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}