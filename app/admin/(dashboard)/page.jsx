import Link from "next/link";
import { MessagesSquare, RotateCcw, CalendarDays, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = createClient();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [{ count: newCount }, { count: followUpCount }, { count: todayCount }] = await Promise.all([
    supabase.from("consultation_requests").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("consultation_requests").select("id", { count: "exact", head: true }).eq("status", "follow_up"),
    supabase.from("consultation_requests").select("id", { count: "exact", head: true }).gte("created_at", startOfToday.toISOString()),
  ]);

  const stats = [
    { label: "New Requests", value: newCount || 0, icon: MessagesSquare, href: "/admin/consultation-requests?status=new" },
    { label: "Follow-ups", value: followUpCount || 0, icon: RotateCcw, href: "/admin/follow-ups" },
    { label: "Today's Requests", value: todayCount || 0, icon: CalendarDays, href: "/admin/consultation-requests?date=today" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl text-emerald-deep mb-6">Welcome back</h1>

      <div className="grid sm:grid-cols-3 gap-5 mb-8">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href} className="rounded-2xl bg-white border border-emerald-soft/70 shadow-card p-6 hover:shadow-cardHover hover:-translate-y-0.5 transition-all">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-light text-emerald-deep mb-4">
              <Icon className="w-5 h-5" />
            </span>
            <p className="font-display text-3xl text-emerald-deep">{value}</p>
            <p className="text-sm text-ink-soft mt-1">{label}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl bg-white border border-emerald-soft/70 shadow-card p-6">
        <h2 className="font-display text-lg text-emerald-deep mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <QuickAction href="/admin/consultation-requests" label="View Requests" />
          <QuickAction href="/admin/follow-ups" label="View Follow-ups" />
          <QuickAction href="/admin/home-page" label="Edit Website" />
        </div>
      </div>
    </div>
  );
}

function QuickAction({ href, label }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-full border border-emerald px-5 py-2.5 text-sm font-semibold text-emerald-deep hover:bg-emerald hover:text-cream transition-colors"
    >
      {label} <ArrowRight className="w-4 h-4" />
    </Link>
  );
}
