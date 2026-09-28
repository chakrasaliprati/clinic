import "server-only";
import { createPublicClient as createClient } from "@/lib/supabase/public";
import { getPublished } from "@/lib/cms/singleton";
import { listPublished } from "@/lib/cms/collection";

// Public reads must never crash a page render (or a build) if the database is
// briefly unreachable — they fall back to empty values instead.
async function safe(fn, fallback) {
  try { return await fn(); } catch { return fallback; }
}

/** Site-wide chrome data used by Header, Footer, WhatsApp button, schema, etc. */
export async function getSiteData() {
  const [contact, consultationSettings, doctorProfile, googleReviews] = await Promise.all([
    getPublished("contact_settings"),
    getPublished("consultation_settings"),
    getPublished("doctor_profile"),
    getPublished("google_reviews_config"),
  ]);

  return {
    doctorName: doctorProfile?.name || "Dr. Pratibha Y.C.",
    qualifications: doctorProfile?.qualification || "BAMS, MD (Kayachikitsa – Ayurvedic General Medicine)",
    doctorPhoto: doctorProfile?.photo_url || null,
    experienceYears: doctorProfile?.experience_years || "",
    shortIntro: doctorProfile?.short_intro || "",

    clinicName: contact?.clinic_name || "Pratibha Ayurveda Clinic",
    hasOfflineLocation: Boolean(contact?.has_offline_location),
    address: {
      line1: contact?.address_line1 || "",
      line2: contact?.address_line2 || "",
      city: contact?.address_city || "",
      state: contact?.address_state || "",
      pincode: contact?.address_pincode || "",
      country: contact?.address_country || "IN",
    },
    geo: { lat: contact?.geo_lat || "", lng: contact?.geo_lng || "" },
    phone: contact?.phone || "",
    phoneDisplay: contact?.phone_display || contact?.phone || "",
    whatsapp: contact?.whatsapp || "",
    email: contact?.email || "",
    mapsEmbedUrl: contact?.maps_embed_url || "",
    mapsShareUrl: contact?.maps_url || "",
    timings: contact?.timings || [],
    social: contact?.social || {},

    googleReviewUrl: googleReviews?.read_reviews_url || "",
    googleReviewsEnabled: googleReviews?.enabled ?? true,
    googleRating: googleReviews?.display_rating || 4.9,
    googleReviewCount: googleReviews?.display_review_count || 0,

    clinicEnabled: Boolean(consultationSettings?.clinic_enabled),
    onlineEnabled: consultationSettings?.online_enabled ?? true,
    onlineConsultationPlatforms: consultationSettings?.online_platforms || [],
    whatsappMessageTemplate: consultationSettings?.whatsapp_message_template || "",

    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://www.drpratibhaayurveda.com",
  };
}

export async function getDoctorProfile() {
  return getPublished("doctor_profile");
}

export async function getAboutPageData() {
  return getPublished("about_page");
}

export async function getHomepageData() {
  return getPublished("homepage_content");
}

export async function getConsultationSettings() {
  return getPublished("consultation_settings");
}

export async function getContactSettings() {
  return getPublished("contact_settings");
}

export async function getWebsiteNotice() {
  return getPublished("website_notice");
}

export async function getSeoSettings(pageKey) {
  return safe(async () => {
  const supabase = createClient();
  const { data } = await supabase.from("seo_settings").select("*").eq("page_key", pageKey).maybeSingle();
  return data;}, null);
}

export async function getAllSpecialities() {
  return listPublished("specialities", "display_order");
}

export async function getFeaturedSpecialities() {
  return safe(async () => {
  const supabase = createClient();
  const { data } = await supabase
    .from("specialities")
    .select("*")
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("display_order", { ascending: true });
  return data || [];}, []);
}

export async function getHomepageFeaturedSpecialities() {
  return safe(async () => {
  const supabase = createClient();
  const { data } = await supabase
    .from("specialities")
    .select("*")
    .eq("is_published", true)
    .eq("homepage_featured", true)
    .order("display_order", { ascending: true });
  return data || [];}, []);
}

export async function getSpecialityBySlug(slug) {
  return safe(async () => {
  const supabase = createClient();
  const { data } = await supabase
    .from("specialities")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  return data;}, null);
}

export async function getSpecialitiesByGroup() {
  const all = await getAllSpecialities();
  const groups = {};
  for (const s of all) {
    if (!groups[s.group_name]) groups[s.group_name] = [];
    groups[s.group_name].push(s);
  }
  return groups;
}

export async function getPublishedReviews() {
  return listPublished("reviews", "display_order");
}

export async function getPublishedFaqs() {
  return listPublished("faqs", "display_order");
}

export async function getPublishedBlogPosts() {
  return safe(async () => {
  const supabase = createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  return data || [];}, []);
}

export async function getBlogPostBySlug(slug) {
  return safe(async () => {
  const supabase = createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  return data;}, null);
}

export async function getRelatedBlogPosts(currentId, category, limit = 2) {
  return safe(async () => {
  const supabase = createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .eq("category", category)
    .neq("id", currentId)
    .order("published_at", { ascending: false })
    .limit(limit);
  return data || [];}, []);
}
