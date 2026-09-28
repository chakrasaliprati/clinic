import { getForEditing } from "@/lib/cms/singleton";
import { createClient } from "@/lib/supabase/server";
import HomePageForm from "./HomePageForm";

export const dynamic = "force-dynamic";

export default async function HomePageAdminPage() {
  const supabase = createClient();
  const [initial, { data: specialities }, { data: reviews }, { data: faqs }] = await Promise.all([
    getForEditing("homepage_content"),
    supabase.from("specialities").select("id, slug, name").order("display_order"),
    supabase.from("reviews").select("id, patient_name, review_text").order("display_order"),
    supabase.from("faqs").select("id, question").order("display_order"),
  ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl text-emerald-deep">Home Page</h1>
        <p className="text-sm text-ink-soft mt-1">Edit homepage content without changing its visual design.</p>
      </div>
      <HomePageForm initial={initial} specialities={specialities || []} reviews={reviews || []} faqs={faqs || []} />
    </div>
  );
}
