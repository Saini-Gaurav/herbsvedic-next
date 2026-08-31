"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/apiClient";
import {
  forgotPasswordEmailSchema,
  resetPasswordSchema,
  ForgotPasswordEmailData,
  ResetPasswordFormData,
} from "@/lib/validation/auth.schema";
import OtpInput from "@/components/ui/OtpInput";
import PasswordInput from "@/components/ui/PasswordInput";
import RootDivider from "@/components/ui/RootDivider";

const RESEND_COOLDOWN_SECONDS = 60;

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "reset">("email");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const pendingEmail = useRef("");

  const { initiatePasswordReset, resetPassword } = useAuth();
  const router = useRouter();

  const emailForm = useForm<ForgotPasswordEmailData>({ resolver: zodResolver(forgotPasswordEmailSchema) });
  const resetForm = useForm<ResetPasswordFormData>({ resolver: zodResolver(resetPasswordSchema) });

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  async function onSubmitEmail(data: ForgotPasswordEmailData) {
    try {
      await initiatePasswordReset(data.email);
      pendingEmail.current = data.email;
      // Same neutral messaging as the backend - never confirms or
      // denies an account exists, matching the enumeration-protection
      // decision baked into the API itself.
      toast.success("If an account exists for this email, a code has been sent");
      setStep("reset");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong. Try again.";
      toast.error(message);
    }
  }

  async function onSubmitReset(data: ResetPasswordFormData) {
    if (otp.length !== 6) {
      setOtpError("Enter the 6-digit code");
      return;
    }
    setOtpError("");
    try {
      await resetPassword(pendingEmail.current, otp, data.newPassword);
      toast.success("Password reset - please log in with your new password");
      router.push("/login");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong. Try again.";
      setOtpError(message);
    }
  }

  async function handleResend() {
    if (cooldown > 0) return;
    try {
      await initiatePasswordReset(pendingEmail.current);
      toast.success("A new code has been sent");
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setOtp("");
      setOtpError("");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong. Try again.";
      toast.error(message);
    }
  }

  return (
    <div className="min-h-[calc(100vh-117px)] flex items-center justify-center bg-sand px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-bark mb-2">
            {step === "email" ? "Forgot your password?" : "Reset your password"}
          </h1>
          <p className="font-body text-sm text-bark/60">
            {step === "email"
              ? "Enter your email and we'll send you a verification code."
              : `Enter the code sent to ${pendingEmail.current} and choose a new password.`}
          </p>
          <RootDivider className="mt-5" />
        </div>

        {step === "email" ? (
          <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">Email</label>
              <input
                type="email"
                {...emailForm.register("email")}
                className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition"
              />
              {emailForm.formState.errors.email && (
                <p className="text-red-700 text-xs mt-1">{emailForm.formState.errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={emailForm.formState.isSubmitting}
              className="mt-2 w-full py-3 bg-canopy text-sand font-body tracking-wide uppercase text-sm rounded-full hover:bg-ink transition disabled:opacity-50"
            >
              {emailForm.formState.isSubmitting ? "Sending..." : "Send Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={resetForm.handleSubmit(onSubmitReset)} className="flex flex-col items-center gap-5">
            <OtpInput
              value={otp}
              onChange={(val) => {
                setOtp(val);
                if (otpError) setOtpError("");
              }}
            />
            {otpError && <p className="text-red-700 text-xs">{otpError}</p>}

            <div className="w-full">
              <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">New Password</label>
              <PasswordInput
                {...resetForm.register("newPassword")}
                className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition"
              />
              {resetForm.formState.errors.newPassword && (
                <p className="text-red-700 text-xs mt-1">{resetForm.formState.errors.newPassword.message}</p>
              )}
            </div>

            <div className="w-full">
              <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">Confirm New Password</label>
              <PasswordInput
                {...resetForm.register("confirmNewPassword")}
                className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition"
              />
              {resetForm.formState.errors.confirmNewPassword && (
                <p className="text-red-700 text-xs mt-1">{resetForm.formState.errors.confirmNewPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={resetForm.formState.isSubmitting}
              className="w-full py-3 bg-canopy text-sand font-body tracking-wide uppercase text-sm rounded-full hover:bg-ink transition disabled:opacity-50"
            >
              {resetForm.formState.isSubmitting ? "Resetting..." : "Reset Password"}
            </button>

            {cooldown > 0 ? (
              <span className="text-sm font-body text-bark/40">Resend code in {cooldown}s</span>
            ) : (
              <button type="button" onClick={handleResend} className="text-sm font-body text-canopy hover:text-ink transition">
                Resend code
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
}