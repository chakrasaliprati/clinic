"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function FAQAccordion({ faqs, title = "Frequently Asked Questions" }) {
  const [open, setOpen] = useState(0);

  return (
    <section className="max-w-3xl mx-auto px-5 md:px-8 py-16">
      <h2 className="font-display text-3xl text-emerald-deep text-center mb-10">{title}</h2>
      <div className="space-y-3">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className="rounded-2xl border border-emerald-soft/70 bg-white overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                aria-expanded={isOpen}
              >
                <span className="font-medium text-ink">{f.q}</span>
                <span className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-light text-emerald-deep">
                  {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </span>
              </button>
              {isOpen && (
                <div className="px-6 pb-5 text-sm text-ink-soft leading-relaxed">{f.a}</div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
