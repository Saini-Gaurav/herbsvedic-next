"use client";

import { useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { initiatePayment, verifyPayment } from "@/lib/api/payments";
import { ApiError } from "@/lib/apiClient";
import { useCart } from "@/context/CartContext";
import { Order } from "@/types/order";

// Razorpay's checkout.js attaches a global `Razorpay` constructor to `window` once it loads - TypeScript doesn't know about it by default, so this tells it the property exists without fully typing Razorpay's entire SDK (not worth doing for one constructor call).
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentStep({ order }: { order: Order }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  // const { clearCart } = useCart(); 
  const { clearCartLocally } = useCart();
  const router = useRouter();

  async function handlePayNow() {
    if (!scriptLoaded || !window.Razorpay) {
      toast.error("Payment is still loading - try again in a moment");
      return;
    }

    setIsProcessing(true);
    try {
      const { payment } = await initiatePayment(order.id);

      const razorpay = new window.Razorpay({
        key: payment.razorpayKeyId,
        amount: Math.round(payment.amount * 100), // paise - matches what payment-service sent Razorpay
        currency: payment.currency,
        order_id: payment.razorpayOrderId,
        name: "Herbsvedic",
        description: `Order #${order.id.slice(0, 8)}`,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            // await clearCart();   // the order now owns this list of items - cart's job here is done
            clearCartLocally();
            router.push(`/order-confirmation/${order.id}`);
          } catch (err) {
            const message = err instanceof ApiError ? err.message : "Payment verification failed";
            toast.error(message);
          }
        },
        modal: {
          // Fires if the shopper closes the Razorpay popup without paying - not an error, just "changed their mind," so this only resets our own button state, no error toast shown.
          ondismiss: () => setIsProcessing(false),
        },
        theme: { color: "#3F5233" }, // matches --color-canopy
      });

      razorpay.open();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't start payment - try again";
      toast.error(message);
      setIsProcessing(false);
    }
  }

  return (
    <div className="max-w-md mx-auto flex flex-col gap-6">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" onLoad={() => setScriptLoaded(true)} />

      <div className="text-center">
        <h2 className="font-body font-semibold text-bark mb-2">Order placed</h2>
        <p className="font-body text-sm text-bark/60">
          Order #{order.id.slice(0, 8)} · ₹{order.totalPrice}
        </p>
      </div>

      <button
        onClick={handlePayNow}
        disabled={isProcessing}
        className="bg-turmeric text-ink font-body font-semibold py-3 rounded-full hover:bg-turmeric/90 transition disabled:opacity-50"
      >
        {isProcessing ? "Processing..." : `Pay ₹${order.totalPrice}`}
      </button>
    </div>
  );
}