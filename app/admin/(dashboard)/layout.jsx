import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";
import { signOutAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({ children }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (!adminRow) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-dim px-5">
        <div className="max-w-md rounded-2xl bg-white border border-emerald-soft/70 shadow-card p-8 text-center">
          <h1 className="font-display text-xl text-emerald-deep mb-2">Access not set up yet</h1>
          <p className="text-sm text-ink-soft mb-5">
            You&apos;re signed in as {user.email}, but this account hasn&apos;t been given admin access.
            Please add it to the admin list, then refresh.
          </p>
          <form action={signOutAction}>
            <button className="rounded-full bg-emerald px-6 py-2.5 text-sm font-semibold text-cream">Sign out</button>
          </form>
        </div>
      </div>
    );
  }

  const [{ count: newCount }, { count: followUpCount }] = await Promise.all([
    supabase.from("consultation_requests").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("consultation_requests").select("id", { count: "exact", head: true }).eq("status", "follow_up"),
  ]);

  return (
    <AdminShell counts={{ new: newCount || 0, followUp: followUpCount || 0 }} adminName={adminRow.full_name}>
      {children}
    </AdminShell>
  );
}
