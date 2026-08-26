const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-turmeric/15 text-turmeric",
  PROCESSING: "bg-canopy/15 text-canopy",
  SHIPPED: "bg-leaf/20 text-canopy",
  DELIVERED: "bg-canopy text-sand",
  CANCELLED: "bg-red-100 text-red-700",
};

// Falls back to a neutral style for any status string that doesn't
// match one of the five known ones - defensive on purpose, since
// `status` is a plain string here, not a union TypeScript can
// guarantee is one of exactly five values. If the backend ever adds a
// new status later, this badge degrades gracefully instead of
// crashing on a missing key.
const DEFAULT_STYLE = "bg-bark/10 text-bark/60";

export default function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-body font-medium tracking-wide uppercase ${
        STATUS_STYLES[status] || DEFAULT_STYLE
      }`}
    >
      {status}
    </span>
  );
}