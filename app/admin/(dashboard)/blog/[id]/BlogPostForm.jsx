"use client";

import { useState } from "react";
import { Field, TextInput, TextArea } from "@/components/admin/Field";
import { StringListEditor, FaqListEditor } from "@/components/admin/ListEditor";
import FormActionBar from "@/components/admin/FormActionBar";
import { saveDraftAction, publishAction, discardAction } from "../actions";

export default function BlogPostForm({ initial }) {
  const [form, setForm] = useState({
    title: initial.title || "",
    slug: initial.slug || "",
    short_description: initial.short_description || "",
    content: initial.content || "",
    category: initial.category || "General",
    tags: initial.tags || [],
    author: initial.author || "Dr. Pratibha Y.C.",
    faqs: initial.faqs || [],
    seo_title: initial.seo_title || "",
    meta_description: initial.meta_description || "",
  });

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="max-w-3xl space-y-6">
      <div className="rounded-2xl bg-white border border-emerald-soft/70 shadow-card p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Title"><TextInput value={form.title} onChange={(e) => set("title", e.target.value)} /></Field>
          <Field label="URL Slug"><TextInput value={form.slug} onChange={(e) => set("slug", e.target.value)} /></Field>
        </div>
        <Field label="Short Description" hint="Shown on the blog listing page."><TextArea rows={2} value={form.short_description} onChange={(e) => set("short_description", e.target.value)} /></Field>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Category"><TextInput value={form.category} onChange={(e) => set("category", e.target.value)} /></Field>
          <Field label="Author"><TextInput value={form.author} onChange={(e) => set("author", e.target.value)} /></Field>
        </div>
        <StringListEditor label="Tags" items={form.tags} onChange={(v) => set("tags", v)} placeholder="e.g. digestion" />
      </div>

      <div className="rounded-2xl bg-white border border-emerald-soft/70 shadow-card p-6 space-y-3">
        <h2 className="font-display text-lg text-emerald-deep">Article Content</h2>
        <p className="text-xs text-ink-soft">Write in plain paragraphs — leave a blank line between paragraphs. No HTML needed.</p>
        <TextArea rows={16} value={form.content} onChange={(e) => set("content", e.target.value)} className="font-mono text-[13px]" />
      </div>

      <div className="rounded-2xl bg-white border border-emerald-soft/70 shadow-card p-6 space-y-5">
        <h2 className="font-display text-lg text-emerald-deep">FAQs</h2>
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
        previewHref={`/blog/${form.slug}`}
      />
    </div>
  );
}
