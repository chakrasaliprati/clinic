"use client";

import { useState } from "react";
import { Field, TextInput, Toggle } from "@/components/admin/Field";
import { TimingsListEditor } from "@/components/admin/ListEditor";
import FormActionBar from "@/components/admin/FormActionBar";
import { saveDraftAction, publishAction, discardAction } from "./actions";

export default function ContactSettingsForm({ initial }) {
  const [form, setForm] = useState({
    clinic_name: initial.clinic_name || "",
    phone: initial.phone || "",
    phone_display: initial.phone_display || "",
    whatsapp: initial.whatsapp || "",
    email: initial.email || "",
    has_offline_location: initial.has_offline_location || false,
    address_line1: initial.address_line1 || "",
    address_line2: initial.address_line2 || "",
    address_city: initial.address_city || "",
    address_state: initial.address_state || "",
    address_pincode: initial.address_pincode || "",
    geo_lat: initial.geo_lat || "",
    geo_lng: initial.geo_lng || "",
    maps_url: initial.maps_url || "",
    maps_embed_url: initial.maps_embed_url || "",
    timings: initial.timings || [],
    social: initial.social || {},
  });

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const setSocial = (key, value) => setForm((f) => ({ ...f, social: { ...f.social, [key]: value } }));

  return (
    <div className="max-w-3xl space-y-6">
      <div className="rounded-2xl bg-white border border-emerald-soft/70 shadow-card p-6 space-y-5">
        <h2 className="font-display text-lg text-emerald-deep">Clinic &amp; Contact Details</h2>
        <Field label="Clinic Name"><TextInput value={form.clinic_name} onChange={(e) => set("clinic_name", e.target.value)} /></Field>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Phone (for tel: links)" hint="e.g. +91-90000-00000"><TextInput value={form.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
          <Field label="Phone (display)" hint="e.g. +91 90000 00000"><TextInput value={form.phone_display} onChange={(e) => set("phone_display", e.target.value)} /></Field>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="WhatsApp Number" hint="Digits only, country code first"><TextInput value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} /></Field>
          <Field label="Email"><TextInput value={form.email} onChange={(e) => set("email", e.target.value)} /></Field>
        </div>
        <TimingsListEditor items={form.timings} onChange={(v) => set("timings", v)} />
      </div>

      <div className="rounded-2xl bg-white border border-emerald-soft/70 shadow-card p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg text-emerald-deep">Offline Clinic Location</h2>
          <Toggle checked={form.has_offline_location} onChange={(v) => set("has_offline_location", v)} label="We have a physical location" />
        </div>
        {!form.has_offline_location && (
          <p className="text-xs text-ink-soft bg-emerald-light/50 rounded-lg px-3 py-2">
            While this is off, the public site shows "Available Online" instead of an address. Fill in the
            fields below and switch this on whenever a clinic address is ready.
          </p>
        )}
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Address Line 1"><TextInput value={form.address_line1} onChange={(e) => set("address_line1", e.target.value)} /></Field>
          <Field label="Address Line 2"><TextInput value={form.address_line2} onChange={(e) => set("address_line2", e.target.value)} /></Field>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          <Field label="City"><TextInput value={form.address_city} onChange={(e) => set("address_city", e.target.value)} /></Field>
          <Field label="State"><TextInput value={form.address_state} onChange={(e) => set("address_state", e.target.value)} /></Field>
          <Field label="Pincode"><TextInput value={form.address_pincode} onChange={(e) => set("address_pincode", e.target.value)} /></Field>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Latitude"><TextInput value={form.geo_lat} onChange={(e) => set("geo_lat", e.target.value)} /></Field>
          <Field label="Longitude"><TextInput value={form.geo_lng} onChange={(e) => set("geo_lng", e.target.value)} /></Field>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Google Maps Share URL"><TextInput value={form.maps_url} onChange={(e) => set("maps_url", e.target.value)} /></Field>
          <Field label="Google Maps Embed URL"><TextInput value={form.maps_embed_url} onChange={(e) => set("maps_embed_url", e.target.value)} /></Field>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-emerald-soft/70 shadow-card p-6 space-y-5">
        <h2 className="font-display text-lg text-emerald-deep">Social Media Links</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Instagram"><TextInput value={form.social.instagram || ""} onChange={(e) => setSocial("instagram", e.target.value)} /></Field>
          <Field label="Facebook"><TextInput value={form.social.facebook || ""} onChange={(e) => setSocial("facebook", e.target.value)} /></Field>
          <Field label="YouTube"><TextInput value={form.social.youtube || ""} onChange={(e) => setSocial("youtube", e.target.value)} /></Field>
          <Field label="LinkedIn"><TextInput value={form.social.linkedin || ""} onChange={(e) => setSocial("linkedin", e.target.value)} /></Field>
        </div>
      </div>

      <FormActionBar
        hasDraft={initial._isDraftView}
        getData={() => form}
        onSaveDraft={saveDraftAction}
        onPublish={publishAction}
        onDiscard={discardAction}
        previewHref="/contact"
      />
    </div>
  );
}
