import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import ConsultationForm from "./ConsultationForm";
import ConsultationTypes from "./ConsultationTypes";
import { BreadcrumbSchema } from "@/components/Schema";
import { getSiteData, getConsultationSettings, getSeoSettings } from "@/lib/site-data";

export const revalidate = 60;

export async function generateMetadata() {
  const [site, seo] = await Promise.all([getSiteData(), getSeoSettings("consultation")]);
  return {
    title: seo?.title || `Book a Consultation | ${site.doctorName}`,
    description: seo?.meta_description || `Book a consultation with ${site.doctorName}, ${site.qualifications}.`,
    alternates: { canonical: seo?.canonical_url || "/consultation" },
  };
}

const breadcrumbs = [{ name: "Home", href: "/" }, { name: "Consultation", href: "/consultation" }];

export default async function ConsultationPage() {
  const [site, settings] = await Promise.all([getSiteData(), getConsultationSettings()]);

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <PageHeader
        eyebrow="Book Your Visit"
        title={`Book a consultation with ${site.doctorName}`}
        description="Choose how you'd like to connect, or fill in the form below and our team will confirm your appointment."
        breadcrumbs={breadcrumbs}
      />

      <section className="max-w-7xl mx-auto px-5 md:px-8 py-14">
        <ConsultationTypes settings={settings} />
      </section>

      <section id="appointment-form" className="max-w-2xl mx-auto px-5 md:px-8 pb-20 scroll-mt-24">
        <Suspense fallback={null}>
          <ConsultationForm clinicEnabled={Boolean(settings?.clinic_enabled)} onlineEnabled={settings?.online_enabled ?? true} />
        </Suspense>
      </section>
    </>
  );
}
