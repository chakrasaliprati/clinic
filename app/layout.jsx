import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import StickyMobileBar from "@/components/StickyMobileBar";
import WebsiteNoticePopup from "@/components/WebsiteNoticePopup";
import { PhysicianSchema, MedicalBusinessSchema } from "@/components/Schema";
import { getSiteData, getFeaturedSpecialities, getWebsiteNotice, getSeoSettings } from "@/lib/site-data";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.drpratibhaayurveda.com";

export async function generateMetadata() {
  const [site, seo] = await Promise.all([getSiteData(), getSeoSettings("site")]);

  const title = seo?.title || `${site.doctorName} | Best Ayurvedic Doctor`;
  const description = seo?.meta_description || `Book a consultation with ${site.doctorName}, ${site.qualifications}, for personalised Ayurvedic care.`;

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s | ${site.doctorName}` },
    description,
    openGraph: {
      type: "website",
      url: SITE_URL,
      siteName: site.clinicName,
      title: seo?.og_title || title,
      description: seo?.og_description || description,
      images: seo?.og_image || site.doctorPhoto ? [{ url: seo?.og_image || site.doctorPhoto, width: 1200, height: 630, alt: site.doctorName }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.og_title || title,
      description: seo?.og_description || description,
    },
    alternates: { canonical: seo?.canonical_url || "/" },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({ children }) {
  const [site, featuredSpecialities, notice] = await Promise.all([
    getSiteData(),
    getFeaturedSpecialities(),
    getWebsiteNotice(),
  ]);

  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <body>
        <PhysicianSchema site={site} />
        <MedicalBusinessSchema site={site} />
        <Header site={site} />
        <main>{children}</main>
        <Footer site={site} featuredSpecialities={featuredSpecialities} />
        <WhatsAppButton site={site} />
        <StickyMobileBar site={site} />
        <WebsiteNoticePopup notice={notice} />
      </body>
    </html>
  );
}
