"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateSeoSetting(pageKey, fields) {
  const supabase = createClient();
  const { error } = await supabase
    .from("seo_settings")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("page_key", pageKey);
  if (error) throw new Error("We couldn't save this change. Please try again.");
  revalidatePath("/admin/seo");
  revalidatePath("/");
}
