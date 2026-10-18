import Link from "next/link";
import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | null;
  hint?: string;
  icon: ReactNode;
  href?: string;
  isLoading: boolean;
}

export default function StatCard({ label, value, hint, icon, href, isLoading }: StatCardProps) {
  const body = (
    <div
      className={`h-full bg-white/60 border border-bark/10 rounded-2xl p-5 transition ${
        href ? "hover:border-canopy/40" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-body text-xs uppercase tracking-wide text-bark/50">{label}</span>
        <span className="w-8 h-8 rounded-full bg-canopy/10 text-canopy flex items-center justify-center">
          {icon}
        </span>
      </div>

      {isLoading ? (
        <div className="h-8 w-24 rounded bg-bark/10 animate-pulse" />
      ) : value === null ? (
        <p className="font-display text-2xl text-bark/30">—</p>
      ) : (
        <p className="font-display text-2xl text-bark">{value}</p>
      )}

      <p className="font-body text-xs text-bark/50 mt-1 min-h-4">
        {isLoading ? "" : value === null ? "Couldn't load" : hint}
      </p>
    </div>
  );

  return href ? (
    <Link href={href} className="block">
      {body}
    </Link>
  ) : (
    body
  );
}