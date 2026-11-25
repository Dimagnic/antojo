"use client";

/**
 * Borrador de la carta mientras el visitante la arma SIN cuenta (como LaCarta).
 * Los datos van en localStorage y las fotos/videos en IndexedDB.
 */

export type DraftProduct = {
  id: string;
  name: string;
  price: number | null;
  category: string;
  description: string;
  mediaId: string | null;
  mediaType: "image" | "video" | null;
};

export type Draft = {
  business: { name: string; country: string; whatsapp: string; maps: string };
  categories: string[];
  products: DraftProduct[];
  step: 1 | 2 | 3;
};

export const COUNTRIES = [
  { code: "MX", name: "México", dial: "52", flag: "🇲🇽", currency: "MXN" },
  { code: "US", name: "Estados Unidos", dial: "1", flag: "🇺🇸", currency: "USD" },
  { code: "GT", name: "Guatemala", dial: "502", flag: "🇬🇹", currency: "GTQ" },
  { code: "CO", name: "Colombia", dial: "57", flag: "🇨🇴", currency: "COP" },
  { code: "PE", name: "Perú", dial: "51", flag: "🇵🇪", currency: "PEN" },
  { code: "EC", name: "Ecuador", dial: "593", flag: "🇪🇨", currency: "USD" },
  { code: "CL", name: "Chile", dial: "56", flag: "🇨🇱", currency: "CLP" },
  { code: "AR", name: "Argentina", dial: "54", flag: "🇦🇷", currency: "ARS" },
  { code: "ES", name: "España", dial: "34", flag: "🇪🇸", currency: "EUR" },
] as const;

export const DEFAULT_CATEGORIES = ["Entradas", "Principales", "Postres", "Bebidas"];

const KEY = "antojo:borrador";

export const emptyDraft = (): Draft => ({
  business: { name: "", country: "MX", whatsapp: "", maps: "" },
  categories: [...DEFAULT_CATEGORIES],
  products: [],
  step: 1,
});

export function loadDraft(): Draft {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...emptyDraft(), ...(JSON.parse(raw) as Draft) };
  } catch {}
  return emptyDraft();
}

export function saveDraft(d: Draft) {
  try {
    localStorage.setItem(KEY, JSON.stringify(d));
  } catch {}
}

export async function clearDraft(d?: Draft) {
  try {
    localStorage.removeItem(KEY);
  } catch {}
  if (d) await Promise.all(d.products.filter((p) => p.mediaId).map((p) => deleteMedia(p.mediaId!)));
}

/* ───── Fotos y videos en IndexedDB ───── */

function db(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("antojo-borrador", 1);
    req.onupgradeneeded = () => req.result.createObjectStore("media");
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const d = await db();
  return new Promise((resolve, reject) => {
    const r = fn(d.transaction("media", mode).objectStore("media"));
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}

export const putMedia = (id: string, blob: Blob) => tx("readwrite", (s) => s.put(blob, id));
export const getMedia = (id: string) => tx<Blob | undefined>("readonly", (s) => s.get(id));
export const deleteMedia = (id: string) => tx("readwrite", (s) => s.delete(id)).catch(() => undefined);

/** Reduce la foto a máximo 1080×1920 en JPEG para que suba rápido y se vea nítida. */
export async function prepareImage(file: File): Promise<Blob> {
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, 1080 / bmp.width, 1920 / bmp.height);
    if (scale === 1 && file.size < 1.5 * 1024 * 1024) return file;
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * scale);
    c.height = Math.round(bmp.height * scale);
    c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
    return await new Promise((res) => c.toBlob((b) => res(b ?? file), "image/jpeg", 0.88));
  } catch {
    return file;
  }
}
