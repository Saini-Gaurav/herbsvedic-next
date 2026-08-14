"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { ShippingAddressFormData } from "@/lib/validation/order.schema";
import { Order } from "@/types/order";
import CheckoutStepper from "./_components/CheckoutStepper";
import AddressStep from "./_components/AddressStep";
import ReviewStep from "./_components/ReviewStep";
import PaymentStep from "./_components/PaymentStep";

type Step = "address" | "review" | "payment";

export default function CheckoutPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { cart, isLoading: cartLoading } = useCart();
  const router = useRouter();

  const [step, setStep] = useState<Step>("address");
  const [address, setAddress] = useState<ShippingAddressFormData | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  // Guard 1: must be logged in - checkout calls order-service/payment- service, both requireAuth. Better to redirect BEFORE showing a form than to let someone fill it out and hit a 401 on submit.
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  // Guard 2: nothing to check out with an empty cart. Only enforced on the address step - once an order is created (step moves to "payment"), the cart may already be mid-clearing and shouldn't bounce the shopper away from their own payment screen.
  useEffect(() => {
    if (!cartLoading && cart.items.length === 0 && step === "address") {
      router.push("/shop");
    }
  }, [cartLoading, cart.items.length, step, router]);

  if (authLoading || cartLoading) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center font-body text-bark/60">
        Loading...
      </div>
    );
  }

  if (!user) {
    return null; // redirecting via the effect above
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-10 py-12">
      <CheckoutStepper currentStep={step} />

      {step === "address" && (
        <AddressStep
          defaultValues={address ?? undefined}
          onNext={(data) => {
            setAddress(data);
            setStep("review");
          }}
        />
      )}

      {step === "review" && address && (
        <ReviewStep
          address={address}
          cart={cart}
          onBack={() => setStep("address")}
          onOrderCreated={(createdOrder) => {
            setOrder(createdOrder);
            setStep("payment");
          }}
        />
      )}

      {step === "payment" && order && <PaymentStep order={order} />}
    </div>
  );
}