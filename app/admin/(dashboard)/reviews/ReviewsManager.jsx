"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown, Star, Eye, EyeOff, Loader2, Pencil } from "lucide-react";
import { createReview, updateReview, deleteReview, reorderReviews } from "./actions";

const empty = { patient_name: "", rating: 5, review_text: "", concern: "", review_date: new Date().toISOString().slice(0, 10) };

export default function ReviewsManager({ reviews: initialReviews }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [order, setOrder] = useState(initialReviews.map((r) => r.id));
  const [editingId, setEditingId] = useState(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState(empty);
  const [pending, startTransition] = useTransition();
  const [confirmId, setConfirmId] = useState(null);

  const byId = Object.fromEntries(reviews.map((r) => [r.id, r]));

  function startEdit(r) {
    setEditingId(r.id);
    setDraft({ ...r });
    setAdding(false);
  }

  function handleSaveEdit() {
    startTransition(async () => {
      await updateReview(editingId, draft);
      setReviews((rs) => rs.map((r) => (r.id === editingId ? { ...r, ...draft } : r)));
      setEditingId(null);
    });
  }

  function handleCreate() {
    startTransition(async () => {
      await createReview(draft);
      setAdding(false);
      setDraft(empty);
      // A full server refresh will happen on next navigation; for now
      // just reload the list from the server to pick up the new id.
      window.location.reload();
    });
  }

  function togglePublish(r) {
    startTransition(async () => {
      await updateReview(r.id, { is_published: !r.is_published });
      setReviews((rs) => rs.map((x) => (x.id === r.id ? { ...x, is_published: !x.is_published } : x)));
    });
  }

  function handleDelete(id) {
    startTransition(async () => {
      await deleteReview(id);
      setReviews((rs) => rs.filter((r) => r.id !== id));
      setOrder((o) => o.filter((x) => x !== id));
      setConfirmId(null);
    });
  }

  function move(id, dir) {
    const idx = order.indexOf(id);
    const j = idx + dir;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[idx], next[j]] = [next[j], next[idx]];
    setOrder(next);
    startTransition(() => reorderReviews(next));
  }

  return (
    <div>
      <div className="mb-4">
        {!adding ? (
          <button onClick={() => { setAdding(true); setDraft(empty); setEditingId(null); }} className="inline-flex items-center gap-2 rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-cream shadow-gold">
            <Plus className="w-4 h-4" /> Add Review
          </button>
        ) : (
          <ReviewEditor draft={draft} setDraft={setDraft} onCancel={() => setAdding(false)} onSave={handleCreate} pending={pending} saveLabel="Add Review" />
        )}
      </div>

      <div className="rounded-2xl border border-emerald-soft/70 bg-white divide-y divide-emerald-soft/50">
        {order.map((id) => {
          const r = byId[id];
          if (!r) return null;
          if (editingId === id) {
            return (
              <div key={id} className="p-4">
                <ReviewEditor draft={draft} setDraft={setDraft} onCancel={() => setEditingId(null)} onSave={handleSaveEdit} pending={pending} saveLabel="Save Changes" />
              </div>
            );
          }
          return (
            <div key={id} className="flex items-start gap-3 px-4 py-3.5 flex-wrap">
              <div className="flex flex-col mt-1">
                <button onClick={() => move(id, -1)} className="text-ink-soft hover:text-emerald-deep"><ChevronUp className="w-4 h-4" /></button>
                <button onClick={() => move(id, 1)} className="text-ink-soft hover:text-emerald-deep"><ChevronDown className="w-4 h-4" /></button>
              </div>
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-ink">{r.patient_name}</span>
                  <span className="flex">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />)}</span>
                </div>
                <p className="text-sm text-ink-soft mt-1 line-clamp-2">{r.review_text}</p>
              </div>
              <button onClick={() => togglePublish(r)} className="text-ink-soft hover:text-emerald-deep" title={r.is_published ? "Unpublish" : "Publish"}>
                {r.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button onClick={() => startEdit(r)} className="text-ink-soft hover:text-emerald-deep"><Pencil className="w-4 h-4" /></button>
              {confirmId === id ? (
                <span className="flex items-center gap-2 text-xs">
                  Delete?
                  <button onClick={() => handleDelete(id)} className="font-semibold text-red-600">{pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Yes"}</button>
                  <button onClick={() => setConfirmId(null)} className="text-ink-soft">No</button>
                </span>
              ) : (
                <button onClick={() => setConfirmId(id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
              )}
            </div>
          );
        })}
        {reviews.length === 0 && <p className="text-sm text-ink-soft py-10 text-center">No reviews yet.</p>}
      </div>
    </div>
  );
}

function ReviewEditor({ draft, setDraft, onCancel, onSave, pending, saveLabel }) {
  const set = (k, v) => setDraft((d) => ({ ...d, [k]: v }));
  return (
    <div className="rounded-xl border border-emerald-soft/70 bg-emerald-light/30 p-4 space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <input value={draft.patient_name} onChange={(e) => set("patient_name", e.target.value)} placeholder="Patient name" className="rounded-lg border border-emerald-soft/80 bg-white px-3 py-2 text-sm" />
        <input value={draft.concern || ""} onChange={(e) => set("concern", e.target.value)} placeholder="Concern (e.g. Digestive Health)" className="rounded-lg border border-emerald-soft/80 bg-white px-3 py-2 text-sm" />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <select value={draft.rating} onChange={(e) => set("rating", Number(e.target.value))} className="rounded-lg border border-emerald-soft/80 bg-white px-3 py-2 text-sm">
          {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n > 1 ? "s" : ""}</option>)}
        </select>
        <input type="date" value={draft.review_date} onChange={(e) => set("review_date", e.target.value)} className="rounded-lg border border-emerald-soft/80 bg-white px-3 py-2 text-sm" />
      </div>
      <textarea value={draft.review_text} onChange={(e) => set("review_text", e.target.value)} rows={3} placeholder="Review text" className="w-full rounded-lg border border-emerald-soft/80 bg-white px-3 py-2 text-sm" />
      <div className="flex gap-3">
        <button onClick={onSave} disabled={pending} className="inline-flex items-center gap-2 rounded-full bg-emerald px-4 py-2 text-sm font-semibold text-cream disabled:opacity-60">
          {pending && <Loader2 className="w-4 h-4 animate-spin" />} {saveLabel}
        </button>
        <button onClick={onCancel} className="text-sm text-ink-soft">Cancel</button>
      </div>
    </div>
  );
}
