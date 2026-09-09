"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/lib/api/products";
import { getCategories } from "@/lib/api/products";
import { Product, Category } from "@/types/product";
import { FiImage } from "react-icons/fi";
import Link from "next/link";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Categories fetched once, separately - just used to translate a raw categoryId into a readable name in the table, not re-fetched per page turn the way products are.
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((err) => console.error("Failed to load categories", err));
  }, []);

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      try {
        const data = await getProducts({ page, limit: 20 });
        setProducts(data.products);
        setTotalPages(data.pagination.totalPages);
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, [page]);

  function categoryName(categoryId: string): string {
    return categories.find((c) => c.id === categoryId)?.name || "—";
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-bark">Products</h1>
        <Link
          href="/admin/products/new"
          className="px-5 py-2 bg-canopy text-sand font-body text-sm tracking-wide uppercase rounded-full hover:bg-ink transition"
        >
          Add Product
        </Link>
      </div>

      {isLoading ? (
        <p className="font-body text-sm text-bark/50 py-8">
          Loading products...
        </p>
      ) : products.length === 0 ? (
        <p className="font-body text-sm text-bark/50 py-8">
          No products found.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto bg-white/60 border border-bark/10 rounded-2xl">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-bark/10">
                  <th className="px-4 py-3 font-body text-xs uppercase tracking-wide text-bark/40">
                    Product
                  </th>
                  <th className="px-4 py-3 font-body text-xs uppercase tracking-wide text-bark/40">
                    Category
                  </th>
                  <th className="px-4 py-3 font-body text-xs uppercase tracking-wide text-bark/40">
                    Price
                  </th>
                  <th className="px-4 py-3 font-body text-xs uppercase tracking-wide text-bark/40">
                    Stock
                  </th>
                  <th className="px-4 py-3 font-body text-xs uppercase tracking-wide text-bark/40">
                    Featured
                  </th>
                  <th className="px-4 py-3 font-body text-xs uppercase tracking-wide text-bark/40"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-bark/5 last:border-0"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover bg-canopy/10 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-canopy/10 flex items-center justify-center shrink-0">
                            <FiImage size={16} className="text-canopy/40" />
                          </div>
                        )}
                        <span className="font-body text-sm text-bark line-clamp-1">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-body text-sm text-bark/70">
                      {categoryName(product.categoryId)}
                    </td>
                    <td className="px-4 py-3 font-body text-sm text-bark">
                      ₹{product.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 font-body text-sm">
                      <span
                        className={
                          product.countInStock === 0
                            ? "text-red-700"
                            : "text-bark/70"
                        }
                      >
                        {product.countInStock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {product.isFeatured && (
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-body bg-turmeric/15 text-turmeric">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="font-body text-sm text-canopy hover:text-ink transition"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
