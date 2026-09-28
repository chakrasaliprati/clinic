"use client";

import { useState } from "react";
import { Field, TextInput, TextArea, Toggle } from "@/components/admin/Field";
import FormActionBar from "@/components/admin/FormActionBar";
import { saveDraftAction, publishAction, discardAction } from "./actions";

export default function WebsiteNoticeForm({ initial }) {
  const [form, setForm] = useState({
    enabled: initial.enabled || false,
    title: initial.title || "",
    description: initial.description || "",
    button_text: initial.button_text || "",
    button_url: initial.button_url || "",
    start_date: initial.start_date || "",
    end_date: initial.end_date || "",
    frequency: initial.frequency || "once",
  });

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-2xl bg-white border border-emerald-soft/70 shadow-card p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg text-emerald-deep">Announcement Popup</h2>
          <Toggle checked={form.enabled} onChange={(v) => set("enabled", v)} label="Enabled" />
        </div>
        <Field label="Title"><TextInput value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Online consultations available" /></Field>
        <Field label="Description"><TextArea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} /></Field>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Button Text (optional)"><TextInput value={form.button_text} onChange={(e) => set("button_text", e.target.value)} /></Field>
          <Field label="Button URL (optional)"><TextInput value={form.button_url} onChange={(e) => set("button_url", e.target.value)} /></Field>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Start Date (optional)"><TextInput type="date" value={form.start_date} onChange={(e) => set("start_date", e.target.value)} /></Field>
          <Field label="End Date (optional)"><TextInput type="date" value={form.end_date} onChange={(e) => set("end_date", e.target.value)} /></Field>
        </div>
        <Field label="Show Frequency">
          <select value={form.frequency} onChange={(e) => set("frequency", e.target.value)} className="w-full rounded-xl border border-emerald-soft/80 bg-cream px-4 py-2.5 text-sm">
            <option value="once">Show once per visitor</option>
            <option value="every">Show every visit</option>
          </select>
        </Field>
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
