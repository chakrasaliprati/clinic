import Hero from "@/components/Hero";
import TrustIndicators from "@/components/TrustIndicators";
import WhyChoose from "@/components/WhyChoose";
import FeaturedServices from "@/components/FeaturedServices";
import Testimonials from "@/components/Testimonials";
import FAQAccordion from "@/components/FAQAccordion";
import GoogleReviews from "@/components/GoogleReviews";
import ContactSection from "@/components/ContactSection";
import { FAQSchema } from "@/components/Schema";
import {
  getSiteData, getHomepageData, getFeaturedSpecialities,
  getPublishedReviews, getPublishedFaqs, getSeoSettings, getAllSpecialities,
} from "@/lib/site-data";

export const revalidate = 60;

export async function generateMetadata() {
  const [site, seo] = await Promise.all([getSiteData(), getSeoSettings("home")]);
  const title = seo?.title || `Best Ayurvedic Doctor | ${site.doctorName}`;
  const description = seo?.meta_description || `Book a consultation with ${site.doctorName}, ${site.qualifications}, for personalised Ayurvedic care.`;
  return { title, description, alternates: { canonical: seo?.canonical_url || "/" } };
}

export default async function HomePage() {
  const [site, homepage, featured, allSpecialities, reviews, faqs] = await Promise.all([
    getSiteData(),
    getHomepageData(),
    getFeaturedSpecialities(),
    getAllSpecialities(),
    getPublishedReviews(),
    getPublishedFaqs(),
  ]);

  // Homepage-curated highlights (admin's chosen order), falling back to
  // any published non-featured specialities if none have been curated yet.
  const nonFeatured = allSpecialities.filter((s) => !s.is_featured);
  const homepageHighlights = homepage?.featured_speciality_slugs?.length > 0
    ? homepage.featured_speciality_slugs.map((slug) => allSpecialities.find((s) => s.slug === slug)).filter(Boolean)
    : nonFeatured.slice(0, 6);

  const faqPairs = faqs.map((f) => ({ q: f.question, a: f.answer }));

  return (
    <>
      {faqPairs.length > 0 && <FAQSchema faqs={faqPairs} />}
      <Hero site={site} homepage={homepage} />
      <TrustIndicators statistics={homepage?.statistics} />
      <WhyChoose site={site} homepage={homepage} />
      <FeaturedServices featured={featured} highlights={homepageHighlights} />
      <Testimonials reviews={reviews} />
      {faqPairs.length > 0 && <FAQAccordion faqs={faqPairs} />}
      <GoogleReviews site={site} />
      <ContactSection site={site} />
    </>
  );
}
