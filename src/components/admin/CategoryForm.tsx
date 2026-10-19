"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, CategoryFormData } from "@/lib/validation/category.schema";
import { AdminCategory, CategoryInput } from "@/types/category";

const inputClass =
  "w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition";
const labelClass = "block text-xs font-body uppercase tracking-wide text-bark/60 mb-1";
const HEX = /^#[0-9a-fA-F]{6}$/;

export default function CategoryForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: AdminCategory;
  onSubmit: (input: CategoryInput) => Promise<void>;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initial?.name ?? "",
      icon: initial?.icon ?? "",
      color: initial?.color ?? "",
    },
  });

  const color = watch("color");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <label className={labelClass}>Name *</label>
        <input type="text" {...register("name")} className={inputClass} />
        {errors.name && <p className="text-red-700 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Icon</label>
        <input
          type="text"
          {...register("icon")}
          placeholder="e.g. sparkles"
          className={inputClass}
        />
        {errors.icon && <p className="text-red-700 text-xs mt-1">{errors.icon.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Color</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={HEX.test(color) ? color : "#3F5233"}
            onChange={(e) =>
              setValue("color", e.target.value, { shouldValidate: true, shouldDirty: true })
            }
            className="h-10 w-12 rounded-lg border border-bark/20 bg-transparent cursor-pointer p-1"
          />
          <input type="text" {...register("color")} placeholder="#3F5233" className={inputClass} />
        </div>
        {errors.color && <p className="text-red-700 text-xs mt-1">{errors.color.message}</p>}
      </div>

      <div className="flex items-center gap-4 mt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 bg-canopy text-sand font-body tracking-wide uppercase text-sm rounded-full hover:bg-ink transition disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : initial ? "Save Changes" : "Add Category"}
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