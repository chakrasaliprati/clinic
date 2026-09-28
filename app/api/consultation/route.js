import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

function fail(message, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return fail("We couldn't submit your request right now. Please try again or contact us directly.");
  }

  // Honeypot — a hidden field real visitors never fill in. Bots that
  // auto-fill every field will trip this and get a fake "success" so
  // they don't learn to avoid the field.
  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  const email = body.email ? String(body.email).trim() : null;
  const age = body.age ? Number(body.age) : null;
  const consultationType = body.consultationType === "clinic" ? "clinic" : "online";
  const preferredDate = body.preferredDate || null;
  const preferredTime = body.preferredTime || null;
  const healthConcern = body.healthConcern ? String(body.healthConcern).trim().slice(0, 2000) : null;

  // Server-side validation
  if (!name || name.length < 2) return fail("Please enter your full name.");
  const phoneDigits = phone.replace(/[^\d+]/g, "");
  if (phoneDigits.replace(/\D/g, "").length < 8) return fail("Please enter a valid phone number.");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("Please enter a valid email address.");
  if (age !== null && (Number.isNaN(age) || age < 0 || age > 120)) return fail("Please enter a valid age.");

  try {
    const supabase = createAdminClient();

    // Basic rate limiting / duplicate detection: has this phone number
    // submitted in the last 2 minutes? Block obvious accidental double
    // submits; anything older is treated as a legitimate new request
    // but flagged for the admin to review as a possible duplicate.
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();

    const { data: veryRecent } = await supabase
      .from("consultation_requests")
      .select("id")
      .eq("phone", phoneDigits)
      .gte("created_at", twoMinutesAgo)
      .limit(1);

    if (veryRecent && veryRecent.length > 0) {
      // Treat as a duplicate click rather than a new request — return
      // success without inserting again.
      return NextResponse.json({ ok: true });
    }

    const { data: recentSameNumber } = await supabase
      .from("consultation_requests")
      .select("id")
      .eq("phone", phoneDigits)
      .gte("created_at", thirtyMinutesAgo)
      .limit(1);

    const { error } = await supabase.from("consultation_requests").insert({
      patient_name: name,
      phone: phoneDigits,
      email,
      age,
      consultation_type: consultationType,
      preferred_date: preferredDate,
      preferred_time: preferredTime,
      health_concern: healthConcern,
      status: "new",
      possible_duplicate: Boolean(recentSameNumber && recentSameNumber.length > 0),
    });

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch {
    return fail("We couldn't submit your request right now. Please try again or contact us directly.", 500);
  }
}
