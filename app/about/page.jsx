import Image from "next/image";
import { GraduationCap, Stethoscope, Leaf, Languages } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ActionButtons from "@/components/ActionButtons";
import { BreadcrumbSchema } from "@/components/Schema";
import { getSiteData, getAboutPageData, getDoctorProfile, getSeoSettings } from "@/lib/site-data";

export const revalidate = 60;

export async function generateMetadata() {
  const [site, seo] = await Promise.all([getSiteData(), getSeoSettings("about")]);
  return {
    title: seo?.title || `About ${site.doctorName} | ${site.qualifications}`,
    description: seo?.meta_description || `Learn about ${site.doctorName}'s qualifications, experience, and holistic, evidence-informed approach to Ayurvedic treatment.`,
    alternates: { canonical: seo?.canonical_url || "/about" },
  };
}

const breadcrumbs = [{ name: "Home", href: "/" }, { name: "About Doctor", href: "/about" }];

export default async function AboutPage() {
  const [site, about, profile] = await Promise.all([getSiteData(), getAboutPageData(), getDoctorProfile()]);

  const qualifications = about?.qualifications?.length > 0
    ? about.qualifications
    : ["BAMS — Bachelor of Ayurvedic Medicine and Surgery", "MD (Kayachikitsa) — Ayurvedic General Medicine"];
  const expertise = about?.areas_of_expertise?.length > 0 ? about.areas_of_expertise : profile?.areas_of_expertise || [];
  const sections = (about?.sections || []).filter((s) => s.enabled !== false).sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <PageHeader
        eyebrow={about?.heading || "About the Doctor"}
        title={site.doctorName}
        description={site.qualifications}
        breadcrumbs={breadcrumbs}
      />

      <section className="max-w-7xl mx-auto px-5 md:px-8 py-16 grid md:grid-cols-5 gap-12 items-start">
        <div className="md:col-span-2">
          <div className="relative rounded-xl3 overflow-hidden shadow-card border border-emerald-soft aspect-[4/5] bg-emerald-light">
            {site.doctorPhoto && (
              <Image src={site.doctorPhoto} alt={`${site.doctorName}, ${site.qualifications}`} fill sizes="(max-width: 768px) 90vw, 35vw" className="object-cover" />
            )}
          </div>
        </div>

        <div className="md:col-span-3 space-y-8">
          {(about?.introduction || profile?.short_intro) && (
            <p className="text-lg text-ink-soft leading-relaxed">{about?.introduction || profile?.short_intro}</p>
          )}

          {(about?.biography || profile?.about_biography) && (
            <div className="space-y-4 text-ink-soft leading-relaxed">
              {(about?.biography || profile?.about_biography).split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>)}
            </div>
          )}

          <div>
            <h2 className="font-display text-2xl text-emerald-deep mb-3 flex items-center gap-2">
              <GraduationCap className="w-6 h-6" /> Educational Qualifications
            </h2>
            <ul className="space-y-2 text-ink-soft leading-relaxed list-disc list-inside">
              {qualifications.map((q) => <li key={q}>{q}</li>)}
            </ul>
          </div>

          {(about?.experience || site.experienceYears) && (
            <div>
              <h2 className="font-display text-2xl text-emerald-deep mb-3 flex items-center gap-2">
                <Stethoscope className="w-6 h-6" /> Medical Experience
              </h2>
              <p className="text-ink-soft leading-relaxed">
                {about?.experience || `${site.experienceYears} years of clinical practice.`}
              </p>
            </div>
          )}

          {expertise.length > 0 && (
            <div>
              <h2 className="font-display text-2xl text-emerald-deep mb-3 flex items-center gap-2">
                <Leaf className="w-6 h-6" /> Areas of Expertise
              </h2>
              <ul className="flex flex-wrap gap-2">
                {expertise.map((e) => (
                  <li key={e} className="rounded-full bg-emerald-light px-3.5 py-1.5 text-sm text-emerald-deep">{e}</li>
                ))}
              </ul>
            </div>
          )}

          {profile?.languages?.length > 0 && (
            <p className="text-sm text-ink-soft flex items-center gap-2">
              <Languages className="w-4 h-4" /> Languages: {profile.languages.join(", ")}
            </p>
          )}

          {about?.treatment_philosophy && (
            <div>
              <h2 className="font-display text-2xl text-emerald-deep mb-3">Philosophy of Treatment</h2>
              <p className="text-ink-soft leading-relaxed">{about.treatment_philosophy}</p>
            </div>
          )}

          {about?.patient_care_philosophy && (
            <div>
              <h2 className="font-display text-2xl text-emerald-deep mb-3">Patient-Care Philosophy</h2>
              <p className="text-ink-soft leading-relaxed">{about.patient_care_philosophy}</p>
            </div>
          )}
        </div>
      </section>

      {sections.length > 0 && (
        <section className="bg-emerald-light/40 py-16">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <h2 className="font-display text-3xl text-emerald-deep text-center mb-10">Our Approach to Care</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sections.map((s) => (
                <div key={s.title} className="rounded-2xl bg-white border border-emerald-soft/70 p-6 shadow-card">
                  <h3 className="font-display text-lg text-emerald-deep mb-2">{s.title}</h3>
                  <p className="text-sm text-ink-soft leading-relaxed">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="max-w-3xl mx-auto px-5 md:px-8 py-16 text-center">
        <h2 className="font-display text-2xl text-emerald-deep mb-4">{about?.cta_text || "Ready to begin your consultation?"}</h2>
        <div className="flex justify-center">
          <ActionButtons site={site} />
        </div>
      </section>
    </>
  );
}
