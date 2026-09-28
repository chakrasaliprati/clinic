"use client";

import { useState, useTransition } from "react";
import { Plus, Loader2 } from "lucide-react";
import { createPostAction } from "./actions";

export default function NewPostForm() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    startTransition(() => createPostAction(title.trim()));
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-cream shadow-gold hover:bg-emerald-deep transition-colors">
        <Plus className="w-4 h-4" /> New Post
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" className="rounded-full border border-emerald-soft/80 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald" />
      <button type="submit" disabled={pending} className="inline-flex items-center gap-2 rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-cream disabled:opacity-70">
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Create
      </button>
      <button type="button" onClick={() => setOpen(false)} className="text-sm text-ink-soft">Cancel</button>
    </form>
  );
}
