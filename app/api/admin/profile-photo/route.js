import { NextResponse } from "next/server";
import sharp from "sharp";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function requireAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: adminRow } = await supabase.from("admin_users").select("id").eq("id", user.id).maybeSingle();
  return adminRow ? user : null;
}

export async function POST(request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ ok: false, message: "Not authorized." }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("photo");
  if (!file || typeof file === "string") {
    return NextResponse.json({ ok: false, message: "No photo was provided." }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    // Resize + compress + convert to WebP — keeps Storage usage minimal
    const optimized = await sharp(buffer)
      .resize({ width: 800, height: 1000, fit: "cover" })
      .webp({ quality: 82 })
      .toBuffer();

    const admin = createAdminClient();
    const path = `doctor/profile-${Date.now()}.webp`;

    const { error: uploadError } = await admin.storage.from("profile").upload(path, optimized, {
      contentType: "image/webp",
      upsert: false,
    });
    if (uploadError) throw uploadError;

    const { data: publicUrlData } = admin.storage.from("profile").getPublicUrl(path);

    // Fetch the current photo so we can safely delete it after the new
    // one is confirmed stored.
    const { data: profile } = await admin.from("doctor_profile").select("photo_path").eq("id", 1).single();
    const oldPath = profile?.photo_path;

    const { error: updateError } = await admin
      .from("doctor_profile")
      .update({ photo_path: path, photo_url: publicUrlData.publicUrl, updated_at: new Date().toISOString() })
      .eq("id", 1);
    if (updateError) throw updateError;

    if (oldPath) {
      await admin.storage.from("profile").remove([oldPath]);
    }

    return NextResponse.json({ ok: true, url: publicUrlData.publicUrl });
  } catch {
    return NextResponse.json({ ok: false, message: "We couldn't save this change. Please try again." }, { status: 500 });
  }
}

export async function DELETE() {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ ok: false, message: "Not authorized." }, { status: 401 });

  try {
    const admin = createAdminClient();
    const { data: profile } = await admin.from("doctor_profile").select("photo_path").eq("id", 1).single();

    if (profile?.photo_path) {
      await admin.storage.from("profile").remove([profile.photo_path]);
    }

    const { error } = await admin
      .from("doctor_profile")
      .update({ photo_path: null, photo_url: null, updated_at: new Date().toISOString() })
      .eq("id", 1);
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, message: "We couldn't remove the photo. Please try again." }, { status: 500 });
  }
}
