"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, MessagesSquare, RotateCcw, ChevronDown, Stethoscope,
  Home, ListTree, Star, HelpCircle, CalendarClock, Phone, Newspaper,
  Megaphone, Search, LogOut, Menu, X,
} from "lucide-react";
import { signOutAction } from "@/app/admin/actions";

const consultationLinks = [
  { href: "/admin/consultation-requests", label: "Consultation Requests", icon: MessagesSquare, badgeKey: "new" },
  { href: "/admin/follow-ups", label: "Follow-ups", icon: RotateCcw, badgeKey: "followUp" },
];

const settingsLinks = [
  { href: "/admin/doctor-profile", label: "Doctor Profile", icon: Stethoscope },
  { href: "/admin/home-page", label: "Home Page", icon: Home },
  { href: "/admin/specialities", label: "Specialities", icon: ListTree },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/consultation-settings", label: "Consultation", icon: CalendarClock },
  { href: "/admin/contact-settings", label: "Contact / Get in Touch", icon: Phone },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/website-notice", label: "Website Notice", icon: Megaphone },
  { href: "/admin/seo", label: "SEO", icon: Search },
];

function NavLink({ href, label, icon: Icon, badge, onClick }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
        active ? "bg-emerald text-cream" : "text-ink-soft hover:bg-emerald-light hover:text-emerald-deep"
      }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span className="flex-1">{label}</span>
      {badge > 0 && (
        <span
          className={`text-[11px] font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center ${
            active ? "bg-cream text-emerald-deep" : "bg-gold text-cream"
          }`}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}

function SidebarContents({ counts, onNavigate }) {
  const [open, setOpen] = useState({ consultation: true, settings: true });
  const toggle = (key) => setOpen((s) => ({ ...s, [key]: !s[key] }));

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3">
        <Link href="/admin" onClick={onNavigate} className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald text-cream font-display text-sm">PY</span>
          <span className="font-display text-base text-emerald-deep">Clinic Admin</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 space-y-1 pb-4">
        <NavLink href="/admin" label="Dashboard" icon={LayoutDashboard} onClick={onNavigate} />

        <button
          onClick={() => toggle("consultation")}
          className="w-full flex items-center justify-between px-3.5 pt-4 pb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-soft"
        >
          Consultation
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open.consultation ? "" : "-rotate-90"}`} />
        </button>
        {open.consultation && (
          <div className="space-y-1">
            {consultationLinks.map((l) => (
              <NavLink key={l.href} {...l} badge={counts[l.badgeKey] || 0} onClick={onNavigate} />
            ))}
          </div>
        )}

        <button
          onClick={() => toggle("settings")}
          className="w-full flex items-center justify-between px-3.5 pt-4 pb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-soft"
        >
          Website &amp; Settings
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open.settings ? "" : "-rotate-90"}`} />
        </button>
        {open.settings && (
          <div className="space-y-1">
            {settingsLinks.map((l) => (
              <NavLink key={l.href} {...l} onClick={onNavigate} />
            ))}
          </div>
        )}
      </nav>

      <div className="p-3 border-t border-emerald-soft/70">
        <form action={signOutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-ink-soft hover:bg-emerald-light hover:text-emerald-deep transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminShell({ counts = {}, adminName, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const allLinks = [...consultationLinks, ...settingsLinks, { href: "/admin", label: "Dashboard" }];
  const currentLabel = allLinks.find((l) => l.href === pathname)?.label || "Dashboard";

  return (
    <div className="min-h-screen flex bg-cream-dim">
      <aside className="hidden lg:block w-72 shrink-0 border-r border-emerald-soft/70 bg-white h-screen sticky top-0">
        <SidebarContents counts={counts} />
      </aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-cardHover">
            <button onClick={() => setMobileOpen(false)} className="absolute right-3 top-4 text-ink-soft" aria-label="Close menu">
              <X className="w-5 h-5" />
            </button>
            <SidebarContents counts={counts} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between bg-white border-b border-emerald-soft/70 px-4 h-14">
          <button onClick={() => setMobileOpen(true)} aria-label="Open menu" className="text-emerald-deep">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-display text-emerald-deep">{currentLabel}</span>
          <span className="w-6" />
        </header>
        <header className="hidden lg:flex items-center justify-between px-8 h-16 border-b border-emerald-soft/70 bg-white">
          <span className="font-display text-lg text-emerald-deep">{currentLabel}</span>
          <span className="text-sm text-ink-soft">Signed in as {adminName || "Admin"}</span>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
