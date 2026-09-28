"use client";

import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";

export function StringListEditor({ label, items, onChange, placeholder }) {
  const list = items || [];

  function update(i, value) {
    const next = [...list];
    next[i] = value;
    onChange(next);
  }
  function remove(i) {
    onChange(list.filter((_, idx) => idx !== i));
  }
  function move(i, dir) {
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div>
      <label className="block text-sm font-medium text-ink mb-1.5">{label}</label>
      <div className="space-y-2">
        {list.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={item}
              onChange={(e) => update(i, e.target.value)}
              placeholder={placeholder}
              className="flex-1 rounded-xl border border-emerald-soft/80 bg-cream px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
            />
            <button type="button" onClick={() => move(i, -1)} className="p-1.5 text-ink-soft hover:text-emerald-deep" aria-label="Move up"><ChevronUp className="w-4 h-4" /></button>
            <button type="button" onClick={() => move(i, 1)} className="p-1.5 text-ink-soft hover:text-emerald-deep" aria-label="Move down"><ChevronDown className="w-4 h-4" /></button>
            <button type="button" onClick={() => remove(i)} className="p-1.5 text-red-500 hover:text-red-700" aria-label="Remove"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...list, ""])}
        className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-deep hover:text-gold-deep"
      >
        <Plus className="w-4 h-4" /> Add item
      </button>
    </div>
  );
}

