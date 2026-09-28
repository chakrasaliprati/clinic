import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";

/**
 * Collection tables (specialities, blog_posts) carry a `has_draft` /
 * `draft_payload` pair just like singletons, plus their own row-level
 * `is_published` flag (a brand-new item starts unpublished until the
 * first Publish). Simpler collections without a draft workflow
 * (reviews, faqs) just use `is_published` directly — see their pages.
 */

export async function listAll(table, orderBy = "display_order") {
  const supabase = createClient();
  const { data, error } = await supabase.from(table).select("*").order(orderBy, { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function listPublished(table, orderBy = "display_order") {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("is_published", true)
      .order(orderBy, { ascending: true });
    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

export async function getById(table, id) {
  const supabase = createClient();
  const { data, error } = await supabase.from(table).select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getForEditing(table, id) {
  const row = await getById(table, id);
  if (!row) return null;
  if (row.has_draft && row.draft_payload) {
    return { ...row, ...row.draft_payload, _isDraftView: true };
  }
  return { ...row, _isDraftView: false };
}

export async function create(table, fields) {
  const supabase = createClient();
  const { data, error } = await supabase.from(table).insert(fields).select().single();
  if (error) throw error;
  return data;
}

export async function saveDraft(table, id, fields) {
  const supabase = createClient();
  const { error } = await supabase
    .from(table)
    .update({ draft_payload: fields, has_draft: true, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function publish(table, id, fields) {
  const supabase = createClient();
  const payload = {
    ...fields,
    is_published: true,
    draft_payload: null,
    has_draft: false,
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabase.from(table).update(payload).eq("id", id);
  if (error) throw error;
}

export async function unpublish(table, id) {
  const supabase = createClient();
  const { error } = await supabase.from(table).update({ is_published: false }).eq("id", id);
  if (error) throw error;
}

export async function discardDraft(table, id) {
  const supabase = createClient();
  const { error } = await supabase.from(table).update({ draft_payload: null, has_draft: false }).eq("id", id);
  if (error) throw error;
}

export async function remove(table, id) {
  const supabase = createClient();
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw error;
}

export async function reorder(table, orderedIds) {
  const supabase = createClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from(table).update({ display_order: index }).eq("id", id)
    )
  );
}
