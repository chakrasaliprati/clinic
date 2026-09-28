export function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-ink-soft mt-1">{hint}</p>}
    </div>
  );
}

export function TextInput(props) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-emerald-soft/80 bg-cream px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald ${props.className || ""}`}
    />
  );
}

export function TextArea(props) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-xl border border-emerald-soft/80 bg-cream px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald ${props.className || ""}`}
    />
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <label className="inline-flex items-center gap-3 cursor-pointer select-none">
      <span className="relative inline-block h-6 w-11">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
        <span className="absolute inset-0 rounded-full bg-emerald-soft peer-checked:bg-emerald transition-colors" />
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
      </span>
      {label && <span className="text-sm text-ink">{label}</span>}
    </label>
  );
}
