import { CheckCircle2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ActionButtons from "@/components/ActionButtons";
import FAQAccordion from "@/components/FAQAccordion";
import { FAQSchema, BreadcrumbSchema, MedicalWebPageSchema } from "@/components/Schema";

export default function SpecialityPageContent({ speciality, site, breadcrumbs, titleOverride, extra }) {
  const faqs = (speciality.faqs || []).map((f) => ({ q: f.q, a: f.a }));

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      {faqs.length > 0 && <FAQSchema faqs={faqs} />}
      <MedicalWebPageSchema
        name={speciality.seo_title || `${speciality.name} Treatment`}
        description={speciality.meta_description || speciality.short_description}
        url={breadcrumbs[breadcrumbs.length - 1].href}
        doctorName={site.doctorName}
        qualification={site.qualifications}
      />

      <PageHeader
        eyebrow={speciality.group_name}
        title={titleOverride || `${speciality.name} Treatment`}
        description={speciality.short_description}
        breadcrumbs={breadcrumbs}
      />

      <section className="max-w-4xl mx-auto px-5 md:px-8 py-14 space-y-14">
        {speciality.overview && (
          <div>
            <h2 className="font-display text-2xl text-emerald-deep mb-3">Overview</h2>
            <p className="text-ink-soft leading-relaxed">{speciality.overview}</p>
          </div>
        )}

        {(speciality.symptoms?.length > 0 || speciality.causes?.length > 0) && (
          <div className="grid sm:grid-cols-2 gap-10">
            {speciality.symptoms?.length > 0 && (
              <div>
                <h2 className="font-display text-2xl text-emerald-deep mb-4">Symptoms</h2>
                <ul className="space-y-2.5">
                  {speciality.symptoms.map((s) => (
                    <li key={s} className="flex items-start gap-2.5 text-ink-soft">
                      <CheckCircle2 className="w-4 h-4 mt-1 text-emerald shrink-0" /> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {speciality.causes?.length > 0 && (
              <div>
                <h2 className="font-display text-2xl text-emerald-deep mb-4">Causes</h2>
                <ul className="space-y-2.5">
                  {speciality.causes.map((s) => (
                    <li key={s} className="flex items-start gap-2.5 text-ink-soft">
                      <CheckCircle2 className="w-4 h-4 mt-1 text-gold shrink-0" /> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {speciality.approach && (
          <div>
            <h2 className="font-display text-2xl text-emerald-deep mb-3">Our Ayurvedic Treatment Approach</h2>
            <p className="text-ink-soft leading-relaxed">{speciality.approach}</p>
          </div>
        )}

        {(speciality.lifestyle?.length > 0 || speciality.diet?.length > 0) && (
          <div className="grid sm:grid-cols-2 gap-10">
            {speciality.lifestyle?.length > 0 && (
              <div>
                <h2 className="font-display text-2xl text-emerald-deep mb-4">Lifestyle Recommendations</h2>
                <ul className="space-y-2.5">
                  {speciality.lifestyle.map((s) => (
                    <li key={s} className="flex items-start gap-2.5 text-ink-soft">
                      <CheckCircle2 className="w-4 h-4 mt-1 text-emerald shrink-0" /> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {speciality.diet?.length > 0 && (
              <div>
                <h2 className="font-display text-2xl text-emerald-deep mb-4">Diet Guidance</h2>
                <ul className="space-y-2.5">
                  {speciality.diet.map((s) => (
                    <li key={s} className="flex items-start gap-2.5 text-ink-soft">
                      <CheckCircle2 className="w-4 h-4 mt-1 text-gold shrink-0" /> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="rounded-2xl bg-emerald-light/50 p-8 text-center">
          <h2 className="font-display text-xl text-emerald-deep mb-4">
            Discuss your {speciality.name.toLowerCase()} concern with {site.doctorName}
          </h2>
          <div className="flex justify-center">
            <ActionButtons concern={speciality.name} site={site} />
          </div>
        </div>
      </section>

      {extra}

      {faqs.length > 0 && <FAQAccordion faqs={faqs} />}
    </>
  );
}
