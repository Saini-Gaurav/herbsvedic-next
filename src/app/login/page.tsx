"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/apiClient";
import {
  loginSchema,
  registerSchema,
  LoginFormData,
  RegisterFormData,
} from "@/lib/validation/auth.schema";
import RootDivider from "@/components/ui/RootDivider";
import OtpInput from "@/components/ui/OtpInput";
import PasswordInput from "@/components/ui/PasswordInput";

// How many seconds someone must wait before requesting another code.Matches the backend's RESEND_COOLDOWN_MS (60s) - this is purely a UI countdown, the backend enforces the REAL rule independently; this timer just stops someone from clicking "Resend" and hitting a 429 they could see coming.
const RESEND_COOLDOWN_SECONDS = 60;

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  // Only relevant while mode === "register" - "form" is the normal name/email/password screen, "otp" is the verification screen that replaces it after a successful initiate call.
  const [registerStep, setRegisterStep] = useState<"form" | "otp">("form");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Kept so "Resend" can re-submit the SAME details the person already typed, without asking them to retype anything.
  const pendingRegistration = useRef<RegisterFormData | null>(null);

  const { login, initiateRegister, verifyRegisterOtp } = useAuth();
  const router = useRouter();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // A simple ticking countdown - decrements once a second, stops itself at 0. Standard setInterval + cleanup pattern.
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  async function onLogin(data: LoginFormData) {
    try {
      await login(data.email, data.password);
      toast.success("Welcome back!");
      router.push("/");
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Try again.";
      toast.error(message);
    }
  }

  async function onRegister(data: RegisterFormData) {
    try {
      await initiateRegister(data.name, data.email, data.password, data.phone);
      pendingRegistration.current = data;
      toast.success("We've sent a code to your email");
      setRegisterStep("otp");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Try again.";
      toast.error(message);
    }
  }

  async function handleVerifyOtp() {
    if (otp.length !== 6) {
      setOtpError("Enter the 6-digit code");
      return;
    }
    if (!pendingRegistration.current) return; // shouldn't happen - guards TypeScript, not a real user path

    setOtpError("");
    setIsVerifying(true);
    try {
      await verifyRegisterOtp(pendingRegistration.current.email, otp);
      toast.success("Account created!");
      router.push("/");
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Try again.";
      setOtpError(message);
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleResend() {
    if (cooldown > 0 || !pendingRegistration.current) return;
    try {
      const { name, email, password, phone } = pendingRegistration.current;
      await initiateRegister(name, email, password, phone);
      toast.success("A new code has been sent");
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setOtp("");
      setOtpError("");
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Try again.";
      toast.error(message);
    }
  }

  function backToRegisterForm() {
    setRegisterStep("form");
    setOtp("");
    setOtpError("");
  }

  return (
    <div className="min-h-[calc(100vh-117px)] grid grid-cols-1 md:grid-cols-2">
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

      <div className="flex items-center justify-center px-6 py-16 bg-sand">
        <div className="w-full max-w-sm">
          {/* Tabs are hidden entirely during the OTP step - switching
              to "Login" mid-verification would abandon a pending
              registration sitting in Redis, so removing the escape
              hatch here is deliberate, not an oversight. */}
          {!(mode === "register" && registerStep === "otp") && (
            <div className="flex mb-8 border-b border-bark/10">
              <button
                onClick={() => setMode("login")}
                className={`flex-1 pb-3 font-body text-sm tracking-wide uppercase transition-colors ${
                  mode === "login"
                    ? "text-canopy border-b-2 border-canopy"
                    : "text-bark/40"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setMode("register")}
                className={`flex-1 pb-3 font-body text-sm tracking-wide uppercase transition-colors ${
                  mode === "register"
                    ? "text-canopy border-b-2 border-canopy"
                    : "text-bark/40"
                }`}
              >
                Register
              </button>
            </div>
          )}

          {mode === "login" && (
            <form
              onSubmit={loginForm.handleSubmit(onLogin)}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  {...loginForm.register("email")}
                  className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition"
                />
                {loginForm.formState.errors.email && (
                  <p className="text-red-700 text-xs mt-1">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">
                  Password
                </label>
                <PasswordInput
                  {...loginForm.register("password")}
                  className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition"
                />
                {loginForm.formState.errors.password && (
                  <p className="text-red-700 text-xs mt-1">
                    {loginForm.formState.errors.password.message}
                  </p>
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
          )}

          {mode === "register" && registerStep === "form" && (
            <form
              onSubmit={registerForm.handleSubmit(onRegister)}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  {...registerForm.register("name")}
                  className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition"
                />
                {registerForm.formState.errors.name && (
                  <p className="text-red-700 text-xs mt-1">
                    {registerForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  {...registerForm.register("email")}
                  className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition"
                />
                {registerForm.formState.errors.email && (
                  <p className="text-red-700 text-xs mt-1">
                    {registerForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  {...registerForm.register("phone")}
                  className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition"
                />
                {registerForm.formState.errors.phone && (
                  <p className="text-red-700 text-xs mt-1">
                    {registerForm.formState.errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">
                  Password
                </label>
                <PasswordInput
                  {...registerForm.register("password")}
                  className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition"
                />
                {registerForm.formState.errors.password && (
                  <p className="text-red-700 text-xs mt-1">
                    {registerForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">
                  Confirm Password
                </label>
                <PasswordInput
                  {...registerForm.register("confirmPassword")}
                  className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition"
                />
                {registerForm.formState.errors.confirmPassword && (
                  <p className="text-red-700 text-xs mt-1">
                    {registerForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={registerForm.formState.isSubmitting}
                className="mt-2 w-full py-3 bg-canopy text-sand font-body tracking-wide uppercase text-sm rounded-full hover:bg-ink transition disabled:opacity-50"
              >
                {registerForm.formState.isSubmitting
                  ? "Sending code..."
                  : "Continue"}
              </button>
            </form>
          )}

          {mode === "register" && registerStep === "otp" && (
            <div className="flex flex-col items-center gap-5">
              <div className="text-center">
                <h2 className="font-display text-xl text-bark mb-1">
                  Check your email
                </h2>
                <p className="font-body text-sm text-bark/60">
                  We sent a 6-digit code to
                  <br />
                  <span className="text-bark font-medium">
                    {pendingRegistration.current?.email}
                  </span>
                </p>
              </div>

              <OtpInput
                value={otp}
                onChange={(val) => {
                  setOtp(val);
                  if (otpError) setOtpError("");
                }}
              />
              {otpError && <p className="text-red-700 text-xs">{otpError}</p>}

              <button
                onClick={handleVerifyOtp}
                disabled={isVerifying}
                className="w-full py-3 bg-canopy text-sand font-body tracking-wide uppercase text-sm rounded-full hover:bg-ink transition disabled:opacity-50"
              >
                {isVerifying ? "Verifying..." : "Verify & Create Account"}
              </button>

              <div className="flex flex-col items-center gap-2 text-sm font-body">
                {cooldown > 0 ? (
                  <span className="text-bark/40">
                    Resend code in {cooldown}s
                  </span>
                ) : (
                  <button
                    onClick={handleResend}
                    className="text-canopy hover:text-ink transition"
                  >
                    Resend code
                  </button>
                )}
                <button
                  onClick={backToRegisterForm}
                  className="text-bark/40 hover:text-bark/70 transition text-xs"
                >
                  ← Use a different email
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
