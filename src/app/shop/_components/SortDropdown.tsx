"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ProductSortBy } from "@/types/product";

const SORT_OPTIONS: { value: ProductSortBy; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Rating" },
];

export default function SortDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeSort = (searchParams.get("sortBy") as ProductSortBy) || "newest";

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "newest") {
      params.delete("sortBy");
    } else {
      params.set("sortBy", value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <select
      value={activeSort}
      onChange={(e) => handleChange(e.target.value)}
      className="border border-bark/20 px-4 py-2 rounded-full text-sm font-body bg-white text-bark"
    >
      {SORT_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}