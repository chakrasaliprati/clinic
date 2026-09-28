"use client";

import { useState } from "react";
import { Field, TextInput, TextArea, Toggle } from "@/components/admin/Field";
import { TimingsListEditor, PlatformsListEditor } from "@/components/admin/ListEditor";
import FormActionBar from "@/components/admin/FormActionBar";
import { saveDraftAction, publishAction, discardAction } from "./actions";

export default function ConsultationSettingsForm({ initial }) {
  const [form, setForm] = useState({
    clinic_enabled: initial.clinic_enabled || false,
    clinic_title: initial.clinic_title || "Clinic Consultation",
    clinic_description: initial.clinic_description || "",
    clinic_address: initial.clinic_address || "",
    clinic_maps_url: initial.clinic_maps_url || "",
    clinic_maps_embed_url: initial.clinic_maps_embed_url || "",
    clinic_timings: initial.clinic_timings || [],
    clinic_fee: initial.clinic_fee || "",
    clinic_availability: initial.clinic_availability || "",
    online_enabled: initial.online_enabled ?? true,
    online_title: initial.online_title || "Online Consultation",
    online_description: initial.online_description || "",
    online_timings: initial.online_timings || [],
    online_fee: initial.online_fee || "",
    online_availability: initial.online_availability || "",
    online_platforms: initial.online_platforms || [],
    whatsapp_message_template: initial.whatsapp_message_template || "",
  });

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="max-w-3xl space-y-6">
      <div className="rounded-2xl bg-white border border-emerald-soft/70 shadow-card p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg text-emerald-deep">Clinic Consultation</h2>
          <Toggle checked={form.clinic_enabled} onChange={(v) => set("clinic_enabled", v)} label="Enabled" />
        </div>
        <Field label="Title"><TextInput value={form.clinic_title} onChange={(e) => set("clinic_title", e.target.value)} /></Field>
        <Field label="Description"><TextArea rows={2} value={form.clinic_description} onChange={(e) => set("clinic_description", e.target.value)} /></Field>
        <Field label="Address"><TextArea rows={2} value={form.clinic_address} onChange={(e) => set("clinic_address", e.target.value)} /></Field>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Google Maps Share URL"><TextInput value={form.clinic_maps_url} onChange={(e) => set("clinic_maps_url", e.target.value)} /></Field>
          <Field label="Google Maps Embed URL"><TextInput value={form.clinic_maps_embed_url} onChange={(e) => set("clinic_maps_embed_url", e.target.value)} /></Field>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Consultation Fee"><TextInput value={form.clinic_fee} onChange={(e) => set("clinic_fee", e.target.value)} /></Field>
          <Field label="Availability Note"><TextInput value={form.clinic_availability} onChange={(e) => set("clinic_availability", e.target.value)} /></Field>
        </div>
        <TimingsListEditor items={form.clinic_timings} onChange={(v) => set("clinic_timings", v)} />
      </div>

      <div className="rounded-2xl bg-white border border-emerald-soft/70 shadow-card p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg text-emerald-deep">Online Consultation</h2>
          <Toggle checked={form.online_enabled} onChange={(v) => set("online_enabled", v)} label="Enabled" />
        </div>
        <Field label="Title"><TextInput value={form.online_title} onChange={(e) => set("online_title", e.target.value)} /></Field>
        <Field label="Description"><TextArea rows={2} value={form.online_description} onChange={(e) => set("online_description", e.target.value)} /></Field>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Consultation Fee"><TextInput value={form.online_fee} onChange={(e) => set("online_fee", e.target.value)} /></Field>
          <Field label="Availability Note"><TextInput value={form.online_availability} onChange={(e) => set("online_availability", e.target.value)} /></Field>
        </div>
        <TimingsListEditor items={form.online_timings} onChange={(v) => set("online_timings", v)} />
        <PlatformsListEditor items={form.online_platforms} onChange={(v) => set("online_platforms", v)} />
      </div>

      <div className="rounded-2xl bg-white border border-emerald-soft/70 shadow-card p-6 space-y-3">
        <h2 className="font-display text-lg text-emerald-deep">WhatsApp Message Template</h2>
        <p className="text-xs text-ink-soft">Use <code className="bg-cream-dim px-1 rounded">{"{concern}"}</code> to insert the patient's health concern automatically.</p>
        <TextArea rows={3} value={form.whatsapp_message_template} onChange={(e) => set("whatsapp_message_template", e.target.value)} />
      </div>

      <FormActionBar
        hasDraft={initial._isDraftView}
        getData={() => form}
        onSaveDraft={saveDraftAction}
        onPublish={publishAction}
        onDiscard={discardAction}
        previewHref="/consultation"
      />
    </div>
  );
}
