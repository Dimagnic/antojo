import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Category, Product, Restaurant } from "@/lib/types";

export const getUser = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
});

export const requireUser = cache(async () => {
  const user = await getUser();
  if (!user) redirect("/entrar");
  return user;
});

export const getMyRestaurant = cache(async (): Promise<Restaurant | null> => {
  const user = await requireUser();
  const supabase = await createClient();
  const { data } = await supabase
    .from("restaurants")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at")
    .limit(1)
    .maybeSingle();
  return data as Restaurant | null;
});

/** Para el panel: exige sesión y restaurante creado. */
export const requireRestaurant = cache(async () => {
  const r = await getMyRestaurant();
  if (!r) redirect("/onboarding");
  return r;
});

export async function getMenu(restaurantId: string) {
  const supabase = await createClient();
  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase.from("categories").select("*").eq("restaurant_id", restaurantId).order("position").order("created_at"),
    supabase.from("products").select("*").eq("restaurant_id", restaurantId).order("position").order("created_at"),
  ]);
  return {
    categories: (categories ?? []) as Category[],
    products: ((products ?? []) as Product[]).map((p) => ({ ...p, price: Number(p.price) })),
  };
}

export async function getPublicMenu(slug: string) {
  const supabase = await createClient();
  const { data: restaurant } = await supabase.from("restaurants").select("*").eq("slug", slug).maybeSingle();
  if (!restaurant) return null;
  const menu = await getMenu(restaurant.id);
  return { restaurant: restaurant as Restaurant, ...menu };
}
