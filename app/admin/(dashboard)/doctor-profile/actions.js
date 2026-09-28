"use server";

import { revalidatePath } from "next/cache";
import * as singleton from "@/lib/cms/singleton";

const TABLE = "doctor_profile";

export async function saveDraftAction(fields) {
  await singleton.saveDraft(TABLE, fields);
  revalidatePath("/admin/doctor-profile");
}

export async function publishAction(fields) {
  await singleton.publish(TABLE, fields);
  revalidatePath("/admin/doctor-profile");
  revalidatePath("/about");
  revalidatePath("/");
}

export async function discardAction() {
  await singleton.discardDraft(TABLE);
  revalidatePath("/admin/doctor-profile");
}
