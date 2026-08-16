"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { apiFetch } from "@/lib/apiClient";
import { useAuth } from "./AuthContext";

const CART_API = process.env.NEXT_PUBLIC_CART_API_URL;

export interface CartItem {
  productId: string;
  quantity: number;
  product: { id: string; name: string; price: number; image: string; countInStock: number } | null;
  lineTotal: number;
}

export interface Cart {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
}

interface CartContextValue {
  cart: Cart;
  isLoading: boolean;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  // clearCart: () => Promise<void> 
  clearCartLocally: () => void;
}

const emptyCart: Cart = { items: [], itemCount: 0, subtotal: 0 };

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth(); // reused from AuthContext, not re-checked here
  const [cart, setCart] = useState<Cart>(emptyCart);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const fetchCart = useCallback(async () => {
    // No user, no cart to fetch - cart-service's routes all require requireAuth, so calling this while logged out would just be a guaranteed 401. Skip the wasted network call entirely.
    if (!user) {
      setCart(emptyCart);
      setIsLoading(false);
      return;
    }
    try {
      const data = await apiFetch<{ cart: Cart }>(`${CART_API}/cart`);
      setCart(data.cart);
    } catch (err) {
      console.error("Failed to fetch cart", err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Re-fetches every time `user` changes - covers both "just logged in, go get my real cart" AND "just logged out, clear it back to empty."
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  async function addToCart(productId: string, quantity: number = 1) {
    const data = await apiFetch<{ cart: Cart }>(`${CART_API}/cart/items`, {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    });
    setCart(data.cart);
    openCart(); // matches the old app's behavior: adding an item auto-opens the sidebar
  }

  async function updateQuantity(productId: string, quantity: number) {
    const data = await apiFetch<{ cart: Cart }>(`${CART_API}/cart/items/${productId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    });
    setCart(data.cart);
  }

  async function removeFromCart(productId: string) {
    const data = await apiFetch<{ cart: Cart }>(`${CART_API}/cart/items/${productId}`, {
      method: "DELETE",
    });
    setCart(data.cart);
  }

  async function clearCart() {
  await apiFetch(`${CART_API}/cart`, { method: "DELETE" });
  setCart(emptyCart);
}

  // Approach 1: optimistic local clear. This does NOT call the backend at all - by the time this runs, the order already succeeded, so we already know with certainty the cart is now empty. This just stops the UI from waiting to be told something it already knows. The real backend clear still happens completely separately, via cart-service's Kafka consumer - this is purely about making THIS tab feel instant, nothing more.
  function clearCartLocally() {
    setCart(emptyCart);
  }

  return (
    <CartContext.Provider
      value={{ cart, isLoading, isCartOpen, openCart, closeCart, addToCart, updateQuantity, removeFromCart, clearCartLocally}}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}