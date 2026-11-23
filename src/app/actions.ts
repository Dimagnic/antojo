"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyRestaurant, requireRestaurant, requireUser } from "@/lib/data";
import { onlyDigits, slugify } from "@/lib/utils";

export type ActionState = { error?: string; ok?: boolean } | undefined;

function clean(v: FormDataEntryValue | null) {
  const s = (v ?? "").toString().trim();
  return s.length ? s : null;
}

/** Extrae un Place ID si el usuario pega un enlace que lo contiene. */
function extractPlaceId(text: string | null) {
  if (!text) return null;
  const m = text.match(/(?:placeid=|place_id[:=])([A-Za-z0-9_-]{20,})/);
  if (m) return m[1];
  if (/^ChIJ[A-Za-z0-9_-]{10,}$/.test(text)) return text;
  return null;
}

// ---------------- Negocio ----------------

export async function createRestaurant(_: ActionState, form: FormData): Promise<ActionState> {
  const user = await requireUser();
  if (await getMyRestaurant()) redirect("/onboarding/platillos");

  const name = clean(form.get("name"));
  if (!name) return { error: "Escribe el nombre de tu negocio." };
  const whatsapp = onlyDigits(clean(form.get("whatsapp")) ?? "") || null;
  const maps = clean(form.get("maps_url"));

  const supabase = await createClient();
  const base = slugify(name) || "mi-negocio";
  let slug = base;
  for (let i = 0; i < 5; i++) {
    const { data } = await supabase.from("restaurants").select("id").eq("slug", slug).maybeSingle();
    if (!data) break;
    slug = `${base}-${Math.random().toString(36).slice(2, 6)}`;
  }

  const { error } = await supabase.from("restaurants").insert({
    owner_id: user.id,
    name,
    slug,
    country: clean(form.get("country")) ?? "MX",
    whatsapp,
    maps_url: maps,
    google_place_id: extractPlaceId(clean(form.get("google_place_id")) ?? maps),
  });
  if (error) return { error: "No pudimos guardar tu negocio. Intenta de nuevo." };
  redirect("/onboarding/platillos");
}

export async function updateRestaurant(_: ActionState, form: FormData): Promise<ActionState> {
  const r = await requireRestaurant();
  const name = clean(form.get("name"));
  if (!name) return { error: "El nombre no puede ir vacío." };
  const newSlug = slugify(clean(form.get("slug")) ?? r.slug) || r.slug;
  const supabase = await createClient();

  if (newSlug !== r.slug) {
    const { data } = await supabase.from("restaurants").select("id").eq("slug", newSlug).maybeSingle();
    if (data) return { error: "Esa dirección ya está ocupada, prueba otra." };
  }

  const maps = clean(form.get("maps_url"));
  const { error } = await supabase
    .from("restaurants")
    .update({
      name,
      slug: newSlug,
      whatsapp: onlyDigits(clean(form.get("whatsapp")) ?? "") || null,
      maps_url: maps,
      google_place_id: extractPlaceId(clean(form.get("google_place_id"))) ?? extractPlaceId(maps),
      logo_url: clean(form.get("logo_url")),
      review_prompt: form.get("review_prompt") === "on",
      game_enabled: form.get("game_enabled") === "on",
      instagram_url: clean(form.get("instagram_url")),
    })
    .eq("id", r.id);
  if (error) return { error: "No se pudo guardar. Intenta de nuevo." };
  revalidatePath("/panel", "layout");
  revalidatePath(`/m/${newSlug}`);
  return { ok: true };
}

export async function toggleOpen(isOpen: boolean) {
  const r = await requireRestaurant();
  const supabase = await createClient();
  await supabase.from("restaurants").update({ is_open: isOpen }).eq("id", r.id);
  revalidatePath("/panel");
  revalidatePath(`/m/${r.slug}`);
}

// ---------------- Categorías ----------------

export async function createCategory(name: string, nameEn?: string) {
  const r = await requireRestaurant();
  const n = name.trim();
  if (!n) return { error: "Escribe un nombre." };
  const supabase = await createClient();
  const { count } = await supabase
    .from("categories")
    .select("id", { count: "exact", head: true })
    .eq("restaurant_id", r.id);
  const { data, error } = await supabase
    .from("categories")
    .insert({ restaurant_id: r.id, name: n, name_en: nameEn?.trim() || null, position: count ?? 0 })
    .select()
    .single();
  if (error) return { error: "No se pudo crear la categoría." };
  revalidatePath("/panel/productos");
  revalidatePath("/onboarding/platillos");
  return { category: data };
}

export async function deleteCategory(id: string) {
  const r = await requireRestaurant();
  const supabase = await createClient();
  await supabase.from("categories").delete().eq("id", id).eq("restaurant_id", r.id);
  revalidatePath("/panel/productos");
  revalidatePath(`/m/${r.slug}`);
}

// ---------------- Productos ----------------

export type ProductInput = {
  id?: string;
  name: string;
  name_en?: string | null;
  description?: string | null;
  description_en?: string | null;
  price: number;
  category_id?: string | null;
  media_url?: string | null;
  media_type?: "image" | "video" | null;
  tags?: string[];
  is_available?: boolean;
};

export async function saveProduct(input: ProductInput) {
  const r = await requireRestaurant();
  if (!input.name?.trim()) return { error: "El platillo necesita un nombre." };
  if (!(input.price >= 0)) return { error: "Revisa el precio." };
  const supabase = await createClient();
  const row = {
    restaurant_id: r.id,
    name: input.name.trim(),
    description: input.description?.trim() || null,
    name_en: input.name_en?.trim() || null,
    description_en: input.description_en?.trim() || null,
    price: input.price,
    category_id: input.category_id || null,
    media_url: input.media_url || null,
    media_type: input.media_url ? input.media_type ?? "image" : null,
    tags: input.tags ?? [],
    is_available: input.is_available ?? true,
  };
  const res = input.id
    ? await supabase.from("products").update(row).eq("id", input.id).eq("restaurant_id", r.id).select().single()
    : await supabase.from("products").insert(row).select().single();
  if (res.error) return { error: "No se pudo guardar el platillo." };
  revalidatePath("/panel", "layout");
  revalidatePath("/onboarding/platillos");
  revalidatePath(`/m/${r.slug}`);
  return { product: res.data };
}

export async function deleteProduct(id: string) {
  const r = await requireRestaurant();
  const supabase = await createClient();
  await supabase.from("products").delete().eq("id", id).eq("restaurant_id", r.id);
  revalidatePath("/panel", "layout");
  revalidatePath("/onboarding/platillos");
  revalidatePath(`/m/${r.slug}`);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
