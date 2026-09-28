"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MessageCircle, Phone, CheckCircle2, Loader2 } from "lucide-react";
import { updateStatus } from "../consultation-requests/actions";

export default function FollowUpCard({ request, whatsappUrl, telUrl }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function markSolved() {
    startTransition(async () => {
      await updateStatus(request.id, "solved");
      router.refresh();
    });
  }

  return (
    <div className="rounded-2xl bg-white border border-emerald-soft/70 shadow-card p-5">
      <div className="flex items-start justify-between gap-3 mb-2">
        <Link href={`/admin/consultation-requests/${request.id}`} className="font-display text-lg text-emerald-deep hover:text-gold-deep">
          {request.patient_name}
        </Link>
        <span className="text-xs text-ink-soft capitalize">{request.consultation_type}</span>
      </div>
      <p className="text-sm text-ink-soft mb-1">{request.phone}</p>
      <p className="text-sm text-ink mb-3 line-clamp-2">{request.health_concern || "No concern noted."}</p>

      {request.follow_up_note && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 mb-3">
          <p className="text-xs text-amber-700">{request.follow_up_note}</p>
          {request.follow_up_date && <p className="text-[11px] text-amber-600 mt-0.5">Scheduled: {request.follow_up_date}</p>}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-3.5 py-2 text-xs font-semibold text-white">
          <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
        </a>
        <a href={telUrl} className="inline-flex items-center gap-1.5 rounded-full bg-emerald px-3.5 py-2 text-xs font-semibold text-cream">
          <Phone className="w-3.5 h-3.5" /> Call
        </a>
        <button
          onClick={markSolved}
          disabled={pending}
          className="inline-flex items-center gap-1.5 rounded-full border border-emerald-soft px-3.5 py-2 text-xs font-semibold text-emerald-deep hover:bg-emerald-light disabled:opacity-60"
        >
          {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
          Mark Solved
        </button>
      </div>
    </div>
  );
}
