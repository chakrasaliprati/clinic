import PageHeader from "@/components/PageHeader";
import ContactSection from "@/components/ContactSection";
import { BreadcrumbSchema } from "@/components/Schema";
import { getSiteData, getSeoSettings } from "@/lib/site-data";

export const revalidate = 60;

export async function generateMetadata() {
  const [site, seo] = await Promise.all([getSiteData(), getSeoSettings("contact")]);
  return {
    title: seo?.title || `Contact Us | ${site.clinicName}`,
    description: seo?.meta_description || `Get in touch with ${site.clinicName} — phone, WhatsApp, email, and consultation timings.`,
    alternates: { canonical: seo?.canonical_url || "/contact" },
  };
}

const breadcrumbs = [{ name: "Home", href: "/" }, { name: "Contact", href: "/contact" }];

export default async function ContactPage() {
  const site = await getSiteData();
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <PageHeader
        eyebrow="We'd Love to Hear From You"
        title="Contact the clinic"
        description="Reach out for appointments or general queries."
        breadcrumbs={breadcrumbs}
      />
      <ContactSection site={site} />
    </>
  );
}
