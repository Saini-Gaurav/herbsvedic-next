"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { createOrder } from "@/lib/api/orders";
import { ApiError } from "@/lib/apiClient";
import { ShippingAddressFormData } from "@/lib/validation/order.schema";
import { Cart } from "@/context/CartContext";
import { Order } from "@/types/order";

export default function ReviewStep({
  address,
  cart,
  onBack,
  onOrderCreated,
}: {
  address: ShippingAddressFormData;
  cart: Cart;
  onBack: () => void;
  onOrderCreated: (order: Order) => void;
}) {
  const [isPlacing, setIsPlacing] = useState(false);

  async function handlePlaceOrder() {
    setIsPlacing(true);
    try {
      const { order } = await createOrder({
        ...address,
        items: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });
      onOrderCreated(order);
    } catch (err) {
      // order-service re-validates stock/price itself before creating anything - if a product went out of stock or was deleted since you added it to your cart, THIS is where that gets caught, with the real reason surfaced via ApiError's message.
      const message = err instanceof ApiError ? err.message : "Couldn't place your order - try again";
      toast.error(message);
    } finally {
      setIsPlacing(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8">
      <div>
        <h2 className="font-body font-semibold text-bark mb-3">Shipping to</h2>
        <p className="font-body text-sm text-bark/70 leading-relaxed">
          {address.shippingAddress1}
          {address.shippingAddress2 ? `, ${address.shippingAddress2}` : ""}
          <br />
          {address.city}, {address.zip}, {address.country}
          <br />
          {address.phone}
        </p>
        <button
          onClick={onBack}
          className="text-canopy text-sm font-body underline underline-offset-4 mt-2"
        >
          Edit address
        </button>
      </div>

      <div>
        <h2 className="font-body font-semibold text-bark mb-3">Order summary</h2>
        <div className="divide-y divide-bark/10">
          {cart.items.map((item) => (
            <div key={item.productId} className="flex justify-between py-3 text-sm font-body">
              <span>
                {item.product?.name ?? "Product"} × {item.quantity}
              </span>
              <span>₹{item.lineTotal}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between pt-4 border-t border-bark/10 font-body font-semibold text-bark">
          <span>Total</span>
          <span>₹{cart.subtotal}</span>
        </div>
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={isPlacing}
        className="bg-canopy text-sand font-body font-semibold py-3 rounded-full hover:bg-canopy/90 transition disabled:opacity-50"
      >
        {isPlacing ? "Placing order..." : "Place Order"}
      </button>
    </div>
  );
}