import { z } from "zod";

export const shippingAddressSchema = z.object({
  shippingAddress1: z.string().min(5, "Enter your street address"),
  shippingAddress2: z.string().optional(),
  city: z.string().min(2, "Enter your city"),
  zip: z.string().regex(/^\d{4,10}$/, "Enter a valid postal code"),
  country: z.string().min(2, "Enter your country"),
  phone: z.string().regex(/^\d{10}$/, "Enter a 10-digit phone number"),
});

export type ShippingAddressFormData = z.infer<typeof shippingAddressSchema>;