import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(255),
  icon: z.string().trim().max(255),
  // empty is fine, otherwise it has to be a full hex like #3F5233
  color: z.string().trim().regex(/^(#[0-9a-fA-F]{6})?$/, "Use a hex color like #3F5233"),
});

export type CategoryFormData = z.infer<typeof categorySchema>;