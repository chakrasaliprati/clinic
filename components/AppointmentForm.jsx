"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function AppointmentForm({ concernPreset = "", clinicEnabled = true, onlineEnabled = true }) {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = e.target;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (res.ok && json.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
        setErrorMessage(json.message || "We couldn't submit your request right now. Please try again or contact us directly.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("We couldn't submit your request right now. Please try again or contact us directly.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-soft bg-emerald-light/60 p-8 text-center">
        <CheckCircle2 className="w-10 h-10 text-emerald mx-auto mb-3" />
        <h3 className="font-display text-xl text-emerald-deep mb-1">Request received</h3>
        <p className="text-sm text-ink-soft">Your consultation request has been submitted successfully. Our team will contact you shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-emerald-soft/70 bg-white p-6 md:p-8 shadow-card space-y-5">
      {/* Honeypot — hidden from real visitors, bots tend to fill every field */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Full Name" name="name" required placeholder="Your full name" />
        <Field label="Mobile Number" name="phone" type="tel" required placeholder="+91 00000 00000" />
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Email" name="email" type="email" placeholder="you@email.com" />
        <Field label="Age" name="age" type="number" placeholder="Age" />
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Preferred Date" name="preferredDate" type="date" />
        <Field label="Preferred Time" name="preferredTime" type="time" />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">Consultation Type</label>
        <select name="consultationType" defaultValue={onlineEnabled ? "online" : "clinic"} className="w-full rounded-xl border border-emerald-soft/80 bg-cream px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald">
          {onlineEnabled && <option value="online">Online Consultation</option>}
          {clinicEnabled && <option value="clinic">Clinic Consultation</option>}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">Health Concern</label>
        <textarea
          name="healthConcern"
          rows={4}
          defaultValue={concernPreset}
          placeholder="Briefly describe your health concern"
          className="w-full rounded-xl border border-emerald-soft/80 bg-cream px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-emerald px-7 py-3.5 text-sm font-semibold text-cream shadow-gold hover:bg-emerald-deep transition-colors disabled:opacity-70"
      >
        {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
        {status === "loading" ? "Submitting..." : "Book Consultation"}
      </button>

      {status === "error" && <p className="text-sm text-red-600 text-center">{errorMessage}</p>}

      <p className="text-xs text-ink-soft text-center">
        By submitting, you agree to be contacted regarding your appointment request.
      </p>
    </form>
  );
}

function Field({ label, name, type = "text", required, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink mb-1.5" htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-emerald-soft/80 bg-cream px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
      />
    </div>
  );
}
