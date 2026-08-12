import { getProducts, getCategories } from "@/lib/api/products";
import ProductCard from "@/components/products/ProductCard";
import CategoryFilter from "./_components/CategoryFilter";
import PriceFilter from "./_components/PriceFilter";
import SortDropdown from "./_components/SortDropdown";
import Pagination from "./_components/Pagination";
import { ProductSortBy } from "@/types/product";

interface ShopPageProps {
  searchParams: Promise<{
    categoryId?: string;
    search?: string;
    page?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const page = params.page ? Number(params.page) : 1;

  const [{ products, pagination }, categories] = await Promise.all([
    getProducts({
      categoryId: params.categoryId,
      search: params.search,
      page,
      minPrice: params.minPrice ? Number(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
      sortBy: params.sortBy as ProductSortBy | undefined,
    }),
    getCategories(),
  ]);

  function buildHref(targetPage: number): string {
    const query = new URLSearchParams();
    if (params.categoryId) query.set("categoryId", params.categoryId);
    if (params.search) query.set("search", params.search);
    if (params.minPrice) query.set("minPrice", params.minPrice);
    if (params.maxPrice) query.set("maxPrice", params.maxPrice);
    if (params.sortBy) query.set("sortBy", params.sortBy);
    if (targetPage > 1) query.set("page", String(targetPage));
    const qs = query.toString();
    return qs ? `/shop?${qs}` : "/shop";
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-12">
      <div className="mb-10">
        <h1 className="font-display text-4xl text-bark mb-2">Shop</h1>
        {params.search ? (
          <p className="text-bark/60 font-body">
            {pagination.total} result{pagination.total === 1 ? "" : "s"} for &quot;{params.search}&quot;
          </p>
        ) : (
          <p className="text-bark/60 font-body">{pagination.total} products</p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 shrink-0 space-y-8">
          <div>
            <h2 className="font-body font-semibold text-sm uppercase tracking-wide text-bark/70 mb-3">
              Category
            </h2>
            <CategoryFilter categories={categories} />
          </div>
          <div>
            <h2 className="font-body font-semibold text-sm uppercase tracking-wide text-bark/70 mb-3">
              Price
            </h2>
            <PriceFilter />
          </div>
        </aside>

        <main className="flex-1">
          <div className="flex justify-end mb-6">
            <SortDropdown />
          </div>

          {products.length === 0 ? (
            <div className="text-center py-24 text-bark/50 font-body">
              No products found. Try a different filter or search.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <Pagination pagination={pagination} buildHref={buildHref} />
        </main>
      </div>
    </div>
  );
}