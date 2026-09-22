"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import Link from "next/link";
import {
  getCategories,
  getProductById,
  updateProduct,
  uploadProductImage,
} from "@/lib/api/products";
import {
  productFormSchema,
  ProductFormData,
  ProductFormInput,
} from "@/lib/validation/product.schema";
import { Category } from "@/types/product";
import { ApiError } from "@/lib/apiClient";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
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

  // Product data arrives ASYNCHRONOUSLY, well after useForm() has
  // already initialized with no default values. reset() is the
  // correct way to fill an already-created form with real data once
  // it shows up - calling useForm again, or trying to pass
  // defaultValues before the fetch resolves, wouldn't work here since
  // the data simply doesn't exist yet at the moment the form is built.
  useEffect(() => {
    async function loadProduct() {
      try {
        const product = await getProductById(id);
        if (!product) {
          toast.error("Product not found");
          router.push("/admin/products");
          return;
        }
        reset({
          name: product.name,
          description: product.description,
          richDescription: product.richDescription || "",
          image: product.image || "",
          images: product.images || [],
          brand: product.brand || "",
          price: product.price,
          categoryId: product.categoryId,
          countInStock: product.countInStock,
          isFeatured: product.isFeatured,
          ingredients: product.ingredients || "",
          usageNotes: product.usageNotes || "",
          benefits: product.benefits || "",
          precautions: product.precautions || "",
          quantity: product.quantity || "",
        });
      } catch (err) {
        toast.error("Couldn't load this product");
        router.push("/admin/products");
      } finally {
        setIsLoadingProduct(false);
      }
    }
    loadProduct();
  }, [id, reset, router]);

  async function onSubmit(data: ProductFormData) {
    try {
      await updateProduct(id, data);
      toast.success("Product updated");
      router.push("/admin/products");
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Try again.";
      toast.error(message);
    }
  }

  if (isLoadingProduct) {
    return (
      <p className="font-body text-sm text-bark/50 py-8">Loading product...</p>
    );
  }

  const galleryImages = watch("images") ?? [];

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingGallery(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadProductImage(file);
        uploadedUrls.push(url);
      }
      setValue("images", [...galleryImages, ...uploadedUrls], {
        shouldValidate: true,
      });
      toast.success(`${uploadedUrls.length} image(s) added to gallery`);
    } catch (err) {
      toast.error("Some images failed to upload - try again");
    } finally {
      setIsUploadingGallery(false);
      e.target.value = "";
    }
  }

  function removeGalleryImage(indexToRemove: number) {
    setValue(
      "images",
      galleryImages.filter((_, i) => i !== indexToRemove),
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/products"
          className="font-body text-sm text-bark/50 hover:text-canopy transition"
        >
          ← Products
        </Link>
      </div>
      <h1 className="font-display text-2xl text-bark mb-6">Edit Product</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">
            Name *
          </label>
          <input
            {...register("name")}
            className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition"
          />
          {errors.name && (
            <p className="text-red-700 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">
            Description *
          </label>
          <textarea
            rows={3}
            {...register("description")}
            className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition resize-none"
          />
          {errors.description && (
            <p className="text-red-700 text-xs mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">
            Rich Description
          </label>
          <textarea
            rows={2}
            {...register("richDescription")}
            className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">
            Image URL
          </label>
          <input
            {...register("image")}
            placeholder="https://..."
            className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition"
          />
          {errors.image && (
            <p className="text-red-700 text-xs mt-1">{errors.image.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">
            Gallery Images (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryUpload}
            disabled={isUploadingGallery}
            className="w-full text-sm font-body text-bark/70 file:mr-4 file:px-4 file:py-2 file:rounded-full file:border-0 file:bg-canopy file:text-sand file:text-sm file:font-body file:cursor-pointer disabled:opacity-50"
          />
          {isUploadingGallery && (
            <p className="text-bark/50 text-xs mt-1">Uploading...</p>
          )}

          {galleryImages.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {galleryImages.map((url, index) => (
                <div key={url} className="relative w-20 h-20">
                  <img
                    src={url}
                    alt={`Gallery ${index + 1}`}
                    className="w-20 h-20 rounded-lg object-cover bg-canopy/10"
                  />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-700 text-white text-xs flex items-center justify-center hover:bg-red-800 transition"
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">
              Brand
            </label>
            <input
              {...register("brand")}
              className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition"
            />
          </div>
          <div>
            <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">
              Quantity Label
            </label>
            <input
              {...register("quantity")}
              placeholder="e.g. 100ml"
              className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">
              Price (₹) *
            </label>
            <input
              type="number"
              step="0.01"
              {...register("price")}
              className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition"
            />
            {errors.price && (
              <p className="text-red-700 text-xs mt-1">
                {errors.price.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">
              Stock *
            </label>
            <input
              type="number"
              {...register("countInStock")}
              className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition"
            />
            {errors.countInStock && (
              <p className="text-red-700 text-xs mt-1">
                {errors.countInStock.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">
              Category *
            </label>
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
            {errors.categoryId && (
              <p className="text-red-700 text-xs mt-1">
                {errors.categoryId.message}
              </p>
            )}
          </div>
        </div>

        <label className="flex items-center gap-2 font-body text-sm text-bark/70">
          <input
            type="checkbox"
            {...register("isFeatured")}
            className="accent-canopy"
          />
          Feature this product
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">
              Ingredients
            </label>
            <textarea
              rows={2}
              {...register("ingredients")}
              className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">
              Usage Notes
            </label>
            <textarea
              rows={2}
              {...register("usageNotes")}
              className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">
              Benefits
            </label>
            <textarea
              rows={2}
              {...register("benefits")}
              className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">
              Precautions
            </label>
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
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
