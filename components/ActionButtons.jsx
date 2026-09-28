import Link from "next/link";
import { CalendarCheck, Phone, MessageCircle } from "lucide-react";

export default function ActionButtons({ concern = "", site }) {
  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href={concern ? `/consultation?concern=${encodeURIComponent(concern)}` : "/consultation"}
        className="inline-flex items-center gap-2 rounded-full bg-emerald px-6 py-3 text-sm font-semibold text-cream shadow-gold hover:bg-emerald-deep transition-colors"
      >
        <CalendarCheck className="w-4 h-4" /> Book Appointment
      </Link>
      {site?.phone && (
        <a
          href={`tel:${site.phone}`}
          className="inline-flex items-center gap-2 rounded-full border border-emerald px-6 py-3 text-sm font-semibold text-emerald-deep hover:bg-emerald-light transition-colors"
        >
          <Phone className="w-4 h-4" /> Call Now
        </a>
      )}
      {site?.whatsapp && (
        <a
          href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Hello, I'd like to know more about treatment for ${concern || "my condition"}.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-emerald px-6 py-3 text-sm font-semibold text-emerald-deep hover:bg-emerald-light transition-colors"
        >
          <MessageCircle className="w-4 h-4" /> WhatsApp
        </a>
      )}
    </div>
  );
}
