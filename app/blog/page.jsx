import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { BreadcrumbSchema } from "@/components/Schema";
import { getPublishedBlogPosts, getSeoSettings } from "@/lib/site-data";

export const revalidate = 60;

export async function generateMetadata() {
  const seo = await getSeoSettings("blog");
  return {
    title: seo?.title || "Ayurveda Blog",
    description: seo?.meta_description || "Practical, Ayurveda-informed articles on skin, digestion, joints, metabolic health, and lifestyle.",
    alternates: { canonical: seo?.canonical_url || "/blog" },
  };
}

const breadcrumbs = [{ name: "Home", href: "/" }, { name: "Blog", href: "/blog" }];

export default async function BlogIndexPage() {
  const posts = await getPublishedBlogPosts();
  const sorted = [...posts].sort((a, b) => Number(b.is_featured) - Number(a.is_featured));

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <PageHeader
        eyebrow="Ayurveda Blog"
        title="Practical guidance, rooted in Ayurveda"
        description="Articles written to help you understand your condition and what an Ayurvedic approach actually involves."
        breadcrumbs={breadcrumbs}
      />

      <section className="max-w-7xl mx-auto px-5 md:px-8 py-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {sorted.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group flex flex-col rounded-2xl bg-white border border-emerald-soft/70 shadow-card hover:shadow-cardHover hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <div className="h-40 bg-gradient-to-br from-emerald-light to-gold-light flex items-center justify-center">
              <span className="font-display text-sm text-emerald-deep/60 uppercase tracking-wide">{post.category}</span>
            </div>
            <div className="p-6 flex flex-col flex-1">
              {post.published_at && (
                <div className="flex items-center gap-1 text-xs text-ink-soft mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(post.published_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                </div>
              )}
              <h2 className="font-display text-lg text-emerald-deep mb-2 leading-snug">{post.title}</h2>
              <p className="text-sm text-ink-soft leading-relaxed flex-1">{post.short_description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-emerald-deep group-hover:text-gold-deep">
                Read Article <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
        {sorted.length === 0 && <p className="col-span-full text-center text-ink-soft py-10">New articles are coming soon.</p>}
      </section>
    </>
  );
}
