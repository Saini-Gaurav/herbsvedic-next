"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import Link from "next/link"; 
import { getCategories, createProduct, uploadProductImage } from "@/lib/api/products";
import { ProductFormInput, productFormSchema, ProductFormData } from "@/lib/validation/product.schema";
import { Category } from "@/types/product";
import { ApiError } from "@/lib/apiClient";


export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);


  const {
  register,
  handleSubmit,
  setValue,
  watch,
  formState: { errors, isSubmitting },
} = useForm<ProductFormInput, unknown, ProductFormData>({
  resolver: zodResolver(productFormSchema),
});

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => toast.error("Couldn't load categories"));
  }, []);

  async function onSubmit(data: ProductFormData) {
    try {
      await createProduct(data);
      toast.success("Product created");
      router.push("/admin/products");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong. Try again.";
      toast.error(message);
    }
  }

  const imagePreview = watch("image");

async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0];
  if (!file) return;

  setIsUploadingImage(true);
  try {
    const url = await uploadProductImage(file);
    setValue("image", url, { shouldValidate: true });
    toast.success("Image uploaded");
  } catch (err) {
    toast.error("Image upload failed - try again");
  } finally {
    setIsUploadingImage(false);
  }
}
  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/products" className="font-body text-sm text-bark/50 hover:text-canopy transition">
          ← Products
        </Link>
      </div>
      <h1 className="font-display text-2xl text-bark mb-6">Add Product</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">Name *</label>
          <input
            {...register("name")}
            className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition"
          />
          {errors.name && <p className="text-red-700 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">Description *</label>
          <textarea
            rows={3}
            {...register("description")}
            className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition resize-none"
          />
          {errors.description && <p className="text-red-700 text-xs mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">Rich Description</label>
          <textarea
            rows={2}
            {...register("richDescription")}
            className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition resize-none"
          />
        </div>

<div>
  <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">Product Image</label>
  <input
    type="file"
    accept="image/*"
    onChange={handleImageUpload}
    disabled={isUploadingImage}
    className="w-full text-sm font-body text-bark/70 file:mr-4 file:px-4 file:py-2 file:rounded-full file:border-0 file:bg-canopy file:text-sand file:text-sm file:font-body file:cursor-pointer disabled:opacity-50"
  />
  {isUploadingImage && <p className="text-bark/50 text-xs mt-1">Uploading...</p>}
  {imagePreview && (
    <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded-lg object-cover mt-3 bg-canopy/10" />
  )}
  {errors.image && <p className="text-red-700 text-xs mt-1">{errors.image.message}</p>}
</div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">Brand</label>
            <input
              {...register("brand")}
              className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition"
            />
          </div>
          <div>
            <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">Quantity Label</label>
            <input
              {...register("quantity")}
              placeholder="e.g. 100ml"
              className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">Price (₹) *</label>
            <input
              type="number"
              step="0.01"
              {...register("price")}
              className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition"
            />
            {errors.price && <p className="text-red-700 text-xs mt-1">{errors.price.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">Stock *</label>
            <input
              type="number"
              {...register("countInStock")}
              className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition"
            />
            {errors.countInStock && <p className="text-red-700 text-xs mt-1">{errors.countInStock.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">Category *</label>
            <select
              {...register("categoryId")}
              className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-sand font-body text-sm focus:outline-none focus:border-canopy transition"
            >
              <option value="">Select...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="text-red-700 text-xs mt-1">{errors.categoryId.message}</p>}
          </div>
        </div>

        <label className="flex items-center gap-2 font-body text-sm text-bark/70">
          <input type="checkbox" {...register("isFeatured")} className="accent-canopy" />
          Feature this product
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">Ingredients</label>
            <textarea
              rows={2}
              {...register("ingredients")}
              className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">Usage Notes</label>
            <textarea
              rows={2}
              {...register("usageNotes")}
              className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">Benefits</label>
            <textarea
              rows={2}
              {...register("benefits")}
              className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">Precautions</label>
            <textarea
              rows={2}
              {...register("precautions")}
              className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition resize-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full sm:w-auto sm:self-start px-8 py-3 bg-canopy text-sand font-body tracking-wide uppercase text-sm rounded-full hover:bg-ink transition disabled:opacity-50"
        >
          {isSubmitting ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}