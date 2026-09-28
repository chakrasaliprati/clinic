"use server";

import { revalidatePath } from "next/cache";
import * as singleton from "@/lib/cms/singleton";

const TABLE = "contact_settings";

export async function saveDraftAction(fields) {
  await singleton.saveDraft(TABLE, fields);
  revalidatePath("/admin/contact-settings");
}

export async function publishAction(fields) {
  await singleton.publish(TABLE, fields);
  revalidatePath("/admin/contact-settings");
  revalidatePath("/contact");
  revalidatePath("/");
}

export async function discardAction() {
  await singleton.discardDraft(TABLE);
  revalidatePath("/admin/contact-settings");
}
