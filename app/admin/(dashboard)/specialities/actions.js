"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as collection from "@/lib/cms/collection";

const TABLE = "specialities";

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createSpecialityAction(name) {
  const slug = slugify(name) || `speciality-${Date.now()}`;
  const row = await collection.create(TABLE, { name, slug, short_description: "" });
  revalidatePath("/admin/specialities");
  redirect(`/admin/specialities/${row.id}`);
}

export async function saveDraftAction(id, fields) {
  const payload = { ...fields, slug: fields.slug ? slugify(fields.slug) : undefined };
  await collection.saveDraft(TABLE, id, payload);
  revalidatePath(`/admin/specialities/${id}`);
}

export async function publishAction(id, fields) {
  const payload = { ...fields, slug: slugify(fields.slug) || `speciality-${id}` };
  await collection.publish(TABLE, id, payload);
  revalidatePath("/admin/specialities");
  revalidatePath(`/admin/specialities/${id}`);
  revalidatePath("/services");
  revalidatePath("/");
}

export async function discardAction(id) {
  await collection.discardDraft(TABLE, id);
  revalidatePath(`/admin/specialities/${id}`);
}

export async function unpublishAction(id) {
  await collection.unpublish(TABLE, id);
  revalidatePath("/admin/specialities");
  revalidatePath("/services");
}

export async function deleteAction(id) {
  await collection.remove(TABLE, id);
  revalidatePath("/admin/specialities");
  revalidatePath("/services");
}

export async function reorderAction(orderedIds) {
  await collection.reorder(TABLE, orderedIds);
  revalidatePath("/admin/specialities");
  revalidatePath("/services");
}
