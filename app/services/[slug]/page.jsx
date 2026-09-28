import { notFound, redirect } from "next/navigation";
import SpecialityPageContent from "@/components/SpecialityPageContent";
import { getSpecialityBySlug, getSiteData } from "@/lib/site-data";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateMetadata({ params }) {
  const speciality = await getSpecialityBySlug(params.slug);
  if (!speciality) return {};
  return {
    title: speciality.seo_title || `${speciality.name} Treatment | Ayurvedic Care`,
    description: speciality.meta_description || speciality.short_description,
    alternates: { canonical: `/services/${speciality.slug}` },
  };
}

export default async function ServiceDetailPage({ params }) {
  const speciality = await getSpecialityBySlug(params.slug);
  if (!speciality) return notFound();

  // Featured specialities (Psoriasis, Piles) live at their own dedicated
  // hub URLs — redirect there to avoid duplicate content.
  if (speciality.is_featured && speciality.hub_path) {
    redirect(speciality.hub_path);
  }

  const site = await getSiteData();
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: speciality.name, href: `/services/${speciality.slug}` },
  ];

  return <SpecialityPageContent speciality={speciality} site={site} breadcrumbs={breadcrumbs} />;
}
