"use client";

import Link from "next/link";
import { toast } from "react-toastify";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types/product";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (product.countInStock <= 0) {
      toast.error("Out of stock");
      return;
    }

    try {
      await addToCart(product.id, 1);
      toast.success(`${product.name} added to cart`);
    } catch {
      toast.error("Couldn't add to cart - try again");
    }
  }

  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex flex-col bg-white rounded-2xl border border-bark/10 overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="aspect-square bg-sand overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-bark/30 font-body text-sm">
            No image
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4 gap-1">
        {product.brand && (
          <span className="text-xs uppercase tracking-wide text-canopy font-body">
            {product.brand}
          </span>
        )}
        <h3 className="font-display text-lg text-bark line-clamp-2">{product.name}</h3>
        <p className="text-sm text-bark/60 font-body line-clamp-2">{product.description}</p>

        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="font-body font-semibold text-bark">₹{product.price}</span>
          <button
            onClick={handleAddToCart}
            disabled={product.countInStock <= 0}
            className="text-xs uppercase tracking-wide font-body px-4 py-2 rounded-full border border-canopy text-canopy hover:bg-canopy hover:text-sand transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-canopy"
          >
            {product.countInStock <= 0 ? "Out of stock" : "Add"}
          </button>
        </div>
      </div>
    </Link>
  );
}