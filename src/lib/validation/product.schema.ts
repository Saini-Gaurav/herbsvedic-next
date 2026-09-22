import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(10, "Description should be at least 10 characters"),
  richDescription: z.string().optional(),
  image: z.string().url("Must be a valid image URL").optional().or(z.literal("")),
  images: z.array(z.string()).optional(),
  brand: z.string().optional(),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  categoryId: z.string().min(1, "Select a category"),
  countInStock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  isFeatured: z.boolean().optional(),
  ingredients: z.string().optional(),
  usageNotes: z.string().optional(),
  benefits: z.string().optional(),
  precautions: z.string().optional(),
  quantity: z.string().optional(),
});

export type ProductFormData = z.infer<typeof productFormSchema>;
// The "before validation" shape - what the raw <input> fields actually contain. z.input (not z.infer) gives you the PRE-coercion type: price and countInStock are string here, matching what a real <input> hands back, before z.coerce.number() has done anything to it.
export type ProductFormInput = z.input<typeof productFormSchema>;