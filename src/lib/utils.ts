export function formatMoney(value: number, currency = "MXN") {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
}

export function onlyDigits(text: string) {
  return text.replace(/\D/g, "");
}

/** Enlace directo para dejar reseña. Usa el Place ID si existe; si no, el enlace de Maps. */
export function reviewUrl(r: { google_place_id: string | null; maps_url: string | null }) {
  if (r.google_place_id)
    return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(r.google_place_id)}`;
  return r.maps_url ?? null;
}

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}
