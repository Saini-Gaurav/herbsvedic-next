import { Product, Category, PaginationInfo, ProductListParams } from "@/types/product";
import { apiFetch } from "@/lib/apiClient"; 
import { ProductFormData } from "@/lib/validation/product.schema";

// const PRODUCT_API = process.env.NEXT_PUBLIC_PRODUCT_API_URL;
const PRODUCT_API = process.env.NEXT_PUBLIC_API_URL;

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
  if (params.minPrice !== undefined) query.set("minPrice", String(params.minPrice));
  if (params.maxPrice !== undefined) query.set("maxPrice", String(params.maxPrice));
  if (params.sortBy) query.set("sortBy", params.sortBy);
  if (params.limit) query.set("limit", String(params.limit)); 

  const res = await fetch(`${PRODUCT_API}/products?${query.toString()}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to load products");
  }

  const data = await res.json();
  return { products: data.products, pagination: data.pagination };
}

export async function getCategories(): Promise<Category[]> {
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

/**
 * Unlike the read functions in this file (plain fetch, public routes),
 * this one uses apiFetch - creating a product requires a logged-in
 * ADMIN with PRODUCT_CREATE, so cookies + the silent-401-refresh
 * behavior genuinely matter here, same reasoning as order.api.ts using
 * apiFetch throughout.
 */
export async function createProduct(data: ProductFormData): Promise<Product> {
  const payload = {
    ...data,
    images: data.image ? [data.image] : [], // backend expects an array; form only collects one URL for now
  };
  const result = await apiFetch<{ product: Product }>(`${PRODUCT_API}/products`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return result.product;
}

export async function updateProduct(id: string, data: ProductFormData): Promise<Product> {
  const payload = {
    ...data,
    images: data.image ? [data.image] : [],
  };
  const result = await apiFetch<{ product: Product }>(`${PRODUCT_API}/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return result.product;
}

export async function deleteProduct(id: string): Promise<void> {
  await apiFetch(`${PRODUCT_API}/products/${id}`, { method: "DELETE" });
}