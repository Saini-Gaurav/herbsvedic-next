"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shippingAddressSchema, ShippingAddressFormData } from "@/lib/validation/order.schema";
import { AddressInput, AddressLabel, SavedAddress } from "@/types/address";

const LABELS: AddressLabel[] = ["Home", "Work", "Other"];

const inputClass =
  "w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition";
const labelClass = "block text-xs font-body uppercase tracking-wide text-bark/60 mb-1";

export default function AddressForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: SavedAddress;
  onSubmit: (input: AddressInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [label, setLabel] = useState<AddressLabel>(initial?.label ?? "Home");

  const form = useForm<ShippingAddressFormData>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: initial
      ? {
          shippingAddress1: initial.shippingAddress1,
          shippingAddress2: initial.shippingAddress2 ?? "",
          city: initial.city,
          zip: initial.zip,
          country: initial.country,
          phone: initial.phone,
        }
      : undefined,
  });

  async function submit(data: ShippingAddressFormData) {
    await onSubmit({ ...data, shippingAddress2: data.shippingAddress2 ?? "", label });
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="flex flex-col gap-4">
      <div className="flex gap-2">
        {LABELS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setLabel(option)}
            className={`px-4 py-1.5 rounded-full border font-body text-xs transition ${
              label === option
                ? "bg-canopy text-sand border-canopy"
                : "border-bark/20 text-bark/60 hover:border-canopy/40"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div>
        <label className={labelClass}>Street Address</label>
        <input type="text" {...form.register("shippingAddress1")} className={inputClass} />
        {form.formState.errors.shippingAddress1 && (
          <p className="text-red-700 text-xs mt-1">{form.formState.errors.shippingAddress1.message}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>Apartment, Suite, etc. (optional)</label>
        <input type="text" {...form.register("shippingAddress2")} className={inputClass} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>City</label>
          <input type="text" {...form.register("city")} className={inputClass} />
          {form.formState.errors.city && (
            <p className="text-red-700 text-xs mt-1">{form.formState.errors.city.message}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Postal Code</label>
          <input type="text" {...form.register("zip")} className={inputClass} />
          {form.formState.errors.zip && (
            <p className="text-red-700 text-xs mt-1">{form.formState.errors.zip.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className={labelClass}>Country</label>
        <input type="text" {...form.register("country")} className={inputClass} />
        {form.formState.errors.country && (
          <p className="text-red-700 text-xs mt-1">{form.formState.errors.country.message}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>Phone Number</label>
        <input type="tel" {...form.register("phone")} className={inputClass} />
        {form.formState.errors.phone && (
          <p className="text-red-700 text-xs mt-1">{form.formState.errors.phone.message}</p>
        )}
      </div>

      <div className="flex items-center gap-4 mt-2">
        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="px-8 py-3 bg-canopy text-sand font-body tracking-wide uppercase text-sm rounded-full hover:bg-ink transition disabled:opacity-50"
        >
          {form.formState.isSubmitting ? "Saving..." : initial ? "Save Changes" : "Add Address"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="font-body text-sm text-bark/60 hover:text-bark transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}