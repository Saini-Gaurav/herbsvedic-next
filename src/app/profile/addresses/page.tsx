"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiPlus } from "react-icons/fi";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/lib/api/addresses";
import { SavedAddress, AddressInput } from "@/types/address";
import { ApiError } from "@/lib/apiClient";
import AddressForm from "@/components/profile/AddressForm";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

type FormState = { mode: "closed" } | { mode: "add" } | { mode: "edit"; address: SavedAddress };

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formState, setFormState] = useState<FormState>({ mode: "closed" });
  const [deleteTarget, setDeleteTarget] = useState<SavedAddress | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      const { addresses } = await getAddresses();
      setAddresses(addresses);
    } catch {
      toast.error("Couldn't load your addresses");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSave(input: AddressInput) {
    try {
      if (formState.mode === "edit") {
        await updateAddress(formState.address.id, input);
        toast.success("Address updated");
      } else {
        await createAddress(input);
        toast.success("Address added");
      }
      setFormState({ mode: "closed" });
      await load();
    } catch (err) {
      // form stays open so nothing they typed is lost
      toast.error(err instanceof ApiError ? err.message : "Couldn't save this address");
    }
  }

  async function handleSetDefault(id: string) {
    try {
      await setDefaultAddress(id);
      await load();
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
      await load();
      setDeleteTarget(null);
      toast.success("Address removed");
    } catch {
      toast.error("Couldn't remove this address");
    } finally {
      setIsDeleting(false);
    }
  }

  if (formState.mode !== "closed") {
    return (
      <div className="max-w-md">
        <h2 className="font-body font-semibold text-bark mb-5">
          {formState.mode === "edit" ? "Edit address" : "Add a new address"}
        </h2>
        <AddressForm
          key={formState.mode === "edit" ? formState.address.id : "new"}
          initial={formState.mode === "edit" ? formState.address : undefined}
          onSubmit={handleSave}
          onCancel={() => setFormState({ mode: "closed" })}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-body font-semibold text-bark">Saved addresses</h2>
        <button
          onClick={() => setFormState({ mode: "add" })}
          className="flex items-center gap-1.5 px-4 py-2 bg-canopy text-sand font-body text-xs tracking-wide uppercase rounded-full hover:bg-ink transition"
        >
          <FiPlus size={14} />
          Add address
        </button>
      </div>

      {isLoading ? (
        <p className="font-body text-sm text-bark/50">Loading your addresses...</p>
      ) : addresses.length === 0 ? (
        <p className="font-body text-sm text-bark/50 py-6">
          You haven&apos;t saved any addresses yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div key={address.id} className="rounded-2xl border border-bark/15 bg-white/60 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-bark/10 text-bark/70 text-xs font-body">
                  {address.label}
                </span>
                {address.isDefault && (
                  <span className="px-2.5 py-0.5 rounded-full bg-turmeric/15 text-turmeric text-xs font-body">
                    Default
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

              <div className="flex flex-wrap items-center gap-4 mt-3">
                <button
                  onClick={() => setFormState({ mode: "edit", address })}
                  className="font-body text-xs text-canopy hover:text-ink transition"
                >
                  Edit
                </button>
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="font-body text-xs text-canopy hover:text-ink transition"
                  >
                    Set as default
                  </button>
                )}
                <button
                  onClick={() => setDeleteTarget(address)}
                  className="font-body text-xs text-red-700/70 hover:text-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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