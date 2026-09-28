import { notFound } from "next/navigation";
import ServiceCard from "@/components/ServiceCard";
import SpecialityPageContent from "@/components/SpecialityPageContent";
import { getSpecialityBySlug, getAllSpecialities, getSiteData } from "@/lib/site-data";

export const revalidate = 60;

export async function generateMetadata() {
  const speciality = await getSpecialityBySlug("psoriasis");
  if (!speciality) return {};
  return {
    title: speciality.seo_title || "Psoriasis Treatment | Best Psoriasis Doctor",
    description: speciality.meta_description || speciality.short_description,
    alternates: { canonical: "/psoriasis-treatment" },
  };
}

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Psoriasis & Skin Conditions", href: "/psoriasis-treatment" },
];

export default async function PsoriasisTreatmentPage() {
  const [speciality, site, all] = await Promise.all([
    getSpecialityBySlug("psoriasis"),
    getSiteData(),
    getAllSpecialities(),
  ]);
  if (!speciality) return notFound();

  const related = all.filter((s) => s.group_name === speciality.group_name && s.slug !== speciality.slug);

  const relatedSection = related.length > 0 && (
    <section className="bg-emerald-light/40 py-16">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <h2 className="font-display text-3xl text-emerald-deep text-center mb-10">Related Skin Conditions We Treat</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {related.map((c) => <ServiceCard key={c.slug} condition={c} />)}
        </div>
      </div>
    </section>
  );

  return (
    <SpecialityPageContent
      speciality={speciality}
      site={site}
      breadcrumbs={breadcrumbs}
      titleOverride="Psoriasis Treatment"
      extra={relatedSection}
    />
  );
}
