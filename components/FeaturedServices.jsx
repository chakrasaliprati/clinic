import Link from "next/link";
import ServiceCard from "./ServiceCard";

export default function FeaturedServices({ featured = [], highlights = [] }) {
  if (featured.length === 0 && highlights.length === 0) return null;

  return (
    <section className="bg-emerald-light/40 py-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-deep mb-3">Featured Services</p>
          <h2 className="font-display text-3xl md:text-4xl text-emerald-deep">Our featured specialities</h2>
        </div>

        {featured.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-6 mb-10">
            {featured.map((c) => <ServiceCard key={c.slug} condition={c} />)}
          </div>
        )}

        {highlights.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((c) => <ServiceCard key={c.slug} condition={c} />)}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full border border-emerald px-7 py-3 text-sm font-semibold text-emerald-deep hover:bg-emerald hover:text-cream transition-colors"
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
}
