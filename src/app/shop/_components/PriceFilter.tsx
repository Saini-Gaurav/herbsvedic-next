"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const MAX_PRICE = 3000;

export default function PriceFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlMaxPrice = searchParams.get("maxPrice");
  const [priceLimit, setPriceLimit] = useState(
    urlMaxPrice ? Number(urlMaxPrice) : MAX_PRICE
  );

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (priceLimit < MAX_PRICE) {
        params.set("maxPrice", String(priceLimit));
      } else {
        params.delete("maxPrice");
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceLimit]);

  return (
    <div className="space-y-2">
      <input
        type="range"
        min={0}
        max={MAX_PRICE}
        step={50}
        value={priceLimit}
        onChange={(e) => setPriceLimit(Number(e.target.value))}
        className="w-full accent-canopy"
      />
      <div className="flex justify-between text-xs text-bark/60 font-body">
        <span>₹0</span>
        <span>₹{priceLimit}{priceLimit === MAX_PRICE ? "+" : ""}</span>
      </div>
    </div>
  );
}