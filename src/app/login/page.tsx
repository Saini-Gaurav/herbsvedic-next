"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/apiClient";
import { loginSchema, registerSchema, LoginFormData, RegisterFormData } from "@/lib/validation/auth.schema";
import RootDivider from "@/components/ui/RootDivider";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const { login, register: registerUser } = useAuth();
  const router = useRouter();

  // Two SEPARATE forms, not one shared one - login and register ask for genuinely different fields (register needs name/phone/confirm password, login doesn't), so trying to force them into one form object would mean half the fields are irrelevant depending on mode.
  const loginForm = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  async function onLogin(data: LoginFormData) {
    try {
      await login(data.email, data.password);
      toast.success("Welcome back!");
      router.push("/");
    } catch (err) {
      // ApiError carries the REAL message your backend sent ("Invalid email or password") - falling back to a generic message only if something unexpected (not even our own ApiError shape) went wrong, e.g. the network being down.
      const message = err instanceof ApiError ? err.message : "Something went wrong. Try again.";
      toast.error(message);
    }
  }

  async function onRegister(data: RegisterFormData) {
    try {
      await registerUser(data.name, data.email, data.password, data.phone);
      toast.success("Account created!");
      router.push("/");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong. Try again.";
      toast.error(message);
    }
  }

  return (
    <div className="min-h-[calc(100vh-117px)] grid grid-cols-1 md:grid-cols-2">
      {/* Left panel - decorative, hidden on mobile since there's no
          room for it and it's not essential content, just atmosphere. */}
      <div className="hidden md:flex flex-col items-center justify-center bg-canopy text-sand px-12 text-center">
        <h1 className="font-display text-4xl leading-tight mb-4">
          Rooted in Tradition,
          <br />
          Made for Today
        </h1>
        <RootDivider className="[&_path]:stroke-turmeric" />
        <p className="font-body text-sand/80 max-w-sm mt-4">
          Sign in to track your orders, save your favourites, and pick up your
          wellness journey right where you left off.
        </p>
      </div>

      {/* Right panel - the actual form */}
      <div className="flex items-center justify-center px-6 py-16 bg-sand">
        <div className="w-full max-w-sm">
          <div className="flex mb-8 border-b border-bark/10">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 pb-3 font-body text-sm tracking-wide uppercase transition-colors ${
                mode === "login" ? "text-canopy border-b-2 border-canopy" : "text-bark/40"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 pb-3 font-body text-sm tracking-wide uppercase transition-colors ${
                mode === "register" ? "text-canopy border-b-2 border-canopy" : "text-bark/40"
              }`}
            >
              Register
            </button>
          </div>

          {mode === "login" ? (
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">Email</label>
                <input
                  type="email"
                  {...loginForm.register("email")}
                  className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition"
                />
                {loginForm.formState.errors.email && (
                  <p className="text-red-700 text-xs mt-1">{loginForm.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">Password</label>
                <input
                  type="password"
                  {...loginForm.register("password")}
                  className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition"
                />
                {loginForm.formState.errors.password && (
                  <p className="text-red-700 text-xs mt-1">{loginForm.formState.errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loginForm.formState.isSubmitting}
                className="mt-2 w-full py-3 bg-canopy text-sand font-body tracking-wide uppercase text-sm rounded-full hover:bg-ink transition disabled:opacity-50"
              >
                {loginForm.formState.isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </form>
          ) : (
            <form onSubmit={registerForm.handleSubmit(onRegister)} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">Full Name</label>
                <input
                  type="text"
                  {...registerForm.register("name")}
                  className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition"
                />
                {registerForm.formState.errors.name && (
                  <p className="text-red-700 text-xs mt-1">{registerForm.formState.errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">Email</label>
                <input
                  type="email"
                  {...registerForm.register("email")}
                  className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition"
                />
                {registerForm.formState.errors.email && (
                  <p className="text-red-700 text-xs mt-1">{registerForm.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">Phone Number</label>
                <input
                  type="tel"
                  {...registerForm.register("phone")}
                  className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition"
                />
                {registerForm.formState.errors.phone && (
                  <p className="text-red-700 text-xs mt-1">{registerForm.formState.errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">Password</label>
                <input
                  type="password"
                  {...registerForm.register("password")}
                  className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition"
                />
                {registerForm.formState.errors.password && (
                  <p className="text-red-700 text-xs mt-1">{registerForm.formState.errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">Confirm Password</label>
                <input
                  type="password"
                  {...registerForm.register("confirmPassword")}
                  className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition"
                />
                {registerForm.formState.errors.confirmPassword && (
                  <p className="text-red-700 text-xs mt-1">{registerForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={registerForm.formState.isSubmitting}
                className="mt-2 w-full py-3 bg-canopy text-sand font-body tracking-wide uppercase text-sm rounded-full hover:bg-ink transition disabled:opacity-50"
              >
                {registerForm.formState.isSubmitting ? "Creating account..." : "Create Account"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}