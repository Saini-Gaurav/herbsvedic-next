"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const TABS = [
  { href: "/profile", label: "Profile" },
  { href: "/profile/addresses", label: "Addresses" },
  { href: "/orders", label: "Orders" },
];

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) return null;

  return (
    <div className="bg-sand min-h-[calc(100vh-117px)]">
      <div className="max-w-3xl mx-auto px-5 md:px-8 pt-12 pb-20">
        <span className="inline-block mb-3 font-body text-[11px] uppercase tracking-[0.25em] text-canopy/70">
          Your Account
        </span>
        <h1 className="font-display text-3xl md:text-4xl text-bark mb-6">
          Hello, {user.name.split(" ")[0]}
        </h1>

        <nav className="flex gap-6 border-b border-bark/10 mb-8">
          {TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`pb-3 font-body text-sm transition-colors border-b-2 -mb-px ${
                pathname === tab.href
                  ? "border-canopy text-canopy"
                  : "border-transparent text-bark/50 hover:text-bark"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        {children}
      </div>
    </div>
  );
}