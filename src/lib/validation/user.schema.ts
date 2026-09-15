import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().regex(/^\d{10}$/, "Enter a 10-digit phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  roleCode: z.enum(["CUSTOMER", "ADMIN"]),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;