import Image from "next/image";
import Link from "next/link";
import { Phone, CalendarCheck, BadgeCheck } from "lucide-react";
import PulseLeaf from "./PulseLeaf";

export default function Hero({ site, homepage }) {
  const heading = homepage?.hero_heading || "Ayurveda that listens first, then treats.";
  const description = homepage?.hero_description ||
    `${site.doctorName} brings classical Kayachikitsa training and a modern, evidence-informed approach together, offering personalised care for chronic conditions, digestive health, skin concerns, and everyday wellness.`;
  const primaryLabel = homepage?.hero_cta_primary_label || "Book Consultation";
  const secondaryLabel = homepage?.hero_cta_secondary_label || "Call Now";

  return (
    <section className="relative overflow-hidden bg-leaf-veil">
      <div className="max-w-7xl mx-auto px-5 md:px-8 pt-14 pb-20 md:pt-20 md:pb-28 grid md:grid-cols-2 gap-12 items-center">
        <div className="motion-safe:animate-fadeUp">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-light px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-deep">
            <BadgeCheck className="w-4 h-4" /> {site.qualifications}
          </div>

          <h1 className="mt-6 font-display text-4xl md:text-5xl lg:text-[3.4rem] leading-[1.08] text-emerald-deep">
            {heading}
          </h1>

          <p className="mt-6 text-lg text-ink-soft max-w-xl leading-relaxed">{description}</p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/consultation"
              className="inline-flex items-center gap-2 rounded-full bg-emerald px-7 py-3.5 text-sm font-semibold text-cream shadow-gold hover:bg-emerald-deep transition-colors"
            >
              <CalendarCheck className="w-4 h-4" /> {primaryLabel}
            </Link>
            {site.phone && (
              <a
                href={`tel:${site.phone}`}
                className="inline-flex items-center gap-2 rounded-full border border-emerald px-7 py-3.5 text-sm font-semibold text-emerald-deep hover:bg-emerald-light transition-colors"
              >
                <Phone className="w-4 h-4" /> {secondaryLabel} {site.phoneDisplay}
              </a>
            )}
          </div>

          <div className="mt-10">
            <PulseLeaf className="w-32 h-12 text-emerald" />
          </div>
        </div>

        <div className="relative motion-safe:animate-fadeUp">
          <div className="absolute -inset-4 rounded-xl3 bg-gold/10 rotate-2" aria-hidden="true" />
          <div className="relative rounded-xl3 overflow-hidden shadow-cardHover border border-emerald-soft aspect-[4/5] bg-emerald-light">
            {site.doctorPhoto && (
              <Image
                src={site.doctorPhoto}
                alt={`${site.doctorName}, ${site.qualifications}`}
                fill
                priority
                sizes="(max-width: 768px) 90vw, 40vw"
                className="object-cover"
              />
            )}
          </div>
          {site.experienceYears && (
            <div className="absolute -bottom-6 -left-6 rounded-2xl bg-cream border border-emerald-soft shadow-card px-5 py-4 hidden sm:block">
              <p className="font-display text-2xl text-emerald-deep">{site.experienceYears}</p>
              <p className="text-xs text-ink-soft uppercase tracking-wide">Years of Experience</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
