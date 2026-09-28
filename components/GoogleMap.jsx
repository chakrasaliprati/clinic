export default function GoogleMap({ embedUrl, title, height = "380" }) {
  if (!embedUrl) return null;
  return (
    <div className="rounded-xl3 overflow-hidden border border-emerald-soft shadow-card">
      <iframe
        src={embedUrl}
        width="100%"
        height={height}
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`${title || "Clinic"} location on Google Maps`}
      />
    </div>
  );
}
