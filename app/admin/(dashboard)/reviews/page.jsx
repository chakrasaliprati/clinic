import { createClient } from "@/lib/supabase/server";
import ReviewsManager from "./ReviewsManager";
import GoogleReviewsConfig from "./GoogleReviewsConfig";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const supabase = createClient();
  const [{ data: reviews }, { data: googleConfig }] = await Promise.all([
    supabase.from("reviews").select("*").order("display_order", { ascending: true }),
    supabase.from("google_reviews_config").select("*").eq("id", 1).maybeSingle(),
  ]);

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl text-emerald-deep">Reviews</h1>
        <p className="text-sm text-ink-soft mt-1">Manage manually entered website reviews and configure the Google Reviews display.</p>
      </div>

      <h2 className="font-display text-lg text-emerald-deep mb-3">Website Reviews</h2>
      <ReviewsManager reviews={reviews || []} />

      <h2 className="font-display text-lg text-emerald-deep mt-10 mb-3">Google Reviews</h2>
      <GoogleReviewsConfig initial={googleConfig} />
    </div>
  );
}
