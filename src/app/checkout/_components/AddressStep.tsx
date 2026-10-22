"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { FiPlus, FiCheck } from "react-icons/fi";
import { shippingAddressSchema, ShippingAddressFormData } from "@/lib/validation/order.schema";
import { getAddresses, createAddress, deleteAddress, setDefaultAddress } from "@/lib/api/addresses";
import { ApiError } from "@/lib/apiClient";
import { SavedAddress, AddressLabel } from "@/types/address";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

const EMPTY_ADDRESS: ShippingAddressFormData = {
  shippingAddress1: "",
  shippingAddress2: "",
  city: "",
  zip: "",
  country: "",
  phone: "",
};

const LABELS: AddressLabel[] = ["Home", "Work", "Other"];

const inputClass =
  "w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition";
const labelClass = "block text-xs font-body uppercase tracking-wide text-bark/60 mb-1";

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

  const [saved, setSaved] = useState<SavedAddress[]>([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(true);
  // null means "typing a new address"; otherwise the id of the picked card
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [saveToBook, setSaveToBook] = useState(false);
  const [label, setLabel] = useState<AddressLabel>("Home");

  const [deleteTarget, setDeleteTarget] = useState<SavedAddress | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadSaved = useCallback(async (): Promise<SavedAddress[]> => {
    try {
      const { addresses } = await getAddresses();
      setSaved(addresses);
      return addresses;
    } catch {
      // The address book is a convenience - never block checkout over it
      return [];
    } finally {
      setIsLoadingSaved(false);
    }
  }, []);

  function selectAddress(address: SavedAddress) {
    setSelectedId(address.id);
    form.reset({
      shippingAddress1: address.shippingAddress1,
      shippingAddress2: address.shippingAddress2 ?? "",
      city: address.city,
      zip: address.zip,
      country: address.country,
      phone: address.phone,
    });
  }

  function startNewAddress() {
    setSelectedId(null);
    setSaveToBook(false);
    form.reset(EMPTY_ADDRESS);
  }

  useEffect(() => {
    loadSaved().then((addresses) => {
      // Pre-pick the default on first arrival. If defaultValues came in, the shopper is returning from the review step - keep what they typed.
      if (!defaultValues && addresses.length > 0) {
        selectAddress(addresses[0]); // backend sends the default first
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSetDefault(id: string) {
    try {
      await setDefaultAddress(id);
      await loadSaved();
      toast.success("Default address updated");
    } catch {
      toast.error("Couldn't update the default address");
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteAddress(deleteTarget.id);
      if (selectedId === deleteTarget.id) setSelectedId(null);
      await loadSaved();
      setDeleteTarget(null);
      toast.success("Address removed");
    } catch {
      toast.error("Couldn't remove this address");
    } finally {
      setIsDeleting(false);
    }
  }

  async function onSubmit(data: ShippingAddressFormData) {
    if (selectedId === null && saveToBook) {
      try {
        await createAddress({
          ...data,
          shippingAddress2: data.shippingAddress2 ?? "",
          label,
        });
      } catch (err) {
        // Saving is optional, so a failure here shouldn't stop the order
        toast.error(
          err instanceof ApiError ? err.message : "Couldn't save this address, continuing without saving"
        );
      }
    }
    onNext(data);
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8">
      {!isLoadingSaved && saved.length > 0 && (
        <div>
          <h2 className="font-body font-semibold text-bark mb-3">Saved addresses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {saved.map((address) => {
              const isSelected = selectedId === address.id;
              return (
                <div
                  key={address.id}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onClick={() => selectAddress(address)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      selectAddress(address);
                    }
                  }}
                  className={`relative cursor-pointer rounded-2xl border p-4 transition ${
                    isSelected
                      ? "border-canopy bg-canopy/5"
                      : "border-bark/15 bg-white/60 hover:border-canopy/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-bark/10 text-bark/70 text-xs font-body">
                        {address.label}
                      </span>
                      {address.isDefault && (
                        <span className="px-2.5 py-0.5 rounded-full bg-turmeric/15 text-turmeric text-xs font-body">
                          Default
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-canopy text-sand flex items-center justify-center">
                        <FiCheck size={12} />
                      </span>
                    )}
                  </div>

                  <p className="font-body text-sm text-bark leading-relaxed">
                    {address.shippingAddress1}
                    {address.shippingAddress2 ? `, ${address.shippingAddress2}` : ""}
                    <br />
                    {address.city}, {address.zip}
                    <br />
                    {address.country}
                  </p>
                  <p className="font-body text-xs text-bark/50 mt-1">{address.phone}</p>

                  <div className="flex items-center gap-4 mt-3">
                    {!address.isDefault && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetDefault(address.id);
                        }}
                        className="font-body text-xs text-canopy hover:text-ink transition"
                      >
                        Set as default
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(address);
                      }}
                      className="font-body text-xs text-red-700/70 hover:text-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}

            <button
              type="button"
              onClick={startNewAddress}
              className={`flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed p-4 min-h-35 transition font-body text-sm ${
                selectedId === null
                  ? "border-canopy text-canopy bg-canopy/5"
                  : "border-bark/25 text-bark/50 hover:border-canopy/40 hover:text-canopy"
              }`}
            >
              <FiPlus size={20} />
              Add a new address
            </button>
          </div>
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md w-full mx-auto flex flex-col gap-4">
        <div>
          <h2 className="font-body font-semibold text-bark">Delivery details</h2>
          {selectedId && (
            <p className="font-body text-xs text-bark/50 mt-1">
              Any edits here apply to this order only.
            </p>
          )}
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

        {selectedId === null && (
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 font-body text-sm text-bark/70">
              <input
                type="checkbox"
                checked={saveToBook}
                onChange={(e) => setSaveToBook(e.target.checked)}
                className="accent-canopy"
              />
              Save this address for next time
            </label>

            {saveToBook && (
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
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="mt-2 w-full py-3 bg-canopy text-sand font-body tracking-wide uppercase text-sm rounded-full hover:bg-ink transition disabled:opacity-50"
        >
          {form.formState.isSubmitting ? "Saving..." : "Continue to Review"}
        </button>
      </form>

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Remove this address?"
        message="It'll be removed from your saved addresses. Past orders aren't affected."
        confirmLabel="Remove"
        isConfirming={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}