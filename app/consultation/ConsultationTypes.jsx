"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, Video, RotateCcw, ChevronDown, ExternalLink, MessageCircle, Stethoscope, ShieldPlus, Phone, Globe2, Leaf } from "lucide-react";

const platformIcons = { MessageCircle, Stethoscope, ShieldPlus, Video, Phone, Globe2, Leaf };
function Icon({ name, className }) {
  const I = platformIcons[name] || Globe2;
  return <I className={className} />;
}

export default function ConsultationTypes({ settings }) {
  const [onlineOpen, setOnlineOpen] = useState(false);
  const clinicEnabled = Boolean(settings?.clinic_enabled);
  const onlineEnabled = settings?.online_enabled ?? true;
  const platforms = settings?.online_platforms || [];

  return (
    <div className="grid sm:grid-cols-3 gap-6 mb-4">
      <div className={`rounded-2xl border p-6 shadow-card ${clinicEnabled ? "bg-white border-emerald-soft/70" : "bg-cream-dim border-emerald-soft/40 opacity-70"}`}>
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-light text-emerald-deep mb-4">
          <Building2 className="w-5 h-5" />
        </span>
        <h3 className="font-display text-lg text-emerald-deep mb-2 flex items-center gap-2">
          {settings?.clinic_title || "Clinic Consultation"}
          {!clinicEnabled && (
            <span className="text-[10px] font-semibold uppercase tracking-wide bg-emerald-soft text-emerald-deep rounded-full px-2 py-0.5">Coming Soon</span>
          )}
        </h3>
        <p className="text-sm text-ink-soft leading-relaxed">
          {clinicEnabled
            ? settings?.clinic_description || "Visit us in person for a detailed physical examination and personalised treatment plan."
            : "Not currently available — consultations are online only for now."}
        </p>
        {clinicEnabled && settings?.clinic_fee && <p className="text-xs text-ink-soft mt-2">Fee: {settings.clinic_fee}</p>}
      </div>

      {onlineEnabled && (
        <div className="rounded-2xl bg-white border border-emerald-soft/70 shadow-card overflow-hidden">
          <button onClick={() => setOnlineOpen((v) => !v)} className="w-full text-left p-6" aria-expanded={onlineOpen}>
            <div className="flex items-start justify-between gap-2">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-light text-emerald-deep mb-4">
                <Video className="w-5 h-5" />
              </span>
              <ChevronDown className={`w-5 h-5 text-emerald-deep transition-transform ${onlineOpen ? "rotate-180" : ""}`} />
            </div>
            <h3 className="font-display text-lg text-emerald-deep mb-2">{settings?.online_title || "Online Consultation"}</h3>
            <p className="text-sm text-ink-soft leading-relaxed">
              {settings?.online_description || "Speak with the doctor from anywhere. Tap to see how you'd like to connect."}
            </p>
            {settings?.online_fee && <p className="text-xs text-ink-soft mt-2">Fee: {settings.online_fee}</p>}
          </button>

          {onlineOpen && (
            <div className="border-t border-emerald-soft/70 bg-emerald-light/30 p-5 space-y-3">
              {platforms.map((p) => {
                const comingSoon = !p.url || p.url === "#";
                return comingSoon ? (
                  <div key={p.name} className="flex items-center gap-3 rounded-xl bg-white/70 border border-emerald-soft/60 px-4 py-3 opacity-60">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-light text-emerald-deep"><Icon name={p.icon} className="w-4 h-4" /></span>
                    <div className="flex-1"><p className="text-sm font-semibold text-ink">{p.name}</p><p className="text-xs text-ink-soft">{p.description}</p></div>
                    <span className="text-[10px] font-semibold uppercase tracking-wide bg-emerald-soft text-emerald-deep rounded-full px-2 py-0.5 shrink-0">Coming Soon</span>
                  </div>
                ) : (
                  <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl bg-white border border-emerald-soft/60 px-4 py-3 hover:shadow-card hover:border-emerald transition-all">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald text-cream"><Icon name={p.icon} className="w-4 h-4" /></span>
                    <div className="flex-1"><p className="text-sm font-semibold text-ink">{p.name}</p><p className="text-xs text-ink-soft">{p.description}</p></div>
                    <ExternalLink className="w-4 h-4 text-emerald-deep shrink-0" />
                  </a>
                );
              })}
              <p className="text-xs text-ink-soft pt-1">Prefer a simple form instead? Scroll down to book directly.</p>
            </div>
          )}
        </div>
      )}

      <Link href="#appointment-form" className="group rounded-2xl bg-white border border-emerald-soft/70 p-6 shadow-card hover:shadow-cardHover hover:-translate-y-1 transition-all duration-300">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-light text-emerald-deep mb-4"><RotateCcw className="w-5 h-5" /></span>
        <h3 className="font-display text-lg text-emerald-deep mb-2">Follow-up Consultation</h3>
        <p className="text-sm text-ink-soft leading-relaxed">Review your progress and adjust your treatment plan as you improve. Book below.</p>
      </Link>
    </div>
  );
}
