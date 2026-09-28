import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { fetchConsultationRequests } from "@/lib/consultationQuery";
import { buildWhatsAppLink, fillTemplate, telLink } from "@/lib/whatsapp";
import SearchFilterBar from "../consultation-requests/SearchFilterBar";
import FollowUpCard from "./FollowUpCard";

export const dynamic = "force-dynamic";

export default async function FollowUpsPage({ searchParams }) {
  const supabase = createClient();
  const [requests, { data: settings }] = await Promise.all([
    fetchConsultationRequests({ searchParams, forceStatus: "follow_up" }),
    supabase.from("consultation_settings").select("whatsapp_message_template").eq("id", 1).maybeSingle(),
  ]);

  const template = settings?.whatsapp_message_template;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl text-emerald-deep">Follow-ups</h1>
        <p className="text-sm text-ink-soft mt-1">{requests.length} patient(s) waiting on a follow-up.</p>
      </div>

      <SearchFilterBar hideStatus />

      {requests.length === 0 ? (
        <p className="text-sm text-ink-soft py-10 text-center">No follow-ups match these filters.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {requests.map((r) => {
            const message = fillTemplate(template, { concern: r.health_concern || "your consultation" });
            return (
              <FollowUpCard
                key={r.id}
                request={r}
                whatsappUrl={buildWhatsAppLink(r.phone, message)}
                telUrl={telLink(r.phone)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
