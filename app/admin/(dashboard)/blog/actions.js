"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as collection from "@/lib/cms/collection";

const TABLE = "blog_posts";

function slugify(text) {
  return String(text || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function createPostAction(title) {
  const slug = slugify(title) || `post-${Date.now()}`;
  const row = await collection.create(TABLE, { title, slug, short_description: "", content: "" });
  revalidatePath("/admin/blog");
  redirect(`/admin/blog/${row.id}`);
}

export async function saveDraftAction(id, fields) {
  await collection.saveDraft(TABLE, id, { ...fields, slug: fields.slug ? slugify(fields.slug) : undefined });
  revalidatePath(`/admin/blog/${id}`);
}

export async function publishAction(id, fields) {
  await collection.publish(TABLE, id, { ...fields, slug: slugify(fields.slug) || `post-${id}` });
  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${id}`);
  revalidatePath("/blog");
}

export async function discardAction(id) {
  await collection.discardDraft(TABLE, id);
  revalidatePath(`/admin/blog/${id}`);
}

export async function unpublishAction(id) {
  await collection.unpublish(TABLE, id);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function deleteAction(id) {
  await collection.remove(TABLE, id);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function reorderAction(orderedIds) {
  await collection.reorder(TABLE, orderedIds);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}
