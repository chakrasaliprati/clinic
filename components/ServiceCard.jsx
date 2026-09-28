import Link from "next/link";
import { ArrowRight, CalendarCheck } from "lucide-react";
import Icon from "./Icon";

export default function ServiceCard({ condition }) {
  const href = condition.hub_path || condition.hub || `/services/${condition.slug}`;
  return (
    <div className="group flex flex-col rounded-2xl bg-white border border-emerald-soft/70 p-6 shadow-card hover:shadow-cardHover hover:-translate-y-1 transition-all duration-300">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-light text-emerald-deep mb-4 group-hover:bg-emerald group-hover:text-cream transition-colors">
        <Icon name={condition.icon} />
      </span>
      <h3 className="font-display text-lg text-emerald-deep mb-1.5">{condition.name}</h3>
      <p className="text-sm text-ink-soft leading-relaxed mb-5 flex-1">{condition.short_description || condition.shortDescription}</p>
      <div className="flex items-center gap-4 text-sm font-semibold">
        <Link href={href} className="inline-flex items-center gap-1 text-emerald-deep hover:text-gold-deep">
          Learn More <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link href="/consultation" className="inline-flex items-center gap-1 text-gold-deep hover:text-emerald-deep">
          <CalendarCheck className="w-3.5 h-3.5" /> Book
        </Link>
      </div>
    </div>
  );
}
