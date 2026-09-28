import PageHeader from "@/components/PageHeader";
import ServiceCard from "@/components/ServiceCard";
import { BreadcrumbSchema } from "@/components/Schema";
import { getAllSpecialities, getFeaturedSpecialities, getSiteData, getSeoSettings } from "@/lib/site-data";

export const revalidate = 60;

export async function generateMetadata() {
  const seo = await getSeoSettings("services");
  return {
    title: seo?.title || "Ayurvedic Treatment Services",
    description: seo?.meta_description || "Explore Ayurvedic consultation and treatment services, including psoriasis, piles, digestive disorders, arthritis, PCOS, and more.",
    alternates: { canonical: seo?.canonical_url || "/services" },
  };
}

const breadcrumbs = [{ name: "Home", href: "/" }, { name: "Services", href: "/services" }];

export default async function ServicesPage() {
  const [all, featured, site] = await Promise.all([getAllSpecialities(), getFeaturedSpecialities(), getSiteData()]);

  const groups = {};
  for (const s of all) {
    if (s.is_featured) continue;
    if (!groups[s.group_name]) groups[s.group_name] = [];
    groups[s.group_name].push(s);
  }

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <PageHeader
        eyebrow="Our Services"
        title="Ayurvedic care for every stage of health"
        description={`From featured specialities to everyday wellness, every service below is led by a personalised consultation with ${site.doctorName}.`}
        breadcrumbs={breadcrumbs}
      />

      <section className="max-w-7xl mx-auto px-5 md:px-8 py-14">
        {featured.length > 0 && (
          <>
            <h2 className="font-display text-2xl text-emerald-deep mb-6">Featured Specialities</h2>
            <div className="grid sm:grid-cols-2 gap-6 mb-16">
              {featured.map((c) => <ServiceCard key={c.slug} condition={c} />)}
            </div>
          </>
        )}

        {Object.entries(groups).map(([group, items]) => (
          <div key={group} className="mb-16">
            <h2 className="font-display text-2xl text-emerald-deep mb-6">{group}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((c) => <ServiceCard key={c.slug} condition={c} />)}
            </div>
          </div>
        ))}

        {all.length === 0 && (
          <p className="text-center text-ink-soft py-10">Services are being updated. Please check back shortly.</p>
        )}
      </section>
    </>
  );
}
