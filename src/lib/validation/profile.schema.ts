import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^\d{10}$/, "Enter a 10-digit phone number"),
});

export type ProfileFormData = z.infer<typeof profileSchema>;