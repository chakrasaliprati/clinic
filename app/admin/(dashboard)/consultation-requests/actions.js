"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateStatus(id, status) {
  const supabase = createClient();
  const { error } = await supabase
    .from("consultation_requests")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error("We couldn't save this change. Please try again.");
  revalidatePath("/admin/consultation-requests");
  revalidatePath("/admin/follow-ups");
  revalidatePath(`/admin/consultation-requests/${id}`);
}

export async function saveFollowUp(id, { note, date }) {
  const supabase = createClient();
  const { error } = await supabase
    .from("consultation_requests")
    .update({
      status: "follow_up",
      follow_up_note: note || null,
      follow_up_date: date || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw new Error("We couldn't save this change. Please try again.");
  revalidatePath("/admin/consultation-requests");
  revalidatePath("/admin/follow-ups");
  revalidatePath(`/admin/consultation-requests/${id}`);
}

export async function deleteRequest(id) {
  const supabase = createClient();
  // Guard: only ever allow deleting requests that are marked SOLVED,
  // even if someone bypasses the UI confirmation.
  const { data: row } = await supabase.from("consultation_requests").select("status").eq("id", id).single();
  if (!row || row.status !== "solved") {
    throw new Error("Only solved requests can be deleted.");
  }
  const { error } = await supabase.from("consultation_requests").delete().eq("id", id);
  if (error) throw new Error("We couldn't delete this request. Please try again.");
  revalidatePath("/admin/consultation-requests");
}

export async function bulkDeleteSolved(ids) {
  const supabase = createClient();
  const { error } = await supabase
    .from("consultation_requests")
    .delete()
    .in("id", ids)
    .eq("status", "solved"); // extra safety: only ever deletes rows that are solved
  if (error) throw new Error("We couldn't delete these requests. Please try again.");
  revalidatePath("/admin/consultation-requests");
}
