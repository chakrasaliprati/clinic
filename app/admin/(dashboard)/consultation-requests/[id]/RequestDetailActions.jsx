"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Phone, CheckCircle2, RotateCcw, Trash2, Loader2 } from "lucide-react";
import { updateStatus, saveFollowUp, deleteRequest } from "../actions";

export default function RequestDetailActions({ request, whatsappUrl, telUrl }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState(null);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [note, setNote] = useState(request.follow_up_note || "");
  const [date, setDate] = useState(request.follow_up_date || "");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");

  function setStatus(status) {
    setBusy(status);
    setError("");
    startTransition(async () => {
      try {
        await updateStatus(request.id, status);
        router.refresh();
      } catch (e) {
        setError(e.message);
      } finally {
        setBusy(null);
      }
    });
  }

  function submitFollowUp() {
    setBusy("follow_up_save");
    startTransition(async () => {
      try {
        await saveFollowUp(request.id, { note, date });
        setShowFollowUp(false);
        router.refresh();
      } catch (e) {
        setError(e.message);
      } finally {
        setBusy(null);
      }
    });
  }

  function handleDelete() {
    setBusy("delete");
    startTransition(async () => {
      try {
        await deleteRequest(request.id);
        router.push("/admin/consultation-requests");
      } catch (e) {
        setError(e.message);
        setBusy(null);
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
        >
          <MessageCircle className="w-4 h-4" /> WhatsApp
        </a>
        <a
          href={telUrl}
          className="inline-flex items-center gap-2 rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-cream hover:bg-emerald-deep transition-colors"
        >
          <Phone className="w-4 h-4" /> Call Patient
        </a>
      </div>

      <div className="flex flex-wrap gap-2.5">
        <StatusButton label="Mark Contacted" active={request.status === "contacted"} busy={busy === "contacted" && pending} onClick={() => setStatus("contacted")} />
        <StatusButton label="Follow-up" active={request.status === "follow_up"} busy={busy === "follow_up" && pending} onClick={() => setShowFollowUp((v) => !v)} />
        <StatusButton label="Mark Solved" active={request.status === "solved"} busy={busy === "solved" && pending} onClick={() => setStatus("solved")} icon={CheckCircle2} />
      </div>

      {showFollowUp && (
        <div className="rounded-xl border border-emerald-soft/70 bg-emerald-light/40 p-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-ink-soft mb-1">Follow-up Note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="e.g. Follow up after 7 days."
              className="w-full rounded-lg border border-emerald-soft/80 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-soft mb-1">Follow-up Date</label>
            <input
              type="date"
              value={date || ""}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-lg border border-emerald-soft/80 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
            />
          </div>
          <button
            onClick={submitFollowUp}
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-full bg-emerald px-4 py-2 text-sm font-semibold text-cream hover:bg-emerald-deep"
          >
            {busy === "follow_up_save" && pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
            Save Follow-up
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {request.status === "solved" && (
        <div className="pt-2 border-t border-emerald-soft/50">
          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:text-red-700">
              <Trash2 className="w-4 h-4" /> Delete this request
            </button>
          ) : (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-ink mb-3">Delete this consultation request permanently?</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(false)} className="text-sm font-semibold text-ink-soft">Cancel</button>
                <button onClick={handleDelete} disabled={pending} className="text-sm font-semibold text-red-600 hover:text-red-700">
                  {busy === "delete" && pending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatusButton({ label, active, busy, onClick, icon: Icon = CheckCircle2 }) {
  return (
    <button
      onClick={onClick}
      disabled={busy}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold border transition-colors disabled:opacity-60 ${
        active ? "bg-emerald text-cream border-emerald" : "border-emerald-soft text-emerald-deep hover:bg-emerald-light"
      }`}
    >
      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Icon className="w-4 h-4" />}
      {label}
    </button>
  );
}
