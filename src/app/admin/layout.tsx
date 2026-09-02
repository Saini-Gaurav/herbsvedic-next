"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { FiBox } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";

const ADMIN_NAV = [
  { href: "/admin/products", label: "Products", icon: FiBox },
  // More sections (Categories, Orders, Users, Subscribers) get added here one at a time as each one is actually built - no point linking to a page that doesn't exist yet.
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    if (!user || user.roleCode !== "ADMIN") {
      router.push("/");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user || user.roleCode !== "ADMIN") {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-117px)] bg-sand grid grid-cols-1 md:grid-cols-[220px_1fr]">
      <aside className="border-b md:border-b-0 md:border-r border-bark/10 px-4 py-6">
        <p className="font-body text-[11px] uppercase tracking-[0.2em] text-bark/40 mb-4 px-2">
          Admin
        </p>
        <nav className="flex md:flex-col gap-1">
          {ADMIN_NAV.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg font-body text-sm transition ${
                  isActive ? "bg-canopy text-sand" : "text-bark/70 hover:bg-canopy/10 hover:text-canopy"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="p-5 md:p-8">{children}</main>
    </div>
  );
}