import Link from "next/link";

export default function ConsultCTA() {
  return (
    <section className="bg-ink text-sand">
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-16 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="font-display text-3xl mb-2">Not sure where to start?</h2>
          <p className="font-body text-sand/70 max-w-md">
            Talk to a certified Ayurvedic doctor and get a personalized
            routine built around your dosha and your goals.
          </p>
        </div>
        <Link
          href="/consult"
          className="bg-turmeric text-ink font-body font-semibold px-8 py-3 rounded-full hover:bg-turmeric/90 transition whitespace-nowrap"
        >
          Book a Consultation
        </Link>
      </div>
    </section>
  );
}