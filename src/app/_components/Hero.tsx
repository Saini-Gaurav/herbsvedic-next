import Link from "next/link";
import { FaLeaf } from "react-icons/fa";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-canopy text-sand">
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-20 md:py-28 flex flex-col items-start gap-6">
        <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest bg-sand/10 border border-sand/30 rounded-full px-4 py-1.5">
          <FaLeaf className="text-turmeric" />
          Rooted in tradition, made for today
        </span>
        <h1 className="font-display text-4xl md:text-6xl leading-tight max-w-2xl">
          Ayurvedic wellness, backed by science.
        </h1>
        <p className="font-body text-sand/80 max-w-xl text-lg">
          Herbsvedic blends centuries-old Ayurvedic formulations with
          rigorous quality standards, so every bottle is as trustworthy as
          it is traditional.
        </p>
        <div className="flex flex-wrap gap-4 pt-2">
          <Link
            href="/shop"
            className="bg-turmeric text-ink font-body font-semibold px-8 py-3 rounded-full hover:bg-turmeric/90 transition"
          >
            Shop Products
          </Link>
          <Link
            href="/consult"
            className="border border-sand/40 text-sand font-body px-8 py-3 rounded-full hover:bg-sand/10 transition"
          >
            Consult an Expert
          </Link>
        </div>
      </div>
      <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-leaf/30 blur-3xl pointer-events-none" />
    </section>
  );
}