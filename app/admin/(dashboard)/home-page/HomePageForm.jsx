"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Field, TextInput, TextArea, Toggle } from "@/components/admin/Field";
import { PickAndOrder } from "@/components/admin/ListEditor";
import FormActionBar from "@/components/admin/FormActionBar";
import { saveDraftAction, publishAction, discardAction } from "./actions";

export default function HomePageForm({ initial, specialities, reviews, faqs }) {
  const [form, setForm] = useState({
    hero_heading: initial.hero_heading || "",
    hero_description: initial.hero_description || "",
    hero_cta_primary_label: initial.hero_cta_primary_label || "Book Consultation",
    hero_cta_secondary_label: initial.hero_cta_secondary_label || "Call Now",
    statistics: initial.statistics || [],
    why_choose_title: initial.why_choose_title || "",
    why_choose_description: initial.why_choose_description || "",
    why_choose_cards: initial.why_choose_cards || [],
    featured_speciality_slugs: initial.featured_speciality_slugs || [],
    featured_review_ids: initial.featured_review_ids || [],
    featured_faq_ids: initial.featured_faq_ids || [],
    get_in_touch_heading: initial.get_in_touch_heading || "",
    get_in_touch_description: initial.get_in_touch_description || "",
  });

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const specialityOptions = specialities.map((s) => ({ id: s.slug, label: s.name }));
  const reviewOptions = reviews.map((r) => ({ id: r.id, label: `${r.patient_name} — ${r.review_text.slice(0, 30)}...` }));
  const faqOptions = faqs.map((f) => ({ id: f.id, label: f.question }));

  return (
    <div className="max-w-3xl space-y-6">
      <div className="rounded-2xl bg-white border border-emerald-soft/70 shadow-card p-6 space-y-5">
        <h2 className="font-display text-lg text-emerald-deep">Hero</h2>
        <Field label="Heading"><TextInput value={form.hero_heading} onChange={(e) => set("hero_heading", e.target.value)} /></Field>
        <Field label="Description"><TextArea rows={3} value={form.hero_description} onChange={(e) => set("hero_description", e.target.value)} /></Field>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Primary Button Label"><TextInput value={form.hero_cta_primary_label} onChange={(e) => set("hero_cta_primary_label", e.target.value)} /></Field>
          <Field label="Secondary Button Label"><TextInput value={form.hero_cta_secondary_label} onChange={(e) => set("hero_cta_secondary_label", e.target.value)} /></Field>
        </div>
        <p className="text-xs text-ink-soft">The doctor's profile photo is managed under Doctor Profile.</p>
      </div>

      <div className="rounded-2xl bg-white border border-emerald-soft/70 shadow-card p-6 space-y-4">
        <h2 className="font-display text-lg text-emerald-deep">Statistics</h2>
        <ObjectListEditor
          items={form.statistics}
          onChange={(v) => set("statistics", v)}
          fields={[{ key: "label", placeholder: "Label (e.g. Years of Experience)" }, { key: "value", placeholder: "Value (e.g. 10+)" }]}
          newItem={{ label: "", value: "", enabled: true }}
        />
      </div>

      <div className="rounded-2xl bg-white border border-emerald-soft/70 shadow-card p-6 space-y-5">
        <h2 className="font-display text-lg text-emerald-deep">Why Choose Us</h2>
        <Field label="Section Title"><TextInput value={form.why_choose_title} onChange={(e) => set("why_choose_title", e.target.value)} /></Field>
        <Field label="Description"><TextArea rows={2} value={form.why_choose_description} onChange={(e) => set("why_choose_description", e.target.value)} /></Field>
        <ObjectListEditor
          items={form.why_choose_cards}
          onChange={(v) => set("why_choose_cards", v)}
          fields={[
            { key: "icon", placeholder: "Icon name (e.g. HeartHandshake)" },
            { key: "title", placeholder: "Card title" },
            { key: "text", placeholder: "Card text", textarea: true },
          ]}
          newItem={{ icon: "Leaf", title: "", text: "", enabled: true }}
        />
      </div>

      <div className="rounded-2xl bg-white border border-emerald-soft/70 shadow-card p-6 space-y-6">
        <h2 className="font-display text-lg text-emerald-deep">Featured Content</h2>
        <PickAndOrder label="Featured Specialities" allItems={specialityOptions} selectedIds={form.featured_speciality_slugs} onChange={(v) => set("featured_speciality_slugs", v)} />
        <PickAndOrder label="Featured Reviews" allItems={reviewOptions} selectedIds={form.featured_review_ids} onChange={(v) => set("featured_review_ids", v)} />
        <PickAndOrder label="Featured FAQs" allItems={faqOptions} selectedIds={form.featured_faq_ids} onChange={(v) => set("featured_faq_ids", v)} />
      </div>

      <div className="rounded-2xl bg-white border border-emerald-soft/70 shadow-card p-6 space-y-5">
        <h2 className="font-display text-lg text-emerald-deep">Get In Touch</h2>
        <Field label="Heading"><TextInput value={form.get_in_touch_heading} onChange={(e) => set("get_in_touch_heading", e.target.value)} /></Field>
        <Field label="Description"><TextArea rows={2} value={form.get_in_touch_description} onChange={(e) => set("get_in_touch_description", e.target.value)} /></Field>
        <p className="text-xs text-ink-soft">Phone, WhatsApp, and address are managed under Contact / Get in Touch.</p>
      </div>

      <FormActionBar
        hasDraft={initial._isDraftView}
        getData={() => form}
        onSaveDraft={saveDraftAction}
        onPublish={publishAction}
        onDiscard={discardAction}
        previewHref="/"
      />
    </div>
  );
}

/** Generic editor for arrays of small objects with an enable toggle (statistics, why-choose cards). */
function ObjectListEditor({ items, onChange, fields, newItem }) {
  const list = items || [];
  function update(i, key, value) {
    const next = [...list];
    next[i] = { ...next[i], [key]: value };
    onChange(next);
  }
  function remove(i) { onChange(list.filter((_, idx) => idx !== i)); }

  return (
    <div className="space-y-3">
      {list.map((item, i) => (
        <div key={i} className="rounded-xl border border-emerald-soft/70 p-4 bg-cream/60 space-y-2">
          <div className="flex items-start gap-2">
            <div className="flex-1 grid sm:grid-cols-2 gap-2">
              {fields.map((f) =>
                f.textarea ? (
                  <textarea key={f.key} value={item[f.key] || ""} onChange={(e) => update(i, f.key, e.target.value)} placeholder={f.placeholder} rows={2} className="sm:col-span-2 rounded-lg border border-emerald-soft/80 bg-white px-3 py-2 text-sm" />
                ) : (
                  <input key={f.key} value={item[f.key] || ""} onChange={(e) => update(i, f.key, e.target.value)} placeholder={f.placeholder} className="rounded-lg border border-emerald-soft/80 bg-white px-3 py-2 text-sm" />
                )
              )}
            </div>
            <button type="button" onClick={() => remove(i)} className="p-1.5 text-red-500 hover:text-red-700 shrink-0"><Trash2 className="w-4 h-4" /></button>
          </div>
          <Toggle checked={item.enabled !== false} onChange={(v) => update(i, "enabled", v)} label="Enabled" />
        </div>
      ))}
      <button type="button" onClick={() => onChange([...list, { ...newItem }])} className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-deep hover:text-gold-deep">
        <Plus className="w-4 h-4" /> Add
      </button>
    </div>
  );
}
