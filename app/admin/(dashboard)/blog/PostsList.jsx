"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ChevronUp, ChevronDown, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import { reorderAction, unpublishAction, publishAction, deleteAction } from "./actions";

export default function PostsList({ posts }) {
  const [order, setOrder] = useState(posts.map((p) => p.id));
  const [pending, startTransition] = useTransition();
  const [confirmId, setConfirmId] = useState(null);
  const byId = Object.fromEntries(posts.map((p) => [p.id, p]));

  function move(id, dir) {
    const idx = order.indexOf(id);
    const j = idx + dir;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[idx], next[j]] = [next[j], next[idx]];
    setOrder(next);
    startTransition(() => reorderAction(next));
  }

  function togglePublish(p) {
    startTransition(async () => {
      if (p.is_published) await unpublishAction(p.id);
      else await publishAction(p.id, p.draft_payload || {});
    });
  }

  function handleDelete(id) {
    startTransition(async () => {
      await deleteAction(id);
      setConfirmId(null);
    });
  }

  if (posts.length === 0) {
    return <p className="text-sm text-ink-soft py-10 text-center">No blog posts yet.</p>;
  }

  return (
    <div className="rounded-2xl border border-emerald-soft/70 bg-white divide-y divide-emerald-soft/50">
      {order.map((id) => {
        const p = byId[id];
        if (!p) return null;
        return (
          <div key={id} className="flex items-center gap-3 px-4 py-3.5 flex-wrap">
            <div className="flex flex-col">
              <button onClick={() => move(id, -1)} className="text-ink-soft hover:text-emerald-deep"><ChevronUp className="w-4 h-4" /></button>
              <button onClick={() => move(id, 1)} className="text-ink-soft hover:text-emerald-deep"><ChevronDown className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 min-w-[160px]">
              <Link href={`/admin/blog/${id}`} className="font-medium text-ink hover:text-emerald-deep">{p.title || "Untitled"}</Link>
              <p className="text-xs text-ink-soft">{p.category} · /blog/{p.slug}</p>
            </div>
            <span className={`text-xs font-semibold uppercase tracking-wide rounded-full px-2.5 py-1 ${p.is_published ? "bg-emerald-light text-emerald-deep" : "bg-gold-light text-gold-deep"}`}>
              {p.is_published ? "Published" : "Draft"}
            </span>
            {p.has_draft && <span className="text-xs font-semibold uppercase tracking-wide rounded-full px-2.5 py-1 bg-amber-100 text-amber-700">Pending Edits</span>}
            <button onClick={() => togglePublish(p)} disabled={pending} className="text-ink-soft hover:text-emerald-deep">{p.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
            {confirmId === id ? (
              <span className="flex items-center gap-2 text-xs">
                Delete?
                <button onClick={() => handleDelete(id)} disabled={pending} className="font-semibold text-red-600">{pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Yes"}</button>
                <button onClick={() => setConfirmId(null)} className="text-ink-soft">No</button>
              </span>
            ) : (
              <button onClick={() => setConfirmId(id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
            )}
          </div>
        );
      })}
    </div>
  );
}
