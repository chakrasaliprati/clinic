"use client";

import { useState } from "react";
import { Field, TextInput, TextArea, Toggle } from "@/components/admin/Field";
import { StringListEditor, FaqListEditor } from "@/components/admin/ListEditor";
import FormActionBar from "@/components/admin/FormActionBar";
import { saveDraftAction, publishAction, discardAction } from "../actions";

const groupOptions = [
  "Skin Disorders", "Joint Disorders", "Metabolic Disorders", "GI Disorders",
  "Respiratory Disorders", "Ano-rectal Disorders", "Organ Health",
  "Mind & Nervous System", "General Wellness",
];

export default function SpecialityForm({ initial }) {
  const [form, setForm] = useState({
    name: initial.name || "",
    slug: initial.slug || "",
    short_description: initial.short_description || "",
    icon: initial.icon || "Leaf",
    group_name: initial.group_name || groupOptions[0],
    is_featured: initial.is_featured || false,
    hub_path: initial.hub_path || "",
    homepage_featured: initial.homepage_featured || false,
    overview: initial.overview || "",
    symptoms: initial.symptoms || [],
    causes: initial.causes || [],
    approach: initial.approach || "",
    lifestyle: initial.lifestyle || [],
    diet: initial.diet || [],
    faqs: initial.faqs || [],
    seo_title: initial.seo_title || "",
    meta_description: initial.meta_description || "",
  });

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="max-w-3xl space-y-6">
      <div className="rounded-2xl bg-white border border-emerald-soft/70 shadow-card p-6 space-y-5">
        <h2 className="font-display text-lg text-emerald-deep">Basics</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Name"><TextInput value={form.name} onChange={(e) => set("name", e.target.value)} /></Field>
          <Field label="URL Slug" hint="Appears as /services/your-slug"><TextInput value={form.slug} onChange={(e) => set("slug", e.target.value)} /></Field>
        </div>
        <Field label="Short Description" hint="Shown on service cards."><TextArea rows={2} value={form.short_description} onChange={(e) => set("short_description", e.target.value)} /></Field>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Icon" hint="Any lucide-react icon name, e.g. Leaf, Sparkles, Bone."><TextInput value={form.icon} onChange={(e) => set("icon", e.target.value)} /></Field>
          <Field label="Group">
            <select value={form.group_name} onChange={(e) => set("group_name", e.target.value)} className="w-full rounded-xl border border-emerald-soft/80 bg-cream px-4 py-2.5 text-sm">
              {groupOptions.map((g) => <option key={g}>{g}</option>)}
            </select>
          </Field>
        </div>
        <div className="flex flex-wrap gap-6">
          <Toggle checked={form.is_featured} onChange={(v) => set("is_featured", v)} label="Featured speciality (hero card + own hub page)" />
          <Toggle checked={form.homepage_featured} onChange={(v) => set("homepage_featured", v)} label="Show on homepage" />
        </div>
        {form.is_featured && (
          <Field label="Hub Page Path" hint="e.g. /psoriasis-treatment — leave blank to use /services/[slug]">
            <TextInput value={form.hub_path} onChange={(e) => set("hub_path", e.target.value)} />
          </Field>
        )}
      </div>

      <div className="rounded-2xl bg-white border border-emerald-soft/70 shadow-card p-6 space-y-5">
        <h2 className="font-display text-lg text-emerald-deep">Page Content</h2>
        <Field label="Overview"><TextArea rows={3} value={form.overview} onChange={(e) => set("overview", e.target.value)} /></Field>
        <StringListEditor label="Symptoms" items={form.symptoms} onChange={(v) => set("symptoms", v)} />
        <StringListEditor label="Causes" items={form.causes} onChange={(v) => set("causes", v)} />
        <Field label="Ayurvedic Treatment Approach"><TextArea rows={3} value={form.approach} onChange={(e) => set("approach", e.target.value)} /></Field>
        <StringListEditor label="Lifestyle Recommendations" items={form.lifestyle} onChange={(v) => set("lifestyle", v)} />
        <StringListEditor label="Diet Guidance" items={form.diet} onChange={(v) => set("diet", v)} />
        <FaqListEditor items={form.faqs} onChange={(v) => set("faqs", v)} />
      </div>

      <div className="rounded-2xl bg-white border border-emerald-soft/70 shadow-card p-6 space-y-5">
        <h2 className="font-display text-lg text-emerald-deep">SEO</h2>
        <Field label="SEO Title"><TextInput value={form.seo_title} onChange={(e) => set("seo_title", e.target.value)} /></Field>
        <Field label="Meta Description"><TextArea rows={2} value={form.meta_description} onChange={(e) => set("meta_description", e.target.value)} /></Field>
      </div>

      <FormActionBar
        hasDraft={initial.has_draft}
        getData={() => form}
        onSaveDraft={(data) => saveDraftAction(initial.id, data)}
        onPublish={(data) => publishAction(initial.id, data)}
        onDiscard={() => discardAction(initial.id)}
        previewHref={form.hub_path || `/services/${form.slug}`}
      />
    </div>
  );
}
