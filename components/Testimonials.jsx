"use client";

import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

export default function Testimonials({ reviews = [] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reviews.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % reviews.length), 6000);
    return () => clearInterval(id);
  }, [reviews.length]);

  if (reviews.length === 0) return null;
  const t = reviews[index];

  return (
    <section className="max-w-5xl mx-auto px-5 md:px-8 py-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-deep mb-3">Patient Stories</p>
        <h2 className="font-display text-3xl md:text-4xl text-emerald-deep">What our patients say</h2>
      </div>

      <div className="relative rounded-xl3 bg-white border border-emerald-soft/70 shadow-card px-8 py-12 md:px-14 md:py-14 text-center">
        <Quote className="w-10 h-10 text-gold mx-auto mb-6" />
        <p className="font-display text-xl md:text-2xl text-ink leading-relaxed max-w-2xl mx-auto">
          &ldquo;{t.review_text}&rdquo;
        </p>
        <div className="flex justify-center gap-1 mt-6">
          {Array.from({ length: t.rating }).map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-gold text-gold" />
          ))}
        </div>
        <p className="mt-4 font-semibold text-emerald-deep">{t.patient_name}</p>
        {t.concern && <p className="text-sm text-ink-soft">{t.concern}</p>}

        {reviews.length > 1 && (
          <>
            <button
              aria-label="Previous testimonial"
              onClick={() => setIndex((index - 1 + reviews.length) % reviews.length)}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-light text-emerald-deep hover:bg-emerald hover:text-cream transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              aria-label="Next testimonial"
              onClick={() => setIndex((index + 1) % reviews.length)}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-light text-emerald-deep hover:bg-emerald hover:text-cream transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {reviews.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {reviews.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-emerald" : "w-2 bg-emerald-soft"}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
