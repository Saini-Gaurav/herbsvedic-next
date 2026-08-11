"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Category } from "@/types/product";

export default function CategoryFilter({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategoryId = searchParams.get("categoryId") ?? "";

  function selectCategory(categoryId: string) {
    // Start from the CURRENT query string so an active search term isn't wiped out just because a category was also clicked.
    const params = new URLSearchParams(searchParams.toString());

    if (categoryId) {
      params.set("categoryId", categoryId);
    } else {
      params.delete("categoryId");
    }

    // Changing a filter always jumps back to page 1 - staying on "page 3" of a now much shorter filtered list would likely show nothing at all, which looks like a bug even though it isn't one.
    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => selectCategory("")}
        className={`px-4 py-2 rounded-full text-sm font-body border transition ${
          activeCategoryId === ""
            ? "bg-canopy text-sand border-canopy"
            : "border-bark/20 text-bark/70 hover:border-canopy hover:text-canopy"
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => selectCategory(category.id)}
          className={`px-4 py-2 rounded-full text-sm font-body border transition ${
            activeCategoryId === category.id
              ? "bg-canopy text-sand border-canopy"
              : "border-bark/20 text-bark/70 hover:border-canopy hover:text-canopy"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}