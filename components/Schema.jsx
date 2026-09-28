const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.drpratibhaayurveda.com";

function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function PhysicianSchema({ site }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: site.doctorName,
    medicalSpecialty: "Ayurveda",
    honorificSuffix: site.qualifications,
    image: site.doctorPhoto ? site.doctorPhoto : undefined,
    url: SITE_URL,
    telephone: site.phone || undefined,
    email: site.email || undefined,
    ...(site.hasOfflineLocation
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: `${site.address.line1}, ${site.address.line2}`,
            addressLocality: site.address.city,
            addressRegion: site.address.state,
            postalCode: site.address.pincode,
            addressCountry: site.address.country,
          },
          geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
        }
      : { areaServed: "Online" }),
  };
  return <JsonLd data={data} />;
}

export function MedicalBusinessSchema({ site }) {
  const data = {
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "LocalBusiness"],
    name: site.clinicName,
    image: site.doctorPhoto ? site.doctorPhoto : undefined,
    url: SITE_URL,
    telephone: site.phone || undefined,
    email: site.email || undefined,
    priceRange: "$$",
    ...(site.hasOfflineLocation
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: `${site.address.line1}, ${site.address.line2}`,
            addressLocality: site.address.city,
            addressRegion: site.address.state,
            postalCode: site.address.pincode,
            addressCountry: site.address.country,
          },
          geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
        }
      : { areaServed: "Online" }),
    openingHoursSpecification: (site.timings || []).map((t) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: t.day,
      description: t.hours,
    })),
    medicalSpecialty: "Ayurveda",
    founder: { "@type": "Person", name: site.doctorName, jobTitle: site.qualifications },
  };
  return <JsonLd data={data} />;
}

export function FAQSchema({ faqs }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q || f.question,
      acceptedAnswer: { "@type": "Answer", text: f.a || f.answer },
    })),
  };
  return <JsonLd data={data} />;
}

export function BreadcrumbSchema({ items }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.href}`,
    })),
  };
  return <JsonLd data={data} />;
}

export function MedicalWebPageSchema({ name, description, url, doctorName, qualification }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name,
    description,
    url: `${SITE_URL}${url}`,
    lastReviewed: new Date().toISOString().split("T")[0],
    reviewedBy: { "@type": "Person", name: doctorName, jobTitle: qualification },
  };
  return <JsonLd data={data} />;
}
