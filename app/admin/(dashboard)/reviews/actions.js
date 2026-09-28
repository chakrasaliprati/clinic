"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function refresh() {
  revalidatePath("/admin/reviews");
  revalidatePath("/");
}

export async function createReview(fields) {
  const supabase = createClient();
  const { error } = await supabase.from("reviews").insert(fields);
  if (error) throw new Error("We couldn't save this change. Please try again.");
  refresh();
}

export async function updateReview(id, fields) {
  const supabase = createClient();
  const { error } = await supabase.from("reviews").update({ ...fields, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) throw new Error("We couldn't save this change. Please try again.");
  refresh();
}

export async function deleteReview(id) {
  const supabase = createClient();
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) throw new Error("We couldn't delete this review. Please try again.");
  refresh();
}

export async function reorderReviews(orderedIds) {
  const supabase = createClient();
  await Promise.all(orderedIds.map((id, index) => supabase.from("reviews").update({ display_order: index }).eq("id", id)));
  refresh();
}

export async function updateGoogleReviewsConfig(fields) {
  const supabase = createClient();
  const { error } = await supabase
    .from("google_reviews_config")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", 1);
  if (error) throw new Error("We couldn't save this change. Please try again.");
  revalidatePath("/admin/reviews");
  revalidatePath("/");
}
