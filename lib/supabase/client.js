// Browser-side Supabase client — used only inside "use client"
// components (e.g. the login form, small interactive admin widgets).
// Uses the public anon key only; every write is still enforced by RLS.
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
