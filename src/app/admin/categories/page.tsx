"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiPlus } from "react-icons/fi";
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/api/categories";
import { AdminCategory, CategoryInput } from "@/types/category";
import { ApiError } from "@/lib/apiClient";
import CategoryForm from "@/components/admin/CategoryForm";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

type FormState =
  | { mode: "closed" }
  | { mode: "add" }
  | { mode: "edit"; category: AdminCategory };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formState, setFormState] = useState<FormState>({ mode: "closed" });
  const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      const { categories } = await listCategories();
      setCategories(categories);
    } catch {
      toast.error("Couldn't load categories");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSave(input: CategoryInput) {
    try {
      if (formState.mode === "edit") {
        await updateCategory(formState.category.id, input);
        toast.success("Category updated");
      } else {
        await createCategory(input);
        toast.success("Category added");
      }
      setFormState({ mode: "closed" });
      await load();
    } catch (err) {
      // form stays open so nothing they typed is lost
      toast.error(err instanceof ApiError ? err.message : "Couldn't save this category");
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteCategory(deleteTarget.id);
      await load();
      toast.success(`"${deleteTarget.name}" deleted`);
    } catch (err) {
      // a 409 here carries "N product(s) still reference it"
      toast.error(err instanceof ApiError ? err.message : "Couldn't delete this category");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  }

  if (formState.mode !== "closed") {
    return (
      <div className="max-w-md">
        <h1 className="font-display text-2xl text-bark mb-6">
          {formState.mode === "edit" ? "Edit Category" : "Add Category"}
        </h1>
        <CategoryForm
          key={formState.mode === "edit" ? formState.category.id : "new"}
          initial={formState.mode === "edit" ? formState.category : undefined}
          onSubmit={handleSave}
          onCancel={() => setFormState({ mode: "closed" })}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-bark">Categories</h1>
        <button
          onClick={() => setFormState({ mode: "add" })}
          className="flex items-center gap-1.5 px-5 py-2 bg-canopy text-sand font-body text-sm tracking-wide uppercase rounded-full hover:bg-ink transition"
        >
          <FiPlus size={14} />
          Add Category
        </button>
      </div>

      {isLoading ? (
        <p className="font-body text-sm text-bark/50 py-8">Loading categories...</p>
      ) : categories.length === 0 ? (
        <p className="font-body text-sm text-bark/50 py-8">No categories yet.</p>
      ) : (
        <div className="overflow-x-auto bg-white/60 border border-bark/10 rounded-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-bark/10">
                <th className="px-4 py-3 font-body text-xs uppercase tracking-wide text-bark/40">Category</th>
                <th className="px-4 py-3 font-body text-xs uppercase tracking-wide text-bark/40">Icon</th>
                <th className="px-4 py-3 font-body text-xs uppercase tracking-wide text-bark/40">Color</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b border-bark/5 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="w-5 h-5 rounded-full border border-bark/15 shrink-0"
                        style={{ backgroundColor: category.color || "transparent" }}
                      />
                      <span className="font-body text-sm text-bark">{category.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-bark/60">{category.icon || "—"}</td>
                  <td className="px-4 py-3 font-body text-sm text-bark/60">{category.color || "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <button
                        onClick={() => setFormState({ mode: "edit", category })}
                        className="font-body text-sm text-canopy hover:text-ink transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(category)}
                        className="font-body text-sm text-red-700/70 hover:text-red-700 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Delete this category?"
        message={`"${deleteTarget?.name}" will be removed. A category that still has products can't be deleted.`}
        isConfirming={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}