export function TimingsListEditor({ items, onChange }) {
  const list = items || [];
  function update(i, key, value) {
    const next = [...list];
    next[i] = { ...next[i], [key]: value };
    onChange(next);
  }
  function remove(i) { onChange(list.filter((_, idx) => idx !== i)); }

  return (
    <div>
      <label className="block text-sm font-medium text-ink mb-1.5">Timings</label>
      <div className="space-y-2">
        {list.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input value={item.day || ""} onChange={(e) => update(i, "day", e.target.value)} placeholder="e.g. Monday – Saturday" className="flex-1 rounded-lg border border-emerald-soft/80 bg-cream px-3 py-2 text-sm" />
            <input value={item.hours || ""} onChange={(e) => update(i, "hours", e.target.value)} placeholder="e.g. 9:00 AM – 1:00 PM" className="flex-1 rounded-lg border border-emerald-soft/80 bg-cream px-3 py-2 text-sm" />
            <button type="button" onClick={() => remove(i)} className="p-1.5 text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...list, { day: "", hours: "" }])} className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-deep hover:text-gold-deep">
        <Plus className="w-4 h-4" /> Add timing row
      </button>
    </div>
  );
}

export function PlatformsListEditor({ items, onChange }) {
  const list = items || [];
  function update(i, key, value) {
    const next = [...list];
    next[i] = { ...next[i], [key]: value };
    onChange(next);
  }
  function remove(i) { onChange(list.filter((_, idx) => idx !== i)); }

  return (
    <div>
      <label className="block text-sm font-medium text-ink mb-1.5">Online Consultation Platforms</label>
      <div className="space-y-3">
        {list.map((item, i) => (
          <div key={i} className="rounded-xl border border-emerald-soft/70 p-4 space-y-2 bg-cream/60">
            <div className="grid sm:grid-cols-2 gap-2">
              <input value={item.name || ""} onChange={(e) => update(i, "name", e.target.value)} placeholder="Platform name (e.g. Practo)" className="rounded-lg border border-emerald-soft/80 bg-white px-3 py-2 text-sm font-medium" />
              <input value={item.icon || ""} onChange={(e) => update(i, "icon", e.target.value)} placeholder="Icon name (e.g. Stethoscope)" className="rounded-lg border border-emerald-soft/80 bg-white px-3 py-2 text-sm" />
            </div>
            <input value={item.description || ""} onChange={(e) => update(i, "description", e.target.value)} placeholder="Short description" className="w-full rounded-lg border border-emerald-soft/80 bg-white px-3 py-2 text-sm" />
            <div className="flex items-center gap-2">
              <input value={item.url || ""} onChange={(e) => update(i, "url", e.target.value)} placeholder="Link (use # for 'coming soon')" className="flex-1 rounded-lg border border-emerald-soft/80 bg-white px-3 py-2 text-sm" />
              <button type="button" onClick={() => remove(i)} className="p-1.5 text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...list, { name: "", description: "", icon: "Video", url: "#" }])} className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-deep hover:text-gold-deep">
        <Plus className="w-4 h-4" /> Add platform
      </button>
    </div>
  );
}

export function PickAndOrder({ label, allItems, selectedIds, onChange }) {
  const list = selectedIds || [];
  const byId = Object.fromEntries(allItems.map((i) => [i.id, i]));
  const available = allItems.filter((i) => !list.includes(i.id));

  function move(i, dir) {
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }
  function remove(i) { onChange(list.filter((_, idx) => idx !== i)); }
  function add(id) { if (id) onChange([...list, id]); }

  return (
    <div>
      <label className="block text-sm font-medium text-ink mb-1.5">{label}</label>
      <div className="space-y-2 mb-2">
        {list.map((id, i) => (
          <div key={id} className="flex items-center gap-2 rounded-lg border border-emerald-soft/70 bg-cream px-3 py-2">
            <span className="flex-1 text-sm">{byId[id]?.label || id}</span>
            <button type="button" onClick={() => move(i, -1)} className="p-1 text-ink-soft hover:text-emerald-deep"><ChevronUp className="w-4 h-4" /></button>
            <button type="button" onClick={() => move(i, 1)} className="p-1 text-ink-soft hover:text-emerald-deep"><ChevronDown className="w-4 h-4" /></button>
            <button type="button" onClick={() => remove(i)} className="p-1 text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        {list.length === 0 && <p className="text-xs text-ink-soft">None selected yet.</p>}
      </div>
      {available.length > 0 && (
        <select onChange={(e) => { add(e.target.value); e.target.value = ""; }} defaultValue="" className="rounded-lg border border-emerald-soft/80 bg-white px-3 py-2 text-sm">
          <option value="" disabled>+ Add...</option>
          {available.map((i) => <option key={i.id} value={i.id}>{i.label}</option>)}
        </select>
      )}
    </div>
  );
}

export function ObjectListEditor({ items, onChange, fields, newItem }) {
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
          <ToggleInline checked={item.enabled !== false} onChange={(v) => update(i, "enabled", v)} />
        </div>
      ))}
      <button type="button" onClick={() => onChange([...list, { ...newItem }])} className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-deep hover:text-gold-deep">
        <Plus className="w-4 h-4" /> Add
      </button>
    </div>
  );
}

function ToggleInline({ checked, onChange }) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none text-sm text-ink">
      <span className="relative inline-block h-5 w-9">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
        <span className="absolute inset-0 rounded-full bg-emerald-soft peer-checked:bg-emerald transition-colors" />
        <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
      </span>
      Enabled
    </label>
  );
}

export function FaqListEditor({ items, onChange }) {
  const list = items || [];

  function update(i, key, value) {
    const next = [...list];
    next[i] = { ...next[i], [key]: value };
    onChange(next);
  }
  function remove(i) {
    onChange(list.filter((_, idx) => idx !== i));
  }
  function move(i, dir) {
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div>
      <label className="block text-sm font-medium text-ink mb-1.5">FAQs</label>
      <div className="space-y-3">
        {list.map((item, i) => (
          <div key={i} className="rounded-xl border border-emerald-soft/70 p-4 space-y-2 bg-cream/60">
            <div className="flex items-center gap-2">
              <input
                value={item.q || ""}
                onChange={(e) => update(i, "q", e.target.value)}
                placeholder="Question"
                className="flex-1 rounded-lg border border-emerald-soft/80 bg-white px-3.5 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald"
              />
              <button type="button" onClick={() => move(i, -1)} className="p-1.5 text-ink-soft hover:text-emerald-deep"><ChevronUp className="w-4 h-4" /></button>
              <button type="button" onClick={() => move(i, 1)} className="p-1.5 text-ink-soft hover:text-emerald-deep"><ChevronDown className="w-4 h-4" /></button>
              <button type="button" onClick={() => remove(i)} className="p-1.5 text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
            </div>
            <textarea
              value={item.a || ""}
              onChange={(e) => update(i, "a", e.target.value)}
              placeholder="Answer"
              rows={2}
              className="w-full rounded-lg border border-emerald-soft/80 bg-white px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...list, { q: "", a: "" }])}
        className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-deep hover:text-gold-deep"
      >
        <Plus className="w-4 h-4" /> Add FAQ
      </button>
    </div>
  );
}
