import { Product, Category, PaginationInfo, ProductListParams } from "@/types/product";

const PRODUCT_API = process.env.NEXT_PUBLIC_PRODUCT_API_URL;

// Unlike apiClient.ts, these functions do NOT need credentials: "include" - product listing/detail/category routes are all public (no requireAuth in product-service's routes), so there's no cookie to send in the first place. This file is meant to be called from Server Components, where fetch() is Next.js's own extended version with built-in caching support (the `next: {...}` option below), not the browser's fetch.
export async function getProducts(
  params: ProductListParams = {}
): Promise<{ products: Product[]; pagination: PaginationInfo }> {
  const query = new URLSearchParams();
  if (params.categoryId) query.set("categoryId", params.categoryId);
  if (params.search) query.set("search", params.search);
  if (params.page) query.set("page", String(params.page));
  if (params.isFeatured !== undefined) {
    query.set("isFeatured", String(params.isFeatured));
  }

  const res = await fetch(`${PRODUCT_API}/products?${query.toString()}`, {
    // Cache this response for up to 60 seconds instead of hitting the database on every single visitor. See the explanation above for the trade-off this involves.
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to load products");
  }

  const data = await res.json();
  return { products: data.products, pagination: data.pagination };
}

export async function getCategories(): Promise<Category[]> {
  // Categories change far less often than products (an admin adding a new category is rare), so a longer cache window is safe here.
  const res = await fetch(`${PRODUCT_API}/categories`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error("Failed to load categories");
  }

  const data = await res.json();
  return data.categories;
}

export async function getProductById(id: string): Promise<Product | null> {
  const res = await fetch(`${PRODUCT_API}/products/${id}`, {
    next: { revalidate: 60 },
  });

  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error("Failed to load product");
  }

  const data = await res.json();
  return data.product;
}