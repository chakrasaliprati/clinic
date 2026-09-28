import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, ArrowRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ActionButtons from "@/components/ActionButtons";
import FAQAccordion from "@/components/FAQAccordion";
import { FAQSchema, BreadcrumbSchema } from "@/components/Schema";
import { getBlogPostBySlug, getRelatedBlogPosts, getSiteData } from "@/lib/site-data";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateMetadata({ params }) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: post.seo_title || post.title,
    description: post.meta_description || post.short_description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title: post.seo_title || post.title, description: post.meta_description || post.short_description, type: "article", publishedTime: post.published_at },
  };
}

export default async function BlogPostPage({ params }) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return notFound();

  const [site, related] = await Promise.all([getSiteData(), getRelatedBlogPosts(post.id, post.category)]);
  const faqs = (post.faqs || []).map((f) => ({ q: f.q, a: f.a }));
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: post.title, href: `/blog/${post.slug}` },
  ];
  const paragraphs = String(post.content || "").split(/\n\s*\n/).filter(Boolean);

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      {faqs.length > 0 && <FAQSchema faqs={faqs} />}
      <PageHeader eyebrow={post.category} title={post.title} breadcrumbs={breadcrumbs} />

      <article className="max-w-3xl mx-auto px-5 md:px-8 py-14">
        <div className="flex items-center gap-4 text-sm text-ink-soft mb-8">
          {post.published_at && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(post.published_at).toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })}
            </span>
          )}
          <span>By {post.author}</span>
        </div>

        <div className="space-y-6 text-ink leading-relaxed">
          {paragraphs.map((para, i) => <p key={i} className="text-[1.05rem] whitespace-pre-line">{para}</p>)}
        </div>

        <div className="mt-10 rounded-2xl bg-emerald-light/50 p-6 text-sm text-ink-soft">
          Written by {post.author}. This article is for educational purposes and does not replace individual medical advice —
          please <Link href="/consultation" className="text-emerald-deep font-semibold underline underline-offset-2">book a consultation</Link> for guidance specific to you.
        </div>

        <div className="mt-10"><ActionButtons site={site} /></div>
      </article>

      {faqs.length > 0 && <FAQAccordion faqs={faqs} />}

      {related.length > 0 && (
        <section className="bg-emerald-light/40 py-16">
          <div className="max-w-5xl mx-auto px-5 md:px-8">
            <h2 className="font-display text-2xl text-emerald-deep mb-8">Related Articles</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {related.map((r) => (
                <Link key={r.id} href={`/blog/${r.slug}`} className="group rounded-2xl bg-white border border-emerald-soft/70 p-6 shadow-card hover:shadow-cardHover transition-all">
                  <h3 className="font-display text-lg text-emerald-deep mb-2">{r.title}</h3>
                  <p className="text-sm text-ink-soft mb-3">{r.short_description}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-deep group-hover:text-gold-deep">Read Article <ArrowRight className="w-3.5 h-3.5" /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
