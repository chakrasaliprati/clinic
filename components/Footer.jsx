import Link from "next/link";
import { Instagram, Facebook, Youtube, Linkedin, MapPin, Phone, Mail, Clock, Globe2 } from "lucide-react";

const nav = [
  { label: "Home", href: "/" },
  { label: "About Doctor", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Consultation", href: "/consultation" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Footer({ site, featuredSpecialities = [] }) {
  const social = site.social || {};
  return (
    <footer className="bg-emerald-deep text-cream/90">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-16 grid gap-10 md:grid-cols-4">
        <div>
          <div className="font-display text-xl text-cream mb-2">{site.doctorName}</div>
          <p className="text-sm text-cream/70 mb-4">{site.qualifications}</p>
          <p className="text-sm text-cream/70 leading-relaxed">{site.tagline || "Authentic Ayurvedic care, rooted in tradition, guided by evidence."}</p>
          <div className="flex gap-3 mt-5">
            {social.instagram && <a href={social.instagram} aria-label="Instagram" className="hover:text-gold-light"><Instagram className="w-5 h-5" /></a>}
            {social.facebook && <a href={social.facebook} aria-label="Facebook" className="hover:text-gold-light"><Facebook className="w-5 h-5" /></a>}
            {social.youtube && <a href={social.youtube} aria-label="YouTube" className="hover:text-gold-light"><Youtube className="w-5 h-5" /></a>}
            {social.linkedin && <a href={social.linkedin} aria-label="LinkedIn" className="hover:text-gold-light"><Linkedin className="w-5 h-5" /></a>}
          </div>
        </div>

        <div>
          <h3 className="font-display text-base text-cream mb-4">Explore</h3>
          <ul className="space-y-2 text-sm">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-cream/70 hover:text-gold-light">{n.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-base text-cream mb-4">Specialities</h3>
          <ul className="space-y-2 text-sm">
            {featuredSpecialities.map((c) => (
              <li key={c.slug}>
                <Link href={c.hub_path || `/services/${c.slug}`} className="text-cream/70 hover:text-gold-light">{c.name} Care</Link>
              </li>
            ))}
            <li><Link href="/services" className="text-cream/70 hover:text-gold-light">All Services</Link></li>
            <li><Link href="/blog" className="text-cream/70 hover:text-gold-light">Ayurveda Blog</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-base text-cream mb-4">Visit or Reach Us</h3>
          <ul className="space-y-3 text-sm text-cream/70">
            {site.hasOfflineLocation ? (
              <li className="flex gap-2"><MapPin className="w-4 h-4 mt-0.5 shrink-0" /> {site.address.line1}, {site.address.line2}, {site.address.city} {site.address.pincode}</li>
            ) : (
              <li className="flex gap-2"><Globe2 className="w-4 h-4 mt-0.5 shrink-0" /> Available online</li>
            )}
            {site.phoneDisplay && <li className="flex gap-2"><Phone className="w-4 h-4 mt-0.5 shrink-0" /> {site.phoneDisplay}</li>}
            {site.email && <li className="flex gap-2"><Mail className="w-4 h-4 mt-0.5 shrink-0" /> {site.email}</li>}
            {site.timings?.[0] && <li className="flex gap-2"><Clock className="w-4 h-4 mt-0.5 shrink-0" /> {site.timings[0].hours}</li>}
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-cream/60">
          <p>© {new Date().getFullYear()} {site.clinicName}. All rights reserved.</p>
          <p>Information on this site is educational and does not replace individual medical advice. Always consult your physician.</p>
        </div>
      </div>
    </footer>
  );
}
