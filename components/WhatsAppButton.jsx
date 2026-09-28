export default function WhatsAppButton({ site }) {
  if (!site?.whatsapp) return null;
  return (
    <a
      href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
        `Hello, I would like to book a consultation with ${site.doctorName || "the clinic"}.`
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-cardHover motion-safe:animate-floatSlow hover:scale-105 transition-transform"
    >
      <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white">
        <path d="M16.02 3C9.4 3 4 8.4 4 15.02c0 2.32.68 4.5 1.86 6.33L4 29l7.83-1.82a11.9 11.9 0 0 0 4.19.76h.01c6.62 0 12.02-5.4 12.02-12.02C28.05 8.4 22.65 3 16.02 3zm0 21.9c-1.44 0-2.84-.36-4.06-1.05l-.29-.17-4.65 1.08 1.1-4.53-.19-.3a9.86 9.86 0 0 1-1.53-5.31c0-5.47 4.45-9.92 9.93-9.92 2.65 0 5.14 1.03 7.01 2.9a9.85 9.85 0 0 1 2.9 7.02c-.01 5.48-4.46 9.28-9.22 9.28zm5.44-7.37c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.46-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.91-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37s-1.04 1.02-1.04 2.48 1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z"/>
      </svg>
    </a>
  );
}
