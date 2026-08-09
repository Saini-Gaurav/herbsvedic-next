"use client";

import { useEffect } from "react";
import Link from "next/link";
import { FiX, FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import { useCart } from "@/context/CartContext";
import RootDivider from "@/components/ui/RootDivider";

export default function CartSidebar() {
  const { cart, isCartOpen, closeCart, isLoading, updateQuantity, removeFromCart } = useCart();

  // Locks background scrolling while the sidebar is open - same behavior as before, just cleaned up into one effect instead of two separate ones doing overlapping work.
  useEffect(() => {
    document.body.style.overflow = isCartOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  async function handleRemove(productId: string, name: string) {
    try {
      await removeFromCart(productId);
      toast.success(`${name} removed from cart`);
    } catch {
      toast.error("Couldn't remove item - try again");
    }
  }

  async function handleQuantityChange(productId: string, newQuantity: number) {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(productId, newQuantity);
    } catch {
      toast.error("Couldn't update quantity - try again");
    }
  }

  return (
    <>
      {/* Dimmed backdrop - clicking it closes the cart, same as clicking outside a dropdown */}
      <div
        className={`fixed inset-0 bg-ink/40 z-9998 transition-opacity duration-300 ${
          isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
      />

      {/* The panel itself - always in the DOM, just slid off-screen when
          closed via translate-x-full. This is smoother than
          mounting/unmounting the whole thing every time, and it means
          the slide animation actually has something to animate. */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-105 bg-sand z-9999 shadow-2xl transition-transform duration-300 flex flex-col ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-bark/10">
          <h2 className="font-display text-2xl text-bark">Your Basket</h2>
          <button onClick={closeCart} aria-label="Close cart" className="text-bark/60 hover:text-bark transition">
            <FiX size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-bark/50 font-body">Loading...</div>
          ) : cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3">
              <p className="font-display text-lg text-bark">Your basket is empty</p>
              <p className="text-sm text-bark/60 font-body">Add something from the shop to see it here.</p>
              <RootDivider />
              <Link
                href="/shop"
                onClick={closeCart}
                className="mt-2 px-5 py-2 bg-canopy text-sand text-sm font-body tracking-wide uppercase rounded-full hover:bg-ink transition"
              >
                Browse the shop
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col gap-5">
              {cart.items.map((item) => (
                <li key={item.productId} className="flex gap-4">
                  {item.product ? (
                    <>
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-20 rounded-lg object-cover bg-canopy/10"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start gap-2">
                          <p className="font-body font-medium text-bark text-sm leading-snug">{item.product.name}</p>
                          <button
                            onClick={() => handleRemove(item.productId, item.product!.name)}
                            className="text-bark/40 hover:text-red-700 transition shrink-0"
                            aria-label={`Remove ${item.product.name}`}
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-bark/20 rounded-full">
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                              className="px-2.5 py-1 text-bark/70 hover:text-bark"
                              aria-label="Decrease quantity"
                            >
                              <FiMinus size={12} />
                            </button>
                            <span className="px-2 text-sm font-body text-bark w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                              className="px-2.5 py-1 text-bark/70 hover:text-bark"
                              aria-label="Increase quantity"
                              disabled={item.quantity >= item.product.countInStock}
                            >
                              <FiPlus size={12} />
                            </button>
                          </div>
                          <span className="font-body text-sm text-bark">₹{item.lineTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    // product came back null - it existed when added but has since been deleted from the catalog. Still showing the row, but honestly, not pretending it's fine.
                    <div className="flex-1 flex items-center justify-between text-sm text-bark/50 italic">
                      <span>This product is no longer available</span>
                      <button onClick={() => handleRemove(item.productId, "this item")} className="text-red-700 not-italic text-xs underline">
                        Remove
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart.items.length > 0 && (
          <div className="border-t border-bark/10 px-6 py-5">
            <div className="flex justify-between items-baseline mb-4">
              <span className="font-body text-sm uppercase tracking-wide text-bark/60">Subtotal</span>
              <span className="font-display text-xl text-bark">₹{cart.subtotal.toFixed(2)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full text-center py-3 bg-canopy text-sand font-body tracking-wide uppercase text-sm rounded-full hover:bg-ink transition"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}