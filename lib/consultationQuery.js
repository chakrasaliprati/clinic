import "server-only";
import { createClient } from "@/lib/supabase/server";

function dateRangeStart(key) {
  const now = new Date();
  if (key === "today") {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  }
  if (key === "week") {
    const day = now.getDay();
    const diff = (day + 6) % 7; // Monday as start of week
    const monday = new Date(now);
    monday.setDate(now.getDate() - diff);
    monday.setHours(0, 0, 0, 0);
    return monday.toISOString();
  }
  if (key === "month") {
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  }
  return null;
}

/**
 * Shared filter/search builder for the Consultation Requests and
 * Follow-ups admin lists. `searchParams` comes straight from the
 * page's props (Next.js App Router passes it as a plain object).
 */
export async function fetchConsultationRequests({ searchParams = {}, forceStatus } = {}) {
  const supabase = createClient();
  let query = supabase.from("consultation_requests").select("*").order("created_at", { ascending: false });

  if (forceStatus) {
    query = query.eq("status", forceStatus);
  } else if (searchParams.status) {
    query = query.eq("status", searchParams.status);
  }

  if (searchParams.type) {
    query = query.eq("consultation_type", searchParams.type);
  }

  if (searchParams.date) {
    const start = dateRangeStart(searchParams.date);
    if (start) query = query.gte("created_at", start);
  }

  if (searchParams.q) {
    const term = searchParams.q.trim();
    query = query.or(`patient_name.ilike.%${term}%,phone.ilike.%${term}%`);
  }

  const { data, error } = await query;
  if (error) return [];
  return data || [];
}

export async function fetchPreviousRequests(phone, excludeId) {
  const supabase = createClient();
  let query = supabase
    .from("consultation_requests")
    .select("*")
    .eq("phone", phone)
    .order("created_at", { ascending: false });
  if (excludeId) query = query.neq("id", excludeId);
  const { data } = await query;
  return data || [];
}
