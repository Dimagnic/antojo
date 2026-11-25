"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import { COUNTRIES, clearDraft, getMedia, type Draft } from "@/lib/draft";
import { slugify } from "@/lib/utils";

function placeId(text: string) {
  const m = text.match(/(?:placeid=|place_id[:=])([A-Za-z0-9_-]{20,})/);
  return m ? m[1] : null;
}

/**
 * Guarda el borrador en Supabase a nombre del usuario con sesión
 * (cuenta normal o anónima) y devuelve el slug de la carta.
 */
export async function publishDraft(supabase: SupabaseClient, draft: Draft, onStatus?: (s: string) => void) {
  const { data: u } = await supabase.auth.getUser();
  const user = u.user;
  if (!user) throw new Error("sin-sesion");

  // Si ya tiene negocio, no se duplica
  const { data: existing } = await supabase.from("restaurants").select("id, slug").eq("owner_id", user.id).limit(1).maybeSingle();
  let restaurantId = existing?.id as string | undefined;
  let slug = existing?.slug as string | undefined;

  if (!restaurantId) {
    onStatus?.("Creando tu negocio");
    const country = COUNTRIES.find((c) => c.code === draft.business.country) ?? COUNTRIES[0];
    const digits = draft.business.whatsapp.replace(/\D/g, "");
    const base = slugify(draft.business.name) || "mi-negocio";
    slug = base;
    for (let i = 0; i < 6; i++) {
      const { data } = await supabase.from("restaurants").select("id").eq("slug", slug).maybeSingle();
      if (!data) break;
      slug = `${base}-${Math.random().toString(36).slice(2, 6)}`;
    }
    const { data, error } = await supabase
      .from("restaurants")
      .insert({
        owner_id: user.id,
        name: draft.business.name.trim(),
        slug,
        country: country.code,
        currency: country.currency,
        whatsapp: digits ? (digits.startsWith(country.dial) && digits.length > 10 ? digits : country.dial + digits) : null,
        maps_url: draft.business.maps.trim() || null,
        google_place_id: placeId(draft.business.maps),
      })
      .select("id, slug")
      .single();
    if (error) throw error;
    restaurantId = data.id;
    slug = data.slug;
  }

  // Categorías en el orden en que se usan
  onStatus?.("Ordenando tu carta");
  const used = draft.categories.filter((c) => draft.products.some((p) => p.category === c));
  const catIds = new Map<string, string>();
  if (used.length) {
    const { data, error } = await supabase
      .from("categories")
      .insert(used.map((name, position) => ({ restaurant_id: restaurantId, name, position })))
      .select("id, name");
    if (error) throw error;
    data.forEach((c) => catIds.set(c.name, c.id));
  }

  // Productos con sus fotos y videos
  onStatus?.("Cargando tus productos");
  for (const [position, p] of draft.products.entries()) {
    let media_url: string | null = null;
    if (p.mediaId) {
      const blob = await getMedia(p.mediaId);
      if (blob) {
        const ext = p.mediaType === "video" ? (blob.type.split("/")[1] || "mp4") : "jpg";
        const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
        const up = await supabase.storage.from("media").upload(path, blob, { contentType: blob.type || undefined });
        if (!up.error) media_url = supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
      }
    }
    const { error } = await supabase.from("products").insert({
      restaurant_id: restaurantId,
      category_id: catIds.get(p.category) ?? null,
      name: p.name.trim(),
      description: p.description.trim() || null,
      price: p.price ?? 0,
      media_url,
      media_type: media_url ? p.mediaType : null,
      position,
    });
    if (error) throw error;
  }

  onStatus?.("Últimos detalles");
  await clearDraft(draft);
  return slug!;
}
