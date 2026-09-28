"use client";

import { useState, useTransition } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Field, TextInput, Toggle } from "@/components/admin/Field";
import { updateGoogleReviewsConfig } from "./actions";

export default function GoogleReviewsConfig({ initial }) {
  const [form, setForm] = useState({
    enabled: initial?.enabled ?? true,
    place_id: initial?.place_id || "",
    business_profile_url: initial?.business_profile_url || "",
    display_rating: initial?.display_rating || 4.9,
    display_review_count: initial?.display_review_count || 0,
    read_reviews_url: initial?.read_reviews_url || "",
  });
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  function handleSave() {
    setSaved(false);
    startTransition(async () => {
      await updateGoogleReviewsConfig(form);
      setSaved(true);
    });
  }

  return (
    <div className="rounded-2xl bg-white border border-emerald-soft/70 shadow-card p-6 space-y-5">
      <p className="text-xs text-ink-soft bg-emerald-light/50 rounded-lg px-3 py-2">
        Actual Google reviews remain controlled by Google. These settings only control how the Google
        Reviews section is displayed on the site.
      </p>

      <Toggle checked={form.enabled} onChange={(v) => set("enabled", v)} label="Show Google Reviews section" />

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Google Place ID"><TextInput value={form.place_id} onChange={(e) => set("place_id", e.target.value)} /></Field>
        <Field label="Business Profile URL"><TextInput value={form.business_profile_url} onChange={(e) => set("business_profile_url", e.target.value)} /></Field>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Display Rating"><TextInput type="number" step="0.1" min="0" max="5" value={form.display_rating} onChange={(e) => set("display_rating", e.target.value)} /></Field>
        <Field label="Display Review Count"><TextInput type="number" value={form.display_review_count} onChange={(e) => set("display_review_count", e.target.value)} /></Field>
      </div>
      <Field label="'Read reviews on Google' Link"><TextInput value={form.read_reviews_url} onChange={(e) => set("read_reviews_url", e.target.value)} /></Field>

      <div className="flex items-center gap-3 pt-2">
        <button onClick={handleSave} disabled={pending} className="inline-flex items-center gap-2 rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-cream disabled:opacity-60">
          {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
        </button>
        {saved && <span className="text-sm text-emerald-deep flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Saved.</span>}
      </div>
    </div>
  );
}
