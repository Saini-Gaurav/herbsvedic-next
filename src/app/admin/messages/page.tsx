"use client";

import { useEffect, useState } from "react";
import { getContactMessages } from "@/lib/api/notification.api";
import { ContactMessage } from "@/types/notification";
import { FiChevronDown } from "react-icons/fi";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await getContactMessages(page, 20);
        setMessages(data.messages);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      } catch (err) {
        console.error("Failed to load messages", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [page]);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="font-display text-2xl text-bark">Contact Messages</h1>
        {!isLoading && <span className="font-body text-sm text-bark/50">{total} total</span>}
      </div>

      {isLoading ? (
        <p className="font-body text-sm text-bark/50 py-8">Loading messages...</p>
      ) : messages.length === 0 ? (
        <p className="font-body text-sm text-bark/50 py-8">No messages yet.</p>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {messages.map((msg) => {
              const isExpanded = expandedId === msg.id;
              return (
                <div key={msg.id} className="bg-white/60 border border-bark/10 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : msg.id)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <div className="min-w-0">
                      <p className="font-body text-sm text-bark font-medium truncate">{msg.subject}</p>
                      <p className="font-body text-xs text-bark/50 mt-0.5">
                        {msg.name} · {msg.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="font-body text-xs text-bark/40">
                        {new Date(msg.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                      <FiChevronDown
                        size={16}
                        className={`text-bark/40 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </div>
                  </button>

                  <div
                    className="grid transition-[grid-template-rows]"
                    style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr", transitionDuration: "250ms" }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-4 font-body text-sm text-bark/70 leading-6 whitespace-pre-wrap">
                        {msg.message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
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