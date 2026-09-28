"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function refresh() {
  revalidatePath("/admin/faqs");
  revalidatePath("/");
}

export async function createFaq(fields) {
  const supabase = createClient();
  const { error } = await supabase.from("faqs").insert(fields);
  if (error) throw new Error("We couldn't save this change. Please try again.");
  refresh();
}

export async function updateFaq(id, fields) {
  const supabase = createClient();
  const { error } = await supabase.from("faqs").update({ ...fields, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) throw new Error("We couldn't save this change. Please try again.");
  refresh();
}

export async function deleteFaq(id) {
  const supabase = createClient();
  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) throw new Error("We couldn't delete this FAQ. Please try again.");
  refresh();
}

export async function reorderFaqs(orderedIds) {
  const supabase = createClient();
  await Promise.all(orderedIds.map((id, index) => supabase.from("faqs").update({ display_order: index }).eq("id", id)));
  refresh();
}
