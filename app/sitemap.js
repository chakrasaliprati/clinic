import { getAllSpecialities, getPublishedBlogPosts } from "@/lib/site-data";

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.drpratibhaayurveda.com";

export default async function sitemap() {
  const staticRoutes = ["", "/about", "/services", "/consultation", "/blog", "/contact"].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.8,
  }));

  let specialityRoutes = [];
  let blogRoutes = [];
  try {
    const [specialities, posts] = await Promise.all([getAllSpecialities(), getPublishedBlogPosts()]);
    specialityRoutes = specialities.map((s) => ({
      url: `${SITE_URL}${s.hub_path || `/services/${s.slug}`}`,
      lastModified: new Date(s.updated_at || Date.now()),
      changeFrequency: "monthly",
      priority: s.is_featured ? 0.9 : 0.7,
    }));
    blogRoutes = posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: new Date(p.updated_at || p.published_at || Date.now()),
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch {
    // If the database is unreachable, still serve the static routes.
  }

  // Patient consultation data is never included here.
  return [...staticRoutes, ...specialityRoutes, ...blogRoutes];
}
