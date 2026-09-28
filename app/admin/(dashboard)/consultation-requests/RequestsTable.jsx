"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import { bulkDeleteSolved } from "./actions";

export default function RequestsTable({ requests }) {
  const [selected, setSelected] = useState([]);
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  const solvedSelected = selected.filter((id) => requests.find((r) => r.id === id)?.status === "solved");

  function toggle(id) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  function handleBulkDelete() {
    startTransition(async () => {
      await bulkDeleteSolved(solvedSelected);
      setSelected([]);
      setConfirming(false);
    });
  }

  if (requests.length === 0) {
    return <p className="text-sm text-ink-soft py-10 text-center">No consultation requests match these filters.</p>;
  }

  return (
    <div>
      {solvedSelected.length > 0 && (
        <div className="mb-4 flex items-center gap-3 rounded-xl bg-emerald-light/60 px-4 py-3">
          <span className="text-sm text-emerald-deep font-medium">{solvedSelected.length} solved request(s) selected</span>
          {!confirming ? (
            <button onClick={() => setConfirming(true)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700">
              <Trash2 className="w-4 h-4" /> Delete Selected
            </button>
          ) : (
            <span className="flex items-center gap-2 text-sm">
              Delete these permanently?
              <button onClick={handleBulkDelete} disabled={pending} className="font-semibold text-red-600 hover:text-red-700">
                {pending ? <Loader2 className="w-4 h-4 animate-spin inline" /> : "Delete"}
              </button>
              <button onClick={() => setConfirming(false)} className="text-ink-soft">Cancel</button>
            </span>
          )}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-emerald-soft/70 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-emerald-soft/70 text-left text-xs uppercase tracking-wide text-ink-soft">
              <th className="px-4 py-3 w-8"></th>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3 hidden sm:table-cell">Phone</th>
              <th className="px-4 py-3 hidden md:table-cell">Type</th>
              <th className="px-4 py-3 hidden lg:table-cell">Submitted</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id} className="border-b border-emerald-soft/40 last:border-0 hover:bg-emerald-light/30">
                <td className="px-4 py-3">
                  {r.status === "solved" && (
                    <input type="checkbox" checked={selected.includes(r.id)} onChange={() => toggle(r.id)} />
                  )}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/consultation-requests/${r.id}`} className="font-medium text-emerald-deep hover:text-gold-deep flex items-center gap-1.5">
                    {r.patient_name}
                    {r.possible_duplicate && <AlertTriangle className="w-3.5 h-3.5 text-gold" title="Possible duplicate request" />}
                  </Link>
                  <span className="sm:hidden text-xs text-ink-soft">{r.phone}</span>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell text-ink-soft">{r.phone}</td>
                <td className="px-4 py-3 hidden md:table-cell text-ink-soft capitalize">{r.consultation_type}</td>
                <td className="px-4 py-3 hidden lg:table-cell text-ink-soft">
                  {new Date(r.created_at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </td>
                <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
