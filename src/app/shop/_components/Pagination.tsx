import Link from "next/link";
import { PaginationInfo } from "@/types/product";

export default function Pagination({
  pagination,
  buildHref,
}: {
  pagination: PaginationInfo;
  buildHref: (page: number) => string;
}) {
  if (pagination.totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: pagination.totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-center gap-2 pt-10" aria-label="Product pages">
      {pages.map((pageNum) => (
        <Link
          key={pageNum}
          href={buildHref(pageNum)}
          className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-body border transition ${
            pageNum === pagination.page
              ? "bg-canopy text-sand border-canopy"
              : "border-bark/20 text-bark/70 hover:border-canopy hover:text-canopy"
          }`}
        >
          {pageNum}
        </Link>
      ))}
    </nav>
  );
}