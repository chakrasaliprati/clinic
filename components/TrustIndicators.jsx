import { Award, Users, Stethoscope } from "lucide-react";

const defaultStats = [
  { label: "Years of Experience", value: "10+" },
  { label: "Happy Patients", value: "5,000+" },
  { label: "Consultation Available", value: "Online" },
];

const icons = [Award, Users, Stethoscope];

export default function TrustIndicators({ statistics }) {
  const enabled = (statistics && statistics.length > 0)
    ? statistics.filter((s) => s.enabled !== false).sort((a, b) => (a.order || 0) - (b.order || 0))
    : defaultStats;

  return (
    <section className="border-y border-emerald-soft bg-cream">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {enabled.map((item, i) => {
          const Icon = icons[i % icons.length];
          return (
            <div key={item.label} className="flex items-center gap-4 rounded-2xl bg-emerald-light/50 px-6 py-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald text-cream">
                <Icon className="w-5 h-5" />
              </span>
              <div>
                <p className="font-display text-2xl text-emerald-deep">{item.value}</p>
                <p className="text-sm text-ink-soft">{item.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
