"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "follow_up", label: "Follow-up" },
  { value: "solved", label: "Solved" },
];

const typeOptions = [
  { value: "", label: "All Types" },
  { value: "online", label: "Online" },
  { value: "clinic", label: "Clinic" },
];

const dateOptions = [
  { value: "", label: "Any Date" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
];

export default function SearchFilterBar({ hideStatus = false }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") || "");

  function updateParam(key, value) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    updateParam("q", q);
  }

  function clearAll() {
    setQ("");
    router.push(pathname);
  }

  const hasFilters = searchParams.toString().length > 0;

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
      <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[220px] flex items-center gap-2 rounded-xl border border-emerald-soft/80 bg-white px-3.5 py-2.5">
        <Search className="w-4 h-4 text-ink-soft shrink-0" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or phone..."
          className="flex-1 bg-transparent text-sm focus:outline-none"
        />
      </form>

      {!hideStatus && (
        <select
          value={searchParams.get("status") || ""}
          onChange={(e) => updateParam("status", e.target.value)}
          className="rounded-xl border border-emerald-soft/80 bg-white px-3.5 py-2.5 text-sm"
        >
          {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      )}

      <select
        value={searchParams.get("type") || ""}
        onChange={(e) => updateParam("type", e.target.value)}
        className="rounded-xl border border-emerald-soft/80 bg-white px-3.5 py-2.5 text-sm"
      >
        {typeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>

      <select
        value={searchParams.get("date") || ""}
        onChange={(e) => updateParam("date", e.target.value)}
        className="rounded-xl border border-emerald-soft/80 bg-white px-3.5 py-2.5 text-sm"
      >
        {dateOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>

      {hasFilters && (
        <button onClick={clearAll} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-emerald-deep px-2">
          <X className="w-4 h-4" /> Clear
        </button>
      )}
    </div>
  );
}
