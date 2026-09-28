export function buildWhatsAppLink(phone, message) {
  const digits = String(phone || "").replace(/\D/g, "");
  const withCountry = digits.length === 10 ? `91${digits}` : digits; // assume India if no country code given
  return `https://wa.me/${withCountry}?text=${encodeURIComponent(message)}`;
}

export function fillTemplate(template, vars) {
  return String(template || "").replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? "");
}

export function telLink(phone) {
  const digits = String(phone || "").replace(/[^\d+]/g, "");
  return `tel:${digits}`;
}
