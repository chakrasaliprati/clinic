"use client";

import { useState, useTransition } from "react";
import { Eye, Save, UploadCloud, Undo2, Loader2, CheckCircle2 } from "lucide-react";

/**
 * Props:
 *  - hasDraft: boolean — whether there are unpublished pending changes
 *  - getData(): () => object — snapshot of the current form state to persist
 *  - onSaveDraft(data), onPublish(data), onDiscard() — server actions
 *  - previewHref?: string — link to view the draft/published item publicly
 */
export default function FormActionBar({ hasDraft, getData, onSaveDraft, onPublish, onDiscard, previewHref }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [busyAction, setBusyAction] = useState(null);

  function run(action, label, successText) {
    setBusyAction(label);
    setMessage("");
    startTransition(async () => {
      try {
        await action(getData());
        setMessage(successText);
      } catch {
        setMessage("We couldn't save this change. Please try again.");
      } finally {
        setBusyAction(null);
      }
    });
  }

  return (
    <div className="sticky bottom-0 -mx-4 sm:-mx-6 lg:-mx-8 mt-8 border-t border-emerald-soft/70 bg-white/95 backdrop-blur px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center gap-3">
      <span
        className={`text-xs font-semibold uppercase tracking-wide rounded-full px-2.5 py-1 ${
          hasDraft ? "bg-gold-light text-gold-deep" : "bg-emerald-light text-emerald-deep"
        }`}
      >
        {hasDraft ? "Draft changes" : "Published"}
      </span>

      {message && (
        <span className="text-sm text-emerald-deep flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" /> {message}
        </span>
      )}

      <div className="flex-1" />

      {previewHref && (
        <a
          href={previewHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-emerald-soft px-4 py-2.5 text-sm font-semibold text-ink-soft hover:bg-emerald-light transition-colors"
        >
          <Eye className="w-4 h-4" /> Preview
        </a>
      )}

      {hasDraft && onDiscard && (
        <button
          type="button"
          disabled={pending}
          onClick={() => run(onDiscard, "discard", "Draft changes discarded.")}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-soft px-4 py-2.5 text-sm font-semibold text-ink-soft hover:bg-cream-dim transition-colors disabled:opacity-60"
        >
          {busyAction === "discard" && pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Undo2 className="w-4 h-4" />}
          Discard Changes
        </button>
      )}

      <button
        type="button"
        disabled={pending}
        onClick={() => run(onSaveDraft, "draft", "Saved as draft.")}
        className="inline-flex items-center gap-2 rounded-full border border-emerald px-5 py-2.5 text-sm font-semibold text-emerald-deep hover:bg-emerald-light transition-colors disabled:opacity-60"
      >
        {busyAction === "draft" && pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Save Draft
      </button>

      <button
        type="button"
        disabled={pending}
        onClick={() => run(onPublish, "publish", "Published successfully.")}
        className="inline-flex items-center gap-2 rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-cream shadow-gold hover:bg-emerald-deep transition-colors disabled:opacity-60"
      >
        {busyAction === "publish" && pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
        Publish
      </button>
    </div>
  );
}
