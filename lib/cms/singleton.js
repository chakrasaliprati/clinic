import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";

// Every singleton content table has a single row with id = 1, plus
// `draft_payload` (jsonb, pending edits) and `has_draft` (boolean).
// The real columns always hold the currently PUBLISHED content, so the
// public site can simply `select *` and never has to think about drafts.

/** Public-facing read: always the published columns, ignores drafts. */
export async function getPublished(table) {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from(table).select("*").eq("id", 1).single();
    if (error) return null;
    return data;
  } catch {
    return null; // fail soft: the public site falls back to sensible defaults
  }
}

/** Admin edit-form read: draft edits layered over the published row, if any. */
export async function getForEditing(table) {
  const supabase = createClient();
  const { data, error } = await supabase.from(table).select("*").eq("id", 1).single();
  if (error || !data) return null;
  if (data.has_draft && data.draft_payload) {
    return { ...data, ...data.draft_payload, _isDraftView: true };
  }
  return { ...data, _isDraftView: false };
}

/** Save Draft — stores changes without touching the live public content. */
export async function saveDraft(table, fields) {
  const supabase = createClient();
  const { error } = await supabase
    .from(table)
    .update({ draft_payload: fields, has_draft: true, updated_at: new Date().toISOString() })
    .eq("id", 1);
  if (error) throw error;
}

/** Publish — makes the given fields (or the pending draft) live immediately. */
export async function publish(table, fields) {
  const supabase = createClient();
  const payload = {
    ...fields,
    draft_payload: null,
    has_draft: false,
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabase.from(table).update(payload).eq("id", 1);
  if (error) throw error;
}

/** Discard Changes — throws away any pending draft, published content untouched. */
export async function discardDraft(table) {
  const supabase = createClient();
  const { error } = await supabase
    .from(table)
    .update({ draft_payload: null, has_draft: false })
    .eq("id", 1);
  if (error) throw error;
}
