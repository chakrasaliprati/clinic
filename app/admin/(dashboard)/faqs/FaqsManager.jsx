"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown, Eye, EyeOff, Loader2, Pencil } from "lucide-react";
import { createFaq, updateFaq, deleteFaq, reorderFaqs } from "./actions";

const empty = { question: "", answer: "", category: "General" };

export default function FaqsManager({ faqs: initialFaqs }) {
  const [faqs, setFaqs] = useState(initialFaqs);
  const [order, setOrder] = useState(initialFaqs.map((f) => f.id));
  const [editingId, setEditingId] = useState(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState(empty);
  const [pending, startTransition] = useTransition();
  const [confirmId, setConfirmId] = useState(null);

  const byId = Object.fromEntries(faqs.map((f) => [f.id, f]));

  function startEdit(f) {
    setEditingId(f.id);
    setDraft({ ...f });
    setAdding(false);
  }

  function handleSaveEdit() {
    startTransition(async () => {
      await updateFaq(editingId, draft);
      setFaqs((fs) => fs.map((f) => (f.id === editingId ? { ...f, ...draft } : f)));
      setEditingId(null);
    });
  }

  function handleCreate() {
    startTransition(async () => {
      await createFaq(draft);
      setAdding(false);
      setDraft(empty);
      window.location.reload();
    });
  }

  function togglePublish(f) {
    startTransition(async () => {
      await updateFaq(f.id, { is_published: !f.is_published });
      setFaqs((fs) => fs.map((x) => (x.id === f.id ? { ...x, is_published: !x.is_published } : x)));
    });
  }

  function handleDelete(id) {
    startTransition(async () => {
      await deleteFaq(id);
      setFaqs((fs) => fs.filter((f) => f.id !== id));
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
    startTransition(() => reorderFaqs(next));
  }

  return (
    <div>
      <div className="mb-4">
        {!adding ? (
          <button onClick={() => { setAdding(true); setDraft(empty); setEditingId(null); }} className="inline-flex items-center gap-2 rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-cream shadow-gold">
            <Plus className="w-4 h-4" /> Add FAQ
          </button>
        ) : (
          <FaqEditor draft={draft} setDraft={setDraft} onCancel={() => setAdding(false)} onSave={handleCreate} pending={pending} saveLabel="Add FAQ" />
        )}
      </div>

      <div className="rounded-2xl border border-emerald-soft/70 bg-white divide-y divide-emerald-soft/50">
        {order.map((id) => {
          const f = byId[id];
          if (!f) return null;
          if (editingId === id) {
            return <div key={id} className="p-4"><FaqEditor draft={draft} setDraft={setDraft} onCancel={() => setEditingId(null)} onSave={handleSaveEdit} pending={pending} saveLabel="Save Changes" /></div>;
          }
          return (
            <div key={id} className="flex items-start gap-3 px-4 py-3.5 flex-wrap">
              <div className="flex flex-col mt-1">
                <button onClick={() => move(id, -1)} className="text-ink-soft hover:text-emerald-deep"><ChevronUp className="w-4 h-4" /></button>
                <button onClick={() => move(id, 1)} className="text-ink-soft hover:text-emerald-deep"><ChevronDown className="w-4 h-4" /></button>
              </div>
              <div className="flex-1 min-w-[200px]">
                <p className="font-medium text-ink">{f.question}</p>
                <p className="text-xs text-ink-soft mt-0.5">{f.category}</p>
              </div>
              <button onClick={() => togglePublish(f)} className="text-ink-soft hover:text-emerald-deep">{f.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}</button>
              <button onClick={() => startEdit(f)} className="text-ink-soft hover:text-emerald-deep"><Pencil className="w-4 h-4" /></button>
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
        {faqs.length === 0 && <p className="text-sm text-ink-soft py-10 text-center">No FAQs yet.</p>}
      </div>
    </div>
  );
}

function FaqEditor({ draft, setDraft, onCancel, onSave, pending, saveLabel }) {
  const set = (k, v) => setDraft((d) => ({ ...d, [k]: v }));
  return (
    <div className="rounded-xl border border-emerald-soft/70 bg-emerald-light/30 p-4 space-y-3">
      <input value={draft.question} onChange={(e) => set("question", e.target.value)} placeholder="Question" className="w-full rounded-lg border border-emerald-soft/80 bg-white px-3 py-2 text-sm font-medium" />
      <textarea value={draft.answer} onChange={(e) => set("answer", e.target.value)} rows={3} placeholder="Answer" className="w-full rounded-lg border border-emerald-soft/80 bg-white px-3 py-2 text-sm" />
      <input value={draft.category} onChange={(e) => set("category", e.target.value)} placeholder="Category (e.g. General)" className="rounded-lg border border-emerald-soft/80 bg-white px-3 py-2 text-sm" />
      <div className="flex gap-3">
        <button onClick={onSave} disabled={pending} className="inline-flex items-center gap-2 rounded-full bg-emerald px-4 py-2 text-sm font-semibold text-cream disabled:opacity-60">
          {pending && <Loader2 className="w-4 h-4 animate-spin" />} {saveLabel}
        </button>
        <button onClick={onCancel} className="text-sm text-ink-soft">Cancel</button>
      </div>
    </div>
  );
}
