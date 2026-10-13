"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  FiChevronDown,
  FiLogOut,
  FiMapPin,
  FiPackage,
  FiShield,
  FiUser,
} from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";

const itemClass =
  "flex items-center gap-3 px-4 py-2.5 font-body text-sm text-bark/80 hover:bg-canopy/5 hover:text-canopy transition";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Listeners only exist while the menu is open
  useEffect(() => {
    if (!isOpen) return;

    function handleMouseDown(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!user) return null;

  const close = () => setIsOpen(false);
  const isAdmin = user.roleCode === "ADMIN";
  const initial = user.name.charAt(0).toUpperCase();
  const firstName = user.name.split(" ")[0];

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Account menu"
        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-transparent hover:border-bark/15 hover:bg-canopy/5 transition"
      >
        <span className="w-8 h-8 rounded-full bg-canopy text-sand flex items-center justify-center font-display text-sm">
          {initial}
        </span>
        <span className="hidden xl:block max-w-24 truncate font-body text-sm text-bark">
          {firstName}
        </span>
        <FiChevronDown
          size={14}
          className={`text-bark/50 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Always mounted so the open/close can animate, same pattern as the mobile menu */}
      <div
        role="menu"
        className={`absolute right-0 top-full mt-4 w-64 bg-sand border border-bark/10 rounded-2xl shadow-xl overflow-hidden origin-top-right transition-all duration-200 ${
          isOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3 px-4 py-4 border-b border-bark/10">
          <span className="w-10 h-10 rounded-full bg-canopy text-sand flex items-center justify-center font-display text-base shrink-0">
            {initial}
          </span>
          <div className="min-w-0">
            <p className="font-body text-sm font-semibold text-bark truncate">{user.name}</p>
            <p className="font-body text-xs text-bark/50">{user.role}</p>
          </div>
        </div>

        <div className="py-1.5">
          <Link href="/profile" role="menuitem" onClick={close} className={itemClass}>
            <FiUser size={16} />
            My Profile
          </Link>
          <Link href="/orders" role="menuitem" onClick={close} className={itemClass}>
            <FiPackage size={16} />
            My Orders
          </Link>
          <Link href="/profile/addresses" role="menuitem" onClick={close} className={itemClass}>
            <FiMapPin size={16} />
            Saved Addresses
          </Link>
          {isAdmin && (
            <Link href="/admin/products" role="menuitem" onClick={close} className={itemClass}>
              <FiShield size={16} />
              Admin Panel
            </Link>
          )}
        </div>

        <div className="border-t border-bark/10 py-1.5">
          <button
            role="menuitem"
            onClick={() => {
              close();
              logout();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 font-body text-sm text-red-700/80 hover:bg-red-50 hover:text-red-700 transition"
          >
            <FiLogOut size={16} />
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}