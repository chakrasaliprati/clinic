import Link from "next/link";
import { Phone, CalendarCheck } from "lucide-react";

export default function StickyMobileBar({ site }) {
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 grid grid-cols-2 border-t border-emerald-soft bg-cream shadow-[0_-8px_24px_-12px_rgba(10,62,46,0.25)]">
      <a
        href={`tel:${site?.phone || ""}`}
        className="flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-emerald-deep border-r border-emerald-soft"
      >
        <Phone className="w-4 h-4" /> Call Now
      </a>
      <Link
        href="/consultation"
        className="flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-cream bg-emerald"
      >
        <CalendarCheck className="w-4 h-4" /> Book Consultation
      </Link>
    </div>
  );
}
