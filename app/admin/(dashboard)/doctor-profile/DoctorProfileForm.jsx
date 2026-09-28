"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, Trash2, Loader2 } from "lucide-react";
import { Field, TextInput, TextArea } from "@/components/admin/Field";
import { StringListEditor } from "@/components/admin/ListEditor";
import FormActionBar from "@/components/admin/FormActionBar";
import { saveDraftAction, publishAction, discardAction } from "./actions";

export default function DoctorProfileForm({ initial }) {
  const [form, setForm] = useState({
    name: initial.name || "",
    qualification: initial.qualification || "",
    short_intro: initial.short_intro || "",
    about_biography: initial.about_biography || "",
    experience_years: initial.experience_years || "",
    areas_of_expertise: initial.areas_of_expertise || [],
    languages: initial.languages || [],
  });
  const [photoUrl, setPhotoUrl] = useState(initial.photo_url || "");
  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const fileInputRef = useRef(null);

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setPhotoError("");

    const body = new FormData();
    body.append("photo", file);

    try {
      const res = await fetch("/api/admin/profile-photo", { method: "POST", body });
      const json = await res.json();
      if (json.ok) {
        setPhotoUrl(json.url);
      } else {
        setPhotoError(json.message || "We couldn't save this change. Please try again.");
      }
    } catch {
      setPhotoError("We couldn't save this change. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleRemovePhoto() {
    setUploading(true);
    setPhotoError("");
    try {
      const res = await fetch("/api/admin/profile-photo", { method: "DELETE" });
      const json = await res.json();
      if (json.ok) setPhotoUrl("");
      else setPhotoError(json.message);
    } catch {
      setPhotoError("We couldn't remove the photo. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div className="rounded-2xl bg-white border border-emerald-soft/70 shadow-card p-6 mb-6">
        <h2 className="font-display text-lg text-emerald-deep mb-4">Profile Photograph</h2>
        <div className="flex items-center gap-5">
          <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-emerald-soft bg-emerald-light shrink-0">
            {photoUrl ? (
              <Image src={photoUrl} alt="Doctor profile" fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-emerald-deep/50 text-xs">No photo</div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="inline-flex items-center gap-2 rounded-full border border-emerald px-4 py-2 text-sm font-semibold text-emerald-deep hover:bg-emerald-light cursor-pointer w-fit">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {photoUrl ? "Replace Photo" : "Upload Photo"}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} className="hidden" />
            </label>
            {photoUrl && (
              <button onClick={handleRemovePhoto} disabled={uploading} className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:text-red-700 w-fit">
                <Trash2 className="w-4 h-4" /> Remove Photo
              </button>
            )}
            {photoError && <p className="text-xs text-red-600">{photoError}</p>}
            <p className="text-xs text-ink-soft">Uploaded photos are automatically resized and compressed. Changes here apply immediately.</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-emerald-soft/70 shadow-card p-6 space-y-5">
        <h2 className="font-display text-lg text-emerald-deep">Profile Details</h2>

        <Field label="Doctor Name">
          <TextInput value={form.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field label="Qualification">
          <TextInput value={form.qualification} onChange={(e) => set("qualification", e.target.value)} />
        </Field>
        <Field label="Short Introduction" hint="Shown in the homepage hero.">
          <TextArea rows={3} value={form.short_intro} onChange={(e) => set("short_intro", e.target.value)} />
        </Field>
        <Field label="About / Detailed Biography">
          <TextArea rows={6} value={form.about_biography} onChange={(e) => set("about_biography", e.target.value)} />
        </Field>
        <Field label="Years of Experience">
          <TextInput value={form.experience_years} onChange={(e) => set("experience_years", e.target.value)} placeholder="e.g. 10+" />
        </Field>

        <StringListEditor label="Areas of Expertise" items={form.areas_of_expertise} onChange={(v) => set("areas_of_expertise", v)} placeholder="e.g. Psoriasis" />
        <StringListEditor label="Languages" items={form.languages} onChange={(v) => set("languages", v)} placeholder="e.g. English" />
      </div>

      <FormActionBar
        hasDraft={initial._isDraftView}
        getData={() => form}
        onSaveDraft={saveDraftAction}
        onPublish={publishAction}
        onDiscard={discardAction}
        previewHref="/about"
      />
    </div>
  );
}
