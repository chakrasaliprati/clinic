import Link from "next/link";
import { MapPin, Phone, Mail, Clock, MessageCircle, Globe2 } from "lucide-react";
import GoogleMap from "./GoogleMap";

export default function ContactSection({ site }) {
  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 py-20">
      <div className="max-w-2xl mb-12">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-deep mb-3">Reach Us</p>
        <h2 className="font-display text-3xl md:text-4xl text-emerald-deep">Get in touch</h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <div className="space-y-5">
          {site.hasOfflineLocation ? (
            <InfoRow icon={MapPin} label="Clinic Address">
              {site.address.line1}, {site.address.line2}, {site.address.city} – {site.address.pincode}
            </InfoRow>
          ) : (
            <InfoRow icon={Globe2} label="Consultation Mode">
              Available online only — clinic visits will be listed here once an offline location opens.
            </InfoRow>
          )}
          {site.phoneDisplay && (
            <InfoRow icon={Phone} label="Phone">
              <a href={`tel:${site.phone}`} className="hover:text-gold-deep">{site.phoneDisplay}</a>
            </InfoRow>
          )}
          {site.whatsapp && (
            <InfoRow icon={MessageCircle} label="WhatsApp">
              <a href={`https://wa.me/${site.whatsapp}`} className="hover:text-gold-deep">Chat with us</a>
            </InfoRow>
          )}
          {site.email && (
            <InfoRow icon={Mail} label="Email">
              <a href={`mailto:${site.email}`} className="hover:text-gold-deep">{site.email}</a>
            </InfoRow>
          )}
          {site.timings?.length > 0 && (
            <InfoRow icon={Clock} label="Consultation Timings">
              <div className="space-y-1">
                {site.timings.map((t) => <div key={t.day}>{t.day}: {t.hours}</div>)}
              </div>
            </InfoRow>
          )}

          <Link
            href="/consultation"
            className="inline-flex mt-4 items-center gap-2 rounded-full bg-emerald px-7 py-3.5 text-sm font-semibold text-cream shadow-gold hover:bg-emerald-deep transition-colors"
          >
            Book a Consultation
          </Link>
        </div>

        {site.hasOfflineLocation ? (
          <GoogleMap embedUrl={site.mapsEmbedUrl} title={site.clinicName} />
        ) : (
          <div className="rounded-xl3 border border-emerald-soft bg-emerald-light/50 h-full min-h-[280px] flex flex-col items-center justify-center text-center p-10">
            <Globe2 className="w-10 h-10 text-emerald-deep mb-4" />
            <p className="font-display text-xl text-emerald-deep mb-2">Available Online</p>
            <p className="text-sm text-ink-soft max-w-xs">
              Consultations are currently conducted online only. A clinic map will appear here once an
              in-person location is available.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function InfoRow({ icon: I, label, children }) {
  return (
    <div className="flex gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-light text-emerald-deep">
        <I className="w-5 h-5" />
      </span>
      <div>
        <p className="text-xs uppercase tracking-wide text-ink-soft mb-0.5">{label}</p>
        <div className="text-ink font-medium">{children}</div>
      </div>
    </div>
  );
}
