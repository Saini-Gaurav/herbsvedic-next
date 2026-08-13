import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductById, getProducts } from "@/lib/api/products";
import ProductCard from "@/components/products/ProductCard";
import ProductGallery from "./_components/ProductGallery";
import AddToCartPanel from "./_components/AddToCartPanel";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

// generateMetadata runs on the server, separately from the page itself, and lets each product page have its own <title>/description instead of every product sharing one generic title - real SEO value, and also what shows up in a browser tab / when the link is shared.
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return { title: "Product not found — Herbsvedic" };
  }

  return {
    title: `${product.name} — Herbsvedic`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    // Renders the nearest not-found.tsx (in this same folder) and sends a real HTTP 404 - not a page that just SAYS "not found" while still returning 200, which would confuse search engines into indexing a broken link as if it were a valid page.
    notFound();
  }

  // "You might also like": same category, small page size, current product filtered out client-side since the API doesn't have an "exclude this id" param and adding one just for this would be over-engineering for a 4-item strip.
  const { products: related } = await getProducts({
    categoryId: product.categoryId,
    limit: 5,
  });
  const relatedFiltered = related.filter((p) => p.id !== product.id).slice(0, 4);

  const galleryImages = [product.image, ...product.images].filter(Boolean);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-10 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        <ProductGallery images={galleryImages} alt={product.name} />

        <div className="flex flex-col gap-4">
          {product.brand && (
            <span className="text-xs uppercase tracking-wide text-canopy font-body">
              {product.brand}
            </span>
          )}
          <h1 className="font-display text-3xl md:text-4xl text-bark">{product.name}</h1>

          {product.numReviews > 0 && (
            <div className="flex items-center gap-2 text-sm font-body text-bark/60">
              <span className="text-turmeric">
                {"★".repeat(Math.round(product.rating))}
                {"☆".repeat(5 - Math.round(product.rating))}
              </span>
              <span>({product.numReviews} reviews)</span>
            </div>
          )}

          <p className="font-body text-2xl font-semibold text-bark">₹{product.price}</p>

          <p className="font-body text-bark/70 leading-relaxed">{product.description}</p>

          <AddToCartPanel product={product} />

          {(product.benefits || product.ingredients || product.usageNotes || product.precautions) && (
            <div className="mt-6 space-y-4 border-t border-bark/10 pt-6">
              {product.benefits && (
                <div>
                  <h3 className="font-body font-semibold text-bark mb-1">Benefits</h3>
                  <p className="font-body text-sm text-bark/70">{product.benefits}</p>
                </div>
              )}
              {product.ingredients && (
                <div>
                  <h3 className="font-body font-semibold text-bark mb-1">Ingredients</h3>
                  <p className="font-body text-sm text-bark/70">{product.ingredients}</p>
                </div>
              )}
              {product.usageNotes && (
                <div>
                  <h3 className="font-body font-semibold text-bark mb-1">How to Use</h3>
                  <p className="font-body text-sm text-bark/70">{product.usageNotes}</p>
                </div>
              )}
              {product.precautions && (
                <div>
                  <h3 className="font-body font-semibold text-bark mb-1">Precautions</h3>
                  <p className="font-body text-sm text-bark/70">{product.precautions}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {relatedFiltered.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl text-bark mb-6">You might also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedFiltered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}