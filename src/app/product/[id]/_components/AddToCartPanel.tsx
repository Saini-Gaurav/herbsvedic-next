"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types/product";

export default function AddToCartPanel({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const outOfStock = product.countInStock <= 0;

  function decrement() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  function increment() {
    // Never let the stepper go past what's actually in stock - catching
    // this here gives instant feedback, rather than only finding out
    // "sorry, only 3 left" after clicking Add to Cart.
    setQuantity((q) => Math.min(product.countInStock, q + 1));
  }

  async function handleAddToCart() {
    if (outOfStock) return;
    setIsAdding(true);
    try {
      await addToCart(product.id, quantity);
      toast.success(`${quantity} × ${product.name} added to cart`);
    } catch {
      toast.error("Couldn't add to cart - try again");
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 pt-2">
      <p className={`text-sm font-body ${outOfStock ? "text-red-600" : "text-canopy"}`}>
        {outOfStock ? "Out of stock" : `${product.countInStock} in stock`}
      </p>

      <div className="flex items-center gap-4">
        <div className="flex items-center border border-bark/20 rounded-full">
          <button
            onClick={decrement}
            disabled={outOfStock || quantity <= 1}
            className="w-10 h-10 flex items-center justify-center text-bark disabled:opacity-30"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-8 text-center font-body">{quantity}</span>
          <button
            onClick={increment}
            disabled={outOfStock || quantity >= product.countInStock}
            className="w-10 h-10 flex items-center justify-center text-bark disabled:opacity-30"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={outOfStock || isAdding}
          className="flex-1 bg-canopy text-sand font-body font-semibold py-3 rounded-full hover:bg-canopy/90 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {outOfStock ? "Out of Stock" : isAdding ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}