// SERVER-ONLY client using the service-role key. This key bypasses
// Row Level Security entirely, so this file must never be imported
// from a "use client" component or exposed to the browser.
//
// It is used in exactly two places:
//  1. app/api/consultation/route.js — inserting a public consultation
//     request (there is no admin session to attach an RLS policy to).
//  2. Admin photo-upload/delete routes, to clean up the old profile
//     photo from Storage after a replace.
import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error("Supabase service-role credentials are not configured.");
  }
  return createSupabaseClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
