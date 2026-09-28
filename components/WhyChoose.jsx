import { HeartHandshake, FlaskConical, UserCog, ShieldCheck } from "lucide-react";

const iconMap = { HeartHandshake, FlaskConical, UserCog, ShieldCheck };

const defaultCards = [
  { icon: "HeartHandshake", title: "Holistic Ayurvedic Care", text: "Every plan looks beyond the symptom, addressing digestion, routine, and root imbalance together." },
  { icon: "FlaskConical", title: "Evidence-Informed Practice", text: "Classical Ayurvedic principles applied with modern clinical rigor and clear, honest communication." },
  { icon: "UserCog", title: "Personalised Treatment Plans", text: "No generic protocols. Your constitution, history, and goals shape every recommendation." },
  { icon: "ShieldCheck", title: "Patient-First Approach", text: "Unhurried consultations, transparent explanations, and care coordinated with your existing treatment." },
];

export default function WhyChoose({ site, homepage }) {
  const title = homepage?.why_choose_title || "Care built around you, not a template";
  const description = homepage?.why_choose_description ||
    `${site.doctorName} combines an M.D. in Kayachikitsa with BAMS training to offer a considered, personal approach to every consultation.`;
  const cards = (homepage?.why_choose_cards?.length > 0 ? homepage.why_choose_cards : defaultCards)
    .filter((c) => c.enabled !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 py-20">
      <div className="max-w-2xl mb-12">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-deep mb-3">Why Patients Choose Us</p>
        <h2 className="font-display text-3xl md:text-4xl text-emerald-deep">{title}</h2>
        <p className="mt-4 text-ink-soft leading-relaxed">{description}</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = iconMap[card.icon] || HeartHandshake;
          return (
            <div
              key={card.title}
              className="rounded-2xl bg-white border border-emerald-soft/70 p-6 shadow-card hover:shadow-cardHover hover:-translate-y-1 transition-all duration-300"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-light text-emerald-deep mb-4">
                <Icon className="w-5 h-5" />
              </span>
              <h3 className="font-display text-lg text-emerald-deep mb-2">{card.title}</h3>
              <p className="text-sm text-ink-soft leading-relaxed">{card.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
