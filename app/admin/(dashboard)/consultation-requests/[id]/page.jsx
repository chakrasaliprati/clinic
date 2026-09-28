import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, History } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { fetchPreviousRequests } from "@/lib/consultationQuery";
import { buildWhatsAppLink, fillTemplate, telLink } from "@/lib/whatsapp";
import StatusBadge from "@/components/admin/StatusBadge";
import RequestDetailActions from "./RequestDetailActions";

export const dynamic = "force-dynamic";

export default async function RequestDetailPage({ params }) {
  const supabase = createClient();

  const [{ data: request }, { data: settings }] = await Promise.all([
    supabase.from("consultation_requests").select("*").eq("id", params.id).maybeSingle(),
    supabase.from("consultation_settings").select("whatsapp_message_template").eq("id", 1).maybeSingle(),
  ]);

  if (!request) return notFound();

  const previous = await fetchPreviousRequests(request.phone, request.id);

  const message = fillTemplate(settings?.whatsapp_message_template, {
    concern: request.health_concern || "your consultation",
  });
  const whatsappUrl = buildWhatsAppLink(request.phone, message);
  const telUrl = telLink(request.phone);

  return (
    <div className="max-w-3xl">
      <Link href="/admin/consultation-requests" className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-emerald-deep mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Consultation Requests
      </Link>

      <div className="rounded-2xl bg-white border border-emerald-soft/70 shadow-card p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-2xl text-emerald-deep">{request.patient_name}</h1>
            <p className="text-sm text-ink-soft mt-1">
              Submitted {new Date(request.created_at).toLocaleString("en-IN", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          <StatusBadge status={request.status} />
        </div>

        <dl className="grid sm:grid-cols-2 gap-5 mb-6 text-sm">
          <Detail label="Phone" value={request.phone} />
          <Detail label="Email" value={request.email || "—"} />
          <Detail label="Age" value={request.age || "—"} />
          <Detail label="Consultation" value={request.consultation_type === "clinic" ? "Clinic" : "Online"} />
          <Detail label="Preferred Date" value={request.preferred_date || "—"} />
          <Detail label="Preferred Time" value={request.preferred_time || "—"} />
        </dl>

        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft mb-1.5">Health Concern</p>
          <p className="text-ink leading-relaxed">{request.health_concern || "No details provided."}</p>
        </div>

        {request.follow_up_note && (
          <div className="mb-6 rounded-xl bg-amber-50 border border-amber-200 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 mb-1">Follow-up Note</p>
            <p className="text-sm text-ink">{request.follow_up_note}</p>
            {request.follow_up_date && <p className="text-xs text-ink-soft mt-1">Scheduled: {request.follow_up_date}</p>}
          </div>
        )}

        <RequestDetailActions request={request} whatsappUrl={whatsappUrl} telUrl={telUrl} />
      </div>

      {previous.length > 0 && (
        <div className="rounded-2xl bg-white border border-emerald-soft/70 shadow-card p-6">
          <h2 className="font-display text-lg text-emerald-deep mb-4 flex items-center gap-2">
            <History className="w-5 h-5" /> Previous Requests from This Number
          </h2>
          <div className="space-y-3">
            {previous.map((p) => (
              <Link
                key={p.id}
                href={`/admin/consultation-requests/${p.id}`}
                className="block rounded-xl border border-emerald-soft/60 p-4 hover:bg-emerald-light/30 transition-colors"
              >
                <div className="flex items-center justify-between gap-3 mb-1">
                  <span className="text-sm font-medium text-ink">
                    {new Date(p.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                  <StatusBadge status={p.status} />
                </div>
                <p className="text-xs text-ink-soft capitalize">{p.consultation_type} Consultation</p>
                <p className="text-sm text-ink-soft mt-1 line-clamp-1">{p.health_concern || "No concern noted."}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-ink-soft mb-1">{label}</dt>
      <dd className="text-ink font-medium">{value}</dd>
    </div>
  );
}
