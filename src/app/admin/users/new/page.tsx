"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { createUserSchema, CreateUserFormData } from "@/lib/validation/user.schema";
import PasswordInput from "@/components/ui/PasswordInput";
import { ApiError } from "@/lib/apiClient";

export default function NewUserPage() {
  const { createUserAsAdmin } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { roleCode: "CUSTOMER" },
  });

  async function onSubmit(data: CreateUserFormData) {
    try {
      await createUserAsAdmin(data);
      toast.success(`Account created for ${data.email}`);
      router.push("/admin/products");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong. Try again.";
      toast.error(message);
    }
  }

  return (
    <div className="max-w-md">
      <Link href="/admin/products" className="font-body text-sm text-bark/50 hover:text-canopy transition">
        ← Admin
      </Link>
      <h1 className="font-display text-2xl text-bark mt-4 mb-6">Create User Account</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">Full Name</label>
          <input
            {...register("name")}
            className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition"
          />
          {errors.name && <p className="text-red-700 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">Email</label>
          <input
            type="email"
            {...register("email")}
            className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition"
          />
          {errors.email && <p className="text-red-700 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">Phone Number</label>
          <input
            type="tel"
            {...register("phone")}
            className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition"
          />
          {errors.phone && <p className="text-red-700 text-xs mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">Temporary Password</label>
          <PasswordInput
            {...register("password")}
            className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition"
          />
          {errors.password && <p className="text-red-700 text-xs mt-1">{errors.password.message}</p>}
          <p className="text-xs text-bark/40 mt-1">Share this with them directly - they can change it later.</p>
        </div>

        <div>
          <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">Role</label>
          <select
            {...register("roleCode")}
            className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-sand font-body text-sm focus:outline-none focus:border-canopy transition"
          >
            <option value="CUSTOMER">Customer</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full py-3 bg-canopy text-sand font-body tracking-wide uppercase text-sm rounded-full hover:bg-ink transition disabled:opacity-50"
        >
          {isSubmitting ? "Creating..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}