"use server";

import { revalidatePath } from "next/cache";
import * as singleton from "@/lib/cms/singleton";

const TABLE = "homepage_content";

export async function saveDraftAction(fields) {
  await singleton.saveDraft(TABLE, fields);
  revalidatePath("/admin/home-page");
}

export async function publishAction(fields) {
  await singleton.publish(TABLE, fields);
  revalidatePath("/admin/home-page");
  revalidatePath("/");
}

export async function discardAction() {
  await singleton.discardDraft(TABLE);
  revalidatePath("/admin/home-page");
}
