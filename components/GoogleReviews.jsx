import { Star } from "lucide-react";

export default function GoogleReviews({ site }) {
  if (!site.googleReviewsEnabled) return null;
  return (
    <section className="bg-white border-y border-emerald-soft/70">
      <div className="max-w-4xl mx-auto px-5 md:px-8 py-14 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-deep mb-3">Verified on Google</p>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="font-display text-4xl text-emerald-deep">{site.googleRating}</span>
          <div className="flex flex-col items-start">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-gold text-gold" />
              ))}
            </div>
            <span className="text-xs text-ink-soft">
              {site.googleReviewCount > 0 ? `Based on ${site.googleReviewCount} patient reviews on Google` : "Based on patient reviews on Google"}
            </span>
          </div>
        </div>
        {site.googleReviewUrl && (
          <a
            href={site.googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-sm font-semibold text-emerald-deep underline underline-offset-4 hover:text-gold-deep"
          >
            Read reviews on Google
          </a>
        )}
      </div>
    </section>
  );
}
