"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { FiMail, FiPhone, FiMapPin, FiClock } from "react-icons/fi";
import { contactSchema, ContactFormData } from "@/lib/validation/contact.schema";
import RootDivider from "@/components/ui/RootDivider";
import { ApiError } from "@/lib/apiClient";
import { submitContactForm } from "@/lib/api/notification.api";

const CONTACT_DETAILS = [
  { icon: FiMail, label: "Email", value: "support@herbsvedicwellness.com" },
  { icon: FiPhone, label: "Phone", value: "6901308316" },
  { icon: FiMapPin, label: "Address", value: "Shop no.1, Rudaram Tower, Station Road, Sikar (Raj) 332001" },
  { icon: FiClock, label: "Hours", value: "Mon – Sat, 10am – 7pm" },
];

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) });

    async function onSubmit(data: ContactFormData) {
    try {
      await submitContactForm(data);
      toast.success("Message sent - we'll get back to you soon!");
      reset();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong. Try again.";
      toast.error(message);
    }
  }

  return (
    <div className="bg-sand">
      <section className="max-w-4xl mx-auto px-5 md:px-8 pt-16 pb-10 md:pt-24 md:pb-14 text-center">
        <span className="inline-block mb-5 font-body text-[11px] uppercase tracking-[0.25em] text-canopy/70">
          Get In Touch
        </span>
        <h1 className="font-display text-4xl md:text-5xl text-bark leading-tight">
          We&apos;d love to hear from you
        </h1>
        <p className="mt-5 font-body text-base text-bark/60 max-w-lg mx-auto leading-relaxed">
          Questions about a product, an order, or just want to talk
          Ayurveda? Reach out - a real person reads every message.
        </p>
        <RootDivider className="mt-7" />
      </section>

      <section className="max-w-5xl mx-auto px-5 md:px-8 pb-20 md:pb-28 grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
        {/* Contact details - narrower column on desktop */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {CONTACT_DETAILS.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-4 bg-white/60 border border-bark/10 rounded-2xl p-5">
              <div className="w-10 h-10 rounded-full bg-canopy/10 text-canopy flex items-center justify-center shrink-0">
                <Icon size={18} />
              </div>
              <div>
                <p className="font-body text-xs uppercase tracking-wide text-bark/40 mb-1">{label}</p>
                <p className="font-body text-sm text-bark leading-snug">{value}</p>
              </div>
            </div>
          ))}

          <div className="rounded-2xl overflow-hidden border border-bark/10 mt-2">
            <iframe
              title="Herbsvedic location"
              src="https://www.google.com/maps?q=Sikar+Rajasthan+India&output=embed"
              className="w-full h-56 border-0"
              loading="lazy"
            />
          </div>
        </div>

        {/* Form - wider column */}
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-3 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">Name</label>
              <input
                type="text"
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
          </div>

          <div>
            <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">Subject</label>
            <input
              type="text"
              {...register("subject")}
              className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition"
            />
            {errors.subject && <p className="text-red-700 text-xs mt-1">{errors.subject.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-body uppercase tracking-wide text-bark/60 mb-1">Message</label>
            <textarea
              rows={6}
              {...register("message")}
              className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-transparent font-body text-sm focus:outline-none focus:border-canopy transition resize-none"
            />
            {errors.message && <p className="text-red-700 text-xs mt-1">{errors.message.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full sm:w-auto sm:self-start px-8 py-3 bg-canopy text-sand font-body tracking-wide uppercase text-sm rounded-full hover:bg-ink transition disabled:opacity-50"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </section>
    </div>
  );
}