"use server";

import { revalidatePath } from "next/cache";
import * as singleton from "@/lib/cms/singleton";

const TABLE = "consultation_settings";

export async function saveDraftAction(fields) {
  await singleton.saveDraft(TABLE, fields);
  revalidatePath("/admin/consultation-settings");
}

export async function publishAction(fields) {
  await singleton.publish(TABLE, fields);
  revalidatePath("/admin/consultation-settings");
  revalidatePath("/consultation");
}

export async function discardAction() {
  await singleton.discardDraft(TABLE);
  revalidatePath("/admin/consultation-settings");
}
