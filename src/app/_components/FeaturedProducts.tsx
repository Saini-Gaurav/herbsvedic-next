import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import { getProducts } from "@/lib/api/products";

export default async function FeaturedProducts() {
  const { products } = await getProducts({ isFeatured: true });

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-10 py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="font-display text-3xl text-bark">Best Sellers</h2>
          <p className="font-body text-bark/60 mt-1">Our most-loved formulations</p>
        </div>
        <Link
          href="/shop"
          className="font-body text-canopy text-sm underline underline-offset-4 hidden sm:block"
        >
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.slice(0, 8).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}