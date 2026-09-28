"use server";

import { revalidatePath } from "next/cache";
import * as singleton from "@/lib/cms/singleton";

const TABLE = "website_notice";

export async function saveDraftAction(fields) {
  await singleton.saveDraft(TABLE, fields);
  revalidatePath("/admin/website-notice");
}

export async function publishAction(fields) {
  await singleton.publish(TABLE, fields);
  revalidatePath("/admin/website-notice");
  revalidatePath("/");
}

export async function discardAction() {
  await singleton.discardDraft(TABLE);
  revalidatePath("/admin/website-notice");
}
