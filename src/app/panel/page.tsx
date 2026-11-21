import Link from "next/link";
import { CheckCircle2, Circle, Eye, MessageCircle, Star, UtensilsCrossed } from "lucide-react";
import { OpenToggle } from "@/components/OpenToggle";
import { QrCard } from "@/components/QrCard";
import { getMenu, requireRestaurant } from "@/lib/data";
import { dayKey, getEvents, todayKey } from "@/lib/metrics";
import { siteUrl } from "@/lib/utils";

export const metadata = { title: "Resumen" };

export default async function Page({ searchParams }: { searchParams: Promise<{ bienvenida?: string }> }) {
  const { bienvenida } = await searchParams;
  const r = await requireRestaurant();
  const [{ products }, events] = await Promise.all([getMenu(r.id), getEvents(r.id, 7)]);
  const today = todayKey();
  const visits = events.filter((e) => e.type === "visit");
  const stats = [
    { label: "Visitas hoy", value: visits.filter((e) => dayKey(e.created_at) === today).length, icon: Eye },
    { label: "Visitas 7 días", value: visits.length, icon: Eye },
    { label: "Pedidos por WhatsApp (7 días)", value: events.filter((e) => e.type === "whatsapp_order").length, icon: MessageCircle },
    { label: "Clics a reseñar (7 días)", value: events.filter((e) => e.type === "review_click").length, icon: Star },
  ];
  const checklist = [
    { done: products.length >= 3, label: "Agrega al menos 3 platillos", href: "/panel/productos" },
    { done: products.length > 0 && products.every((p) => p.media_url), label: "Ponle foto o video a todos tus platillos", href: "/panel/productos" },
    { done: Boolean(r.whatsapp), label: "Conecta tu WhatsApp para recibir pedidos", href: "/panel/ajustes" },
    { done: Boolean(r.maps_url || r.google_place_id), label: "Agrega tu enlace de Google Maps para las reseñas", href: "/panel/ajustes" },
  ];
  const doneCount = checklist.filter((c) => c.done).length;

  return (
    <div className="space-y-6">
      {bienvenida && (
        <div className="rounded-3xl bg-gradient-to-r from-rosa to-rosa-600 p-6 text-white">
          <h1 className="text-2xl font-extrabold">¡Tu carta ya está en línea! 🎉</h1>
          <p className="mt-1 text-white/85">Descarga tu QR, imprímelo y ponlo en tus mesas.</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-3xl border border-rosa-100 bg-white p-5">
            <s.icon className="h-5 w-5 text-rosa" />
            <p className="mt-3 text-3xl font-extrabold">{s.value}</p>
            <p className="text-sm text-tinta-70">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <QrCard url={`${siteUrl()}/m/${r.slug}`} name={r.slug} />
        <div className="space-y-6">
          <div className="rounded-3xl border border-rosa-100 bg-white p-5">
            <OpenToggle isOpen={r.is_open} />
          </div>
          <div className="rounded-3xl border border-rosa-100 bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold">Completa tu carta</h2>
              <span className="text-sm font-semibold text-rosa">
                {doneCount}/{checklist.length}
              </span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-rosa-50">
              <div className="h-2 rounded-full bg-rosa" style={{ width: `${(doneCount / checklist.length) * 100}%` }} />
            </div>
            <ul className="mt-4 space-y-2">
              {checklist.map((c) => (
                <li key={c.label}>
                  <Link href={c.href} className="flex items-center gap-3 rounded-xl p-2 hover:bg-crema">
                    {c.done ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5 text-tinta/25" />}
                    <span className={c.done ? "text-tinta-70 line-through" : "font-medium"}>{c.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Link
            href="/panel/productos"
            className="flex items-center gap-3 rounded-3xl border border-rosa-100 bg-white p-5 hover:border-rosa"
          >
            <UtensilsCrossed className="h-5 w-5 text-rosa" />
            <span className="font-semibold">{products.length} platillos en tu carta</span>
            <span className="ml-auto text-sm text-rosa">Administrar →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
