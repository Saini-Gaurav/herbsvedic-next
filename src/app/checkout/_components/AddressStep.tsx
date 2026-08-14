"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shippingAddressSchema, ShippingAddressFormData } from "@/lib/validation/order.schema";

export default function AddressStep({
  onNext,
  defaultValues,
}: {
  onNext: (data: ShippingAddressFormData) => void;
  defaultValues?: Partial<ShippingAddressFormData>;
}) {
  const form = useForm<ShippingAddressFormData>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues,
  });

  return (
    <form onSubmit={form.handleSubmit(onNext)} className="max-w-md mx-auto flex flex-col gap-4">
      <div>
        <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">
          Street Address
        </label>
        <input
          type="text"
          {...form.register("shippingAddress1")}
          className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition"
        />
        {form.formState.errors.shippingAddress1 && (
          <p className="text-red-700 text-xs mt-1">
            {form.formState.errors.shippingAddress1.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">
          Apartment, Suite, etc. (optional)
        </label>
        <input
          type="text"
          {...form.register("shippingAddress2")}
          className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">
            City
          </label>
          <input
            type="text"
            {...form.register("city")}
            className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition"
          />
          {form.formState.errors.city && (
            <p className="text-red-700 text-xs mt-1">{form.formState.errors.city.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">
            Postal Code
          </label>
          <input
            type="text"
            {...form.register("zip")}
            className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition"
          />
          {form.formState.errors.zip && (
            <p className="text-red-700 text-xs mt-1">{form.formState.errors.zip.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">
          Country
        </label>
        <input
          type="text"
          {...form.register("country")}
          className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition"
        />
        {form.formState.errors.country && (
          <p className="text-red-700 text-xs mt-1">{form.formState.errors.country.message}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          {...form.register("phone")}
          className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition"
        />
        {form.formState.errors.phone && (
          <p className="text-red-700 text-xs mt-1">{form.formState.errors.phone.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="mt-2 w-full py-3 bg-canopy text-sand font-body tracking-wide uppercase text-sm rounded-full hover:bg-ink transition"
      >
        Continue to Review
      </button>
    </form>
  );
}