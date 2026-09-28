"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";


export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError("Incorrect email or password. Please try again.");
      setLoading(false);
      return;
    }

    router.replace(params.get("next") || "/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-leaf-veil flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald text-cream font-display text-xl mb-4">
            PY
          </span>
          <h1 className="font-display text-2xl text-emerald-deep">Admin Login</h1>
          <p className="text-sm text-ink-soft mt-1">Clinic administration</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl bg-white border border-emerald-soft/70 shadow-card p-7 space-y-5">
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-emerald-soft/80 bg-cream px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-emerald-soft/80 bg-cream px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-emerald px-6 py-3.5 text-sm font-semibold text-cream shadow-gold hover:bg-emerald-deep transition-colors disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-ink-soft mt-6">
          This login is for clinic staff only.
        </p>
      </div>
    </div>
  );
}
