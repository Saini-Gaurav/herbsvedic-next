import { getProducts, getCategories } from "@/lib/api/products";
import ProductCard from "@/components/products/ProductCard";
import CategoryFilter from "@/components/products/CategoryFilter";
import Pagination from "@/components/products/Pagination";

// Next.js 15+ passes searchParams into a Server Component page as a Promise (so the framework can start work that doesn't depend on the URL before the URL itself is fully known) - it has to be awaited before reading anything off it.
interface ShopPageProps {
  searchParams: Promise<{ categoryId?: string; search?: string; page?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const page = params.page ? Number(params.page) : 1;

  // Both requests fire at the same time - they don't depend on each
  // other's results, so there's no reason to make the shopper wait for
  // them one after another.
  const [{ products, pagination }, categories] = await Promise.all([
    getProducts({ categoryId: params.categoryId, search: params.search, page }),
    getCategories(),
  ]);

  // Builds a /shop?... link for a given page number, carrying forward
  // whatever category/search filters are currently active - so paging
  // through page 2 of a filtered search doesn't silently drop the filter.
  function buildHref(targetPage: number): string {
    const query = new URLSearchParams();
    if (params.categoryId) query.set("categoryId", params.categoryId);
    if (params.search) query.set("search", params.search);
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

      <div className="mb-8">
        <CategoryFilter categories={categories} />
      </div>

      {products.length === 0 ? (
        <div className="text-center py-24 text-bark/50 font-body">
          No products found. Try a different filter or search.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <Pagination pagination={pagination} buildHref={buildHref} />
    </div>
  );
}