"use client";

import { useEffect, useState } from "react";
import { getSubscribers } from "@/lib/api/notification.api";
import { Subscriber } from "@/types/notification";

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await getSubscribers(page, 20);
        setSubscribers(data.subscribers);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      } catch (err) {
        console.error("Failed to load subscribers", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [page]);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="font-display text-2xl text-bark">Newsletter Subscribers</h1>
        {!isLoading && <span className="font-body text-sm text-bark/50">{total} total</span>}
      </div>

      {isLoading ? (
        <p className="font-body text-sm text-bark/50 py-8">Loading subscribers...</p>
      ) : subscribers.length === 0 ? (
        <p className="font-body text-sm text-bark/50 py-8">No subscribers yet.</p>
      ) : (
        <>
          <div className="overflow-x-auto bg-white/60 border border-bark/10 rounded-2xl">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-bark/10">
                  <th className="px-4 py-3 font-body text-xs uppercase tracking-wide text-bark/40">Email</th>
                  <th className="px-4 py-3 font-body text-xs uppercase tracking-wide text-bark/40">Subscribed</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="border-b border-bark/5 last:border-0">
                    <td className="px-4 py-3 font-body text-sm text-bark">{sub.email}</td>
                    <td className="px-4 py-3 font-body text-sm text-bark/60">
                      {new Date(sub.subscribedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
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