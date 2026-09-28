// Cookie-free, anon-key client for PUBLIC page reads. Because it never
// touches cookies(), pages using it can be statically cached/ISR-revalidated
// by Next.js — which keeps the public site fast. RLS still applies.
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
