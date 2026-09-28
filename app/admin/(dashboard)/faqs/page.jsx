import { createClient } from "@/lib/supabase/server";
import FaqsManager from "./FaqsManager";

export const dynamic = "force-dynamic";

export default async function FaqsPage() {
  const supabase = createClient();
  const { data: faqs } = await supabase.from("faqs").select("*").order("display_order", { ascending: true });

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl text-emerald-deep">FAQs</h1>
        <p className="text-sm text-ink-soft mt-1">Manage the questions shown across the homepage and speciality pages.</p>
      </div>
      <FaqsManager faqs={faqs || []} />
    </div>
  );
}
