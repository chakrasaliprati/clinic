import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";

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
    // Authenticated with Supabase, but not registered as an admin —
    // sign them out rather than showing an empty/broken dashboard.
    await supabase.auth.signOut();
    redirect("/admin/login");
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
