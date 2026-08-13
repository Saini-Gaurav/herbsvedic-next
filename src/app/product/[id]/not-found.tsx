import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <h1 className="font-display text-3xl text-bark mb-3">Product not found</h1>
      <p className="font-body text-bark/60 mb-8">
        This product may have been removed, or the link is incorrect.
      </p>
      <Link
        href="/shop"
        className="inline-block bg-canopy text-sand font-body font-semibold px-8 py-3 rounded-full hover:bg-canopy/90 transition"
      >
        Back to Shop
      </Link>
    </div>
  );
}