import { createClient } from "@/lib/supabase/server";
import SeoManager from "./SeoManager";

export const dynamic = "force-dynamic";

const pageLabels = {
  site: "Site-wide Defaults",
  home: "Home Page",
  about: "About Doctor",
  services: "Services",
  consultation: "Consultation",
  blog: "Blog",
  contact: "Contact",
};

export default async function SeoPage() {
  const supabase = createClient();
  const { data } = await supabase.from("seo_settings").select("*");
  const rows = (data || []).sort((a, b) => Object.keys(pageLabels).indexOf(a.page_key) - Object.keys(pageLabels).indexOf(b.page_key));

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl text-emerald-deep">SEO</h1>
        <p className="text-sm text-ink-soft mt-1">Titles, meta descriptions, and Open Graph details per page. Sitemap, robots.txt, canonical tags, and structured data are generated automatically.</p>
      </div>
      <SeoManager rows={rows} labels={pageLabels} />
    </div>
  );
}
