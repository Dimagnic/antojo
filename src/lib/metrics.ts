import "server-only";
import { createClient } from "@/lib/supabase/server";

export type EventRow = { type: string; product_id: string | null; created_at: string };

export async function getEvents(restaurantId: string, days: number) {
  const supabase = await createClient();
  const since = new Date(Date.now() - days * 86400000).toISOString();
  const { data } = await supabase
    .from("events")
    .select("type, product_id, created_at")
    .eq("restaurant_id", restaurantId)
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(20000);
  return (data ?? []) as EventRow[];
}

const TZ = "America/Mexico_City";
export const dayKey = (iso: string) => new Date(iso).toLocaleDateString("en-CA", { timeZone: TZ });
export const hourOf = (iso: string) =>
  Number(new Date(iso).toLocaleString("en-US", { timeZone: TZ, hour: "numeric", hour12: false })) % 24;
export const todayKey = () => new Date().toLocaleDateString("en-CA", { timeZone: TZ });

export function lastNDays(n: number) {
  const now = Date.now();
  return Array.from({ length: n }, (_, i) =>
    new Date(now - (n - 1 - i) * 86400000).toLocaleDateString("en-CA", { timeZone: TZ }),
  );
}
