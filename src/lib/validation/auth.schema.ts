import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    phone: z.string().regex(/^\d{10}$/, "Enter a 10-digit phone number"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  // .refine() runs AFTER every individual field already passed its own check - it's for rules that need to compare two fields against each other, which a single field's own rule can't do alone.
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // tells react-hook-form which field's error box to show this under
  });


export const otpSchema = z.object({
  otp: z.string().length(6, "Enter the 6-digit code").regex(/^\d+$/, "Code must be numeric"),
});

export type OtpFormData = z.infer<typeof otpSchema>;  

export type RegisterFormData = z.infer<typeof registerSchema>;