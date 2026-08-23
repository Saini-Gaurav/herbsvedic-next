import Link from "next/link";
import RootDivider from "@/components/ui/RootDivider";

const VALUES = [
  {
    title: "Rooted in Tradition",
    description:
      "Every formulation draws on centuries-old Ayurvedic principles, not a modern shortcut wearing an old name.",
  },
  {
    title: "Radically Transparent",
    description:
      "Every ingredient is listed, every source is known. If we wouldn't explain it to your face, it doesn't go in the bottle.",
  },
  {
    title: "Slow, On Purpose",
    description:
      "Ayurveda was never meant to be rushed. We formulate, test, and refine at the pace the tradition actually asks for.",
  },
  {
    title: "For Real Bodies",
    description:
      "No one-size-fits-all promises. Our guidance starts with a real conversation about your constitution, not a generic label.",
  },
];

export default function AboutUsPage() {
  return (
    <div className="bg-sand">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-5 md:px-8 pt-16 pb-14 md:pt-24 md:pb-20 text-center">
        <span className="inline-block mb-5 font-body text-[11px] uppercase tracking-[0.25em] text-canopy/70">
          Our Story
        </span>
        <h1 className="font-display text-4xl md:text-6xl text-bark leading-[1.1] max-w-3xl mx-auto">
          Wellness the way it was always meant to be practiced
        </h1>
        <p className="mt-6 font-body text-base md:text-lg text-bark/60 max-w-xl mx-auto leading-relaxed">
          Herbsvedic began with a simple frustration: wellness shelves full of
          products borrowing Ayurveda&apos;s name, but none of its substance.
          We set out to build the alternative.
        </p>
        <RootDivider className="mt-8" />
      </section>

      {/* Story split - image + text */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 py-14 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className="order-2 md:order-1">
          <span className="inline-block mb-4 font-body text-[11px] uppercase tracking-[0.25em] text-canopy/70">
            Where It Started
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-bark leading-tight mb-5">
            A return to what actually works
          </h2>
          <p className="font-body text-sm md:text-base text-bark/70 leading-7 mb-4">
            Ayurveda isn&apos;t a trend to us — it&apos;s a five-thousand-year-old
            system of understanding the body that most modern wellness brands
            only borrow the aesthetics of. We wanted to build something that
            actually honored the depth of that tradition.
          </p>
          <p className="font-body text-sm md:text-base text-bark/70 leading-7">
            That meant working directly with practitioners, sourcing
            ingredients the way they were meant to be sourced, and refusing to
            cut corners just because a shortcut would ship faster.
          </p>
        </div>
        <div className="order-1 md:order-2 aspect-4/3 rounded-2xl overflow-hidden bg-canopy/10">
          <img
            src="/about-story.jpg"
            alt="Ayurvedic ingredients being prepared"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Values grid */}
      <section className="bg-canopy py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block mb-4 font-body text-[11px] uppercase tracking-[0.25em] text-turmeric">
              What We Stand For
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-sand leading-tight">
              Four things we never compromise on
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {VALUES.map((value, index) => (
              <div
                key={value.title}
                className="bg-sand/6 border border-sand/15 rounded-2xl p-6 md:p-7"
              >
                <span className="font-display text-3xl text-turmeric">
                  0{index + 1}
                </span>
                <h3 className="font-display text-lg text-sand mt-4 mb-2">
                  {value.title}
                </h3>
                <p className="font-body text-sm text-sand/70 leading-6">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Second story split - reversed image side, for visual rhythm */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 py-14 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className="aspect-4/3 rounded-2xl overflow-hidden bg-canopy/10">
          <img
            src="/about-founder.jpg"
            alt="Ayurvedic consultation in progress"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <span className="inline-block mb-4 font-body text-[11px] uppercase tracking-[0.25em] text-canopy/70">
            Our Promise
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-bark leading-tight mb-5">
            Guidance, not just a checkout button
          </h2>
          <p className="font-body text-sm md:text-base text-bark/70 leading-7 mb-4">
            We never wanted to just be another shelf of bottles. Every product
            we make is paired with the option to actually talk to someone —
            a real consultation, not a quiz that spits out a recommendation.
          </p>
          <p className="font-body text-sm md:text-base text-bark/70 leading-7 mb-8">
            Because Ayurveda was never meant to be a solo decision made in a
            checkout flow. It was always meant to be a conversation.
          </p>
          <Link
            href="/consult"
            className="inline-block px-6 py-3 bg-canopy text-sand font-body tracking-wide uppercase text-sm rounded-full hover:bg-ink transition"
          >
            Book a Consultation
          </Link>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="max-w-4xl mx-auto px-5 md:px-8 py-16 md:py-24 text-center">
        <h2 className="font-display text-3xl md:text-4xl text-bark leading-tight mb-5">
          Ready to start your own wellness journey?
        </h2>
        <p className="font-body text-sm md:text-base text-bark/60 max-w-lg mx-auto mb-8 leading-relaxed">
          Explore the full range, formulated with the same care we&apos;d want
          for our own families.
        </p>
        <Link
          href="/shop"
          className="inline-block px-8 py-3.5 bg-turmeric text-ink font-body tracking-wide uppercase text-sm font-semibold rounded-full hover:bg-bark hover:text-sand transition"
        >
          Browse the Shop
        </Link>
      </section>
    </div>
  );
}