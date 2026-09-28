"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";

const nav = [
  { label: "Home", href: "/" },
  { label: "About Doctor", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Consultation", href: "/consultation" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Header({ site }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-cream/95 backdrop-blur shadow-sm" : "bg-cream"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald text-cream font-display text-lg">
              PY
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-display text-lg text-emerald-deep tracking-tight">
                {site.doctorName}
              </span>
              <span className="text-[11px] uppercase tracking-[0.14em] text-ink-soft">
                {site.qualifications}
              </span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-ink-soft hover:text-emerald-deep transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {site.phone && (
              <a
                href={`tel:${site.phone}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-deep"
              >
                <Phone className="w-4 h-4" /> {site.phoneDisplay}
              </a>
            )}
            <Link
              href="/consultation"
              className="rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-cream shadow-gold hover:bg-emerald-deep transition-colors"
            >
              Book Consultation
            </Link>
          </div>

          <button
            className="lg:hidden text-emerald-deep"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-emerald-soft bg-cream px-5 py-4">
          <nav className="flex flex-col gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-[15px] font-medium text-ink-soft hover:bg-emerald-light hover:text-emerald-deep"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/consultation"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-emerald px-5 py-3 text-center text-sm font-semibold text-cream"
            >
              Book Consultation
            </Link>
            {site.phone && (
              <a
                href={`tel:${site.phone}`}
                className="mt-2 rounded-full border border-emerald px-5 py-3 text-center text-sm font-semibold text-emerald-deep"
              >
                Call {site.phoneDisplay}
              </a>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
