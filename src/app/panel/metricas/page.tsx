import { getMenu, requireRestaurant } from "@/lib/data";
import { dayKey, getEvents, hourOf, lastNDays } from "@/lib/metrics";

export const metadata = { title: "Métricas" };

export default async function Page() {
  const r = await requireRestaurant();
  const [events, { products }] = await Promise.all([getEvents(r.id, 30), getMenu(r.id)]);
  const visits = events.filter((e) => e.type === "visit");

  // Visitas por día (últimos 14 días)
  const days = lastNDays(14);
  const perDay = days.map((d) => ({ d, n: visits.filter((v) => dayKey(v.created_at) === d).length }));
  const maxDay = Math.max(1, ...perDay.map((x) => x.n));

  // Horas pico
  const perHour = Array.from({ length: 24 }, (_, h) => visits.filter((v) => hourOf(v.created_at) === h).length);
  const maxHour = Math.max(1, ...perHour);
  const peak = perHour.indexOf(Math.max(...perHour));

  // Platillos más vistos
  const views = new Map<string, number>();
  const carts = new Map<string, number>();
  for (const e of events) {
    if (!e.product_id) continue;
    if (e.type === "view") views.set(e.product_id, (views.get(e.product_id) ?? 0) + 1);
    if (e.type === "add_cart") carts.set(e.product_id, (carts.get(e.product_id) ?? 0) + 1);
  }
  const top = products
    .map((p) => ({ p, v: views.get(p.id) ?? 0, c: carts.get(p.id) ?? 0 }))
    .sort((a, b) => b.v - a.v)
    .slice(0, 8);

  const kpis = [
    { label: "Visitas (30 días)", value: visits.length },
    { label: "Platillos vistos", value: events.filter((e) => e.type === "view").length },
    { label: "Agregados al pedido", value: events.filter((e) => e.type === "add_cart").length },
    { label: "Pedidos por WhatsApp", value: events.filter((e) => e.type === "whatsapp_order").length },
    { label: "Clics a reseñar", value: events.filter((e) => e.type === "review_click").length },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-3xl border border-rosa-100 bg-white p-5">
            <p className="text-3xl font-extrabold">{k.value}</p>
            <p className="text-sm text-tinta-70">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-rosa-100 bg-white p-5">
          <h2 className="font-bold">Visitas por día</h2>
          <p className="text-sm text-tinta-70">Últimos 14 días</p>
          <div className="mt-5 flex h-44 items-end gap-1.5">
            {perDay.map(({ d, n }) => (
              <div key={d} className="group flex flex-1 flex-col items-center gap-1">
                <span className="text-[10px] font-semibold text-tinta-70 opacity-0 group-hover:opacity-100">{n}</span>
                <div className="w-full rounded-t-md bg-rosa/85" style={{ height: `${Math.max(3, (n / maxDay) * 140)}px` }} title={`${d}: ${n}`} />
                <span className="text-[10px] text-tinta-70">{d.slice(8)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-rosa-100 bg-white p-5">
          <h2 className="font-bold">Horas pico</h2>
          <p className="text-sm text-tinta-70">
            {visits.length ? `Tu hora con más visitas: ${peak}:00 h` : "Aún no hay visitas suficientes"}
          </p>
          <div className="mt-5 flex h-44 items-end gap-[3px]">
            {perHour.map((n, h) => (
              <div key={h} className="flex flex-1 flex-col items-center gap-1">
                <div className={`w-full rounded-t ${h === peak && n ? "bg-sol" : "bg-tinta/80"}`} style={{ height: `${Math.max(2, (n / maxHour) * 140)}px` }} title={`${h}:00 · ${n}`} />
                <span className="text-[9px] text-tinta-70">{h % 3 === 0 ? h : ""}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-3xl border border-rosa-100 bg-white p-5">
        <h2 className="font-bold">Platillos más vistos</h2>
        {top.length === 0 ? (
          <p className="mt-3 text-sm text-tinta-70">Agrega platillos para ver sus números.</p>
        ) : (
          <table className="mt-4 w-full text-sm">
            <thead className="text-left text-tinta-70">
              <tr>
                <th className="pb-2 font-medium">Platillo</th>
                <th className="pb-2 text-right font-medium">Vistas</th>
                <th className="pb-2 text-right font-medium">Al pedido</th>
                <th className="pb-2 text-right font-medium">Me gusta</th>
              </tr>
            </thead>
            <tbody>
              {top.map(({ p, v, c }) => (
                <tr key={p.id} className="border-t border-tinta/5">
                  <td className="py-2.5 font-medium">{p.name}</td>
                  <td className="py-2.5 text-right">{v}</td>
                  <td className="py-2.5 text-right">{c}</td>
                  <td className="py-2.5 text-right">{p.likes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
