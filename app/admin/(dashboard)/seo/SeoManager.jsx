"use client";

import { useState, useTransition } from "react";
import { ChevronDown, Loader2, CheckCircle2 } from "lucide-react";
import { Field, TextInput, TextArea } from "@/components/admin/Field";
import { updateSeoSetting } from "./actions";

export default function SeoManager({ rows, labels }) {
  const [openKey, setOpenKey] = useState(rows[0]?.page_key);

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <SeoCard
          key={row.page_key}
          row={row}
          label={labels[row.page_key] || row.page_key}
          open={openKey === row.page_key}
          onToggle={() => setOpenKey(openKey === row.page_key ? null : row.page_key)}
        />
      ))}
    </div>
  );
}

function SeoCard({ row, label, open, onToggle }) {
  const [form, setForm] = useState({
    title: row.title || "",
    meta_description: row.meta_description || "",
    og_title: row.og_title || "",
    og_description: row.og_description || "",
    canonical_url: row.canonical_url || "",
  });
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  function handleSave() {
    setSaved(false);
    startTransition(async () => {
      await updateSeoSetting(row.page_key, form);
      setSaved(true);
    });
  }

  return (
    <div className="rounded-2xl bg-white border border-emerald-soft/70 shadow-card overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center justify-between px-6 py-4">
        <span className="font-display text-base text-emerald-deep">{label}</span>
        <ChevronDown className={`w-4 h-4 text-emerald-deep transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="border-t border-emerald-soft/70 p-6 space-y-4">
          <Field label="SEO Title"><TextInput value={form.title} onChange={(e) => set("title", e.target.value)} /></Field>
          <Field label="Meta Description"><TextArea rows={2} value={form.meta_description} onChange={(e) => set("meta_description", e.target.value)} /></Field>
          <Field label="OG Title"><TextInput value={form.og_title} onChange={(e) => set("og_title", e.target.value)} /></Field>
          <Field label="OG Description"><TextArea rows={2} value={form.og_description} onChange={(e) => set("og_description", e.target.value)} /></Field>
          <Field label="Canonical URL"><TextInput value={form.canonical_url} onChange={(e) => set("canonical_url", e.target.value)} /></Field>
          <div className="flex items-center gap-3">
            <button onClick={handleSave} disabled={pending} className="inline-flex items-center gap-2 rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-cream disabled:opacity-60">
              {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
            </button>
            {saved && <span className="text-sm text-emerald-deep flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Saved.</span>}
          </div>
        </div>
      )}
    </div>
  );
}
