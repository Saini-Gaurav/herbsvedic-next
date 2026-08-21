"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const PREMIUM_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

const faqs = [
  {
    question: "Are your herbal products safe to use daily?",
    answer:
      "Yes. Our products are made from natural ingredients and are free from harmful chemicals or additives. They work best when used as recommended for your body type.",
  },
  {
    question: "How long does it take to see results with Ayurvedic medicines?",
    answer:
      "Results vary by person and concern. Most people begin to notice improvements within 2-4 weeks of consistent use.",
  },
  {
    question: "Can I take herbal supplements along with allopathic medicines?",
    answer:
      "In most cases, yes, but we always recommend checking with your healthcare provider before combining treatments.",
  },
  {
    question: "Are your products certified and tested for quality?",
    answer:
      "Yes. All our formulations go through quality checks for purity and consistency before they reach you.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="max-w-3xl mx-auto px-4 md:px-10 py-16">
      <h2 className="font-display text-3xl text-bark text-center mb-10">
        Frequently Asked Questions
      </h2>
      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={faq.question}
              className="border border-bark/10 rounded-xl overflow-hidden bg-white"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between px-5 py-4 text-left font-body font-medium text-bark"
                aria-expanded={isOpen}
              >
                {faq.question}
                <FiChevronDown
                  className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className="grid transition-[grid-template-rows]"
                style={{
                  gridTemplateRows: isOpen ? "1fr" : "0fr",
                  transitionDuration: "350ms",
                  transitionTimingFunction: PREMIUM_EASE,
                }}
              >
                <div className="overflow-hidden">
                  <p
                    className={`px-5 pb-4 text-sm text-bark/70 font-body transition-opacity ${
                      isOpen ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                      transitionDuration: "250ms",
                      transitionDelay: isOpen ? "100ms" : "0ms",
                      transitionTimingFunction: PREMIUM_EASE,
                    }}
                  >
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
