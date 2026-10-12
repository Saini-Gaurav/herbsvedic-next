"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { getProfile, updateProfile } from "@/lib/api/profile";
import { profileSchema, ProfileFormData } from "@/lib/validation/profile.schema";
import { Profile } from "@/types/profile";
import { ApiError } from "@/lib/apiClient";

const inputClass =
  "w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition";
const labelClass = "block text-xs font-body uppercase tracking-wide text-bark/60 mb-1";

export default function ProfilePage() {
  const { refreshUser } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormData>({ resolver: zodResolver(profileSchema) });

  useEffect(() => {
    getProfile()
      .then(({ profile }) => {
        setProfile(profile);
        reset({ name: profile.name, phone: profile.phone });
      })
      .catch(() => toast.error("Couldn't load your profile"))
      .finally(() => setIsLoading(false));
  }, [reset]);

  async function onSubmit(data: ProfileFormData) {
    try {
      const { profile: updated } = await updateProfile(data);
      setProfile(updated);
      reset({ name: updated.name, phone: updated.phone });
      // The save already worked, so a failed refresh isn't worth an error toast
      await refreshUser().catch(() => {});
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't update your profile");
    }
  }

  if (isLoading) {
    return <p className="font-body text-sm text-bark/50">Loading your profile...</p>;
  }

  if (!profile) {
    return <p className="font-body text-sm text-bark/50">We couldn&apos;t load your profile.</p>;
  }

  return (
    <div className="max-w-md">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-full bg-canopy text-sand flex items-center justify-center font-display text-xl">
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-body font-semibold text-bark">{profile.name}</p>
          <p className="font-body text-xs text-bark/50">
            Member since{" "}
            {new Date(profile.createdAt).toLocaleDateString("en-IN", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className={labelClass}>Full Name</label>
          <input type="text" {...register("name")} className={inputClass} />
          {errors.name && <p className="text-red-700 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Email</label>
          <input
            type="email"
            value={profile.email}
            readOnly
            disabled
            className={`${inputClass} opacity-60 cursor-not-allowed`}
          />
          <p className="text-xs text-bark/40 mt-1">Your email can&apos;t be changed here.</p>
        </div>

        <div>
          <label className={labelClass}>Phone Number</label>
          <input type="tel" {...register("phone")} className={inputClass} />
          {errors.phone && <p className="text-red-700 text-xs mt-1">{errors.phone.message}</p>}
        </div>

        <button
          type="submit"
          disabled={!isDirty || isSubmitting}
          className="mt-2 w-full sm:w-auto sm:self-start px-8 py-3 bg-canopy text-sand font-body tracking-wide uppercase text-sm rounded-full hover:bg-ink transition disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}