import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function PageHeader({ eyebrow, title, description, breadcrumbs = [] }) {
  return (
    <section className="bg-leaf-veil border-b border-emerald-soft/70">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-14 md:py-16">
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center flex-wrap gap-1.5 text-xs text-ink-soft mb-5">
            {breadcrumbs.map((b, i) => (
              <span key={b.href} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="w-3 h-3" />}
                {i === breadcrumbs.length - 1 ? (
                  <span className="text-emerald-deep font-medium">{b.name}</span>
                ) : (
                  <Link href={b.href} className="hover:text-emerald-deep">{b.name}</Link>
                )}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-deep mb-3">{eyebrow}</p>
        )}
        <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-emerald-deep max-w-3xl">{title}</h1>
        {description && <p className="mt-4 text-ink-soft max-w-2xl leading-relaxed">{description}</p>}
      </div>
    </section>
  );
}
