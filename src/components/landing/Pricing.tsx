"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, Crown, ShoppingCart, X } from "lucide-react";
import { FlagMX, FlagUS } from "@/components/Flags";

type Cur = "MXN" | "USD";

const PRICES = {
  MXN: { pro: "$349", maxFirst: "$49", maxAfter: "$599" },
  USD: { pro: "$19", maxFirst: "$3", maxAfter: "$32" },
};

const pro: [boolean, string][] = [
  [true, "Métricas de tu negocio"],
  [true, "Platillos ilimitados con fotos y video"],
  [true, "Invitación a reseñas en Google Maps"],
  [true, "Tu logo y colores en la carta"],
  [true, "Carrito con pedidos por WhatsApp sin comisión"],
  [true, "Carta con código QR que nunca cambia"],
  [false, "Lealtad y puntos"],
  [false, "Juegos con premios"],
  [false, "Promociones por correo"],
];

const max = [
  "Todo lo del plan Pro",
  "Métricas de tu negocio",
  "Puntos por cada compra",
  "Premios y canjes personalizados",
  "Ruleta “Juega y gana” para que vuelvan",
  "Promociones por correo (próximamente)",
  "Carta en español e inglés",
  "Base de clientes con historial de visitas",
  "Acompañamiento personalizado",
];

export function Pricing() {
  const [cur, setCur] = useState<Cur>("MXN");
  const p = PRICES[cur];
  return (
    <>
      <div className="mt-6 flex justify-center">
        <div className="inline-flex rounded-full bg-white p-1 text-[13px] font-semibold shadow ring-1 ring-tinta/10">
          {(["MXN", "USD"] as Cur[]).map((c) => (
            <button
              key={c}
              onClick={() => setCur(c)}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 transition ${cur === c ? "bg-tinta text-white" : "text-tinta-70"}`}
            >
              {c === "MXN" ? <FlagMX className="h-3 w-4" /> : <FlagUS className="h-3 w-4" />} {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 grid max-w-[760px] md:mt-10 items-stretch gap-6 md:grid-cols-2">
        {/* Pro */}
        <div className="order-2 flex flex-col overflow-hidden rounded-[28px] bg-white shadow md:order-1-[0_24px_60px_-30px_rgba(27,17,48,0.35)] ring-1 ring-rosa-100">
          <div className="relative overflow-hidden bg-gradient-to-br from-rosa via-[#ff2f92] to-[#ff5c7a] px-6 pb-5 pt-6 text-white">
            <span className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-white/15" />
            <h3 className="text-[22px] font-bold">Pro</h3>
            <p className="text-[12.5px] text-white/85">Todo para hacer crecer tu negocio</p>
          </div>
          <div className="border-b border-tinta/5 px-6 py-6">
            <p className="flex items-end gap-2">
              <span key={cur} className="anim-pop text-[44px] font-extrabold leading-none text-rosa">
                {p.pro}
              </span>
              <span className="pb-1 text-[13px] text-tinta-70">{cur} al mes</span>
            </p>
          </div>
          <div className="flex flex-1 flex-col px-6 py-6">
            <Link href="/registro" className="btn-primary flex items-center justify-center gap-2 rounded-xl py-3 text-[15px] font-semibold text-white">
              Empezar gratis <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-2 text-center text-[12px] text-tinta-70">Cancela cuando quieras</p>
            <p className="mt-6 flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide">
              <ShoppingCart className="h-4 w-4 text-rosa" /> Todo lo que necesitas para vender más
            </p>
            <ul className="mt-4 space-y-2.5">
              {pro.map(([ok, t]) => (
                <li key={t} className="flex gap-2.5 text-[13.5px]">
                  {ok ? (
                    <Check className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-emerald-500 p-0.5 text-white" />
                  ) : (
                    <X className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-red-500 p-0.5 text-white" />
                  )}
                  <span className={ok ? "" : "text-tinta-70"}>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Max */}
        <div className="relative order-1 flex flex-col overflow-hidden rounded-[28px] bg-[#0f0a18] md:order-2 text-white shadow-[0_30px_80px_-20px_rgba(230,0,126,0.45)] ring-2 ring-rosa/70">
          <span className="absolute left-1/2 top-0 z-10 -translate-x-1/2 whitespace-nowrap rounded-b-xl bg-gradient-to-r from-rosa to-sol px-4 py-1 text-[11px] font-bold uppercase tracking-wide">
            Oferta por tiempo limitado
          </span>
          <div className="relative overflow-hidden px-6 pb-5 pt-8">
            <span className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-white/5" />
            <h3 className="text-[22px] font-bold">Max</h3>
            <p className="text-[12.5px] text-sol">Fideliza a tus clientes con puntos y juegos</p>
          </div>
          <div className="border-y border-white/10 px-6 py-6">
            <p className="flex items-end gap-2">
              <span key={cur} className="anim-pop text-[44px] font-extrabold leading-none text-sol">
                {p.maxFirst}
              </span>
              <span className="pb-1 text-[13px] font-semibold text-white/85">primer mes</span>
            </p>
            <p className="mt-2 text-[13px] text-white/70">
              Después {p.maxAfter} {cur} al mes
            </p>
          </div>
          <div className="flex flex-1 flex-col px-6 py-6">
            <Link
              href="/registro"
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sol to-[#ff8a00] py-3 text-[15px] font-bold text-tinta shadow-lg shadow-sol/30 transition hover:brightness-105"
            >
              Empezar gratis <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-2 text-center text-[12px] text-white/60">Cancela cuando quieras</p>
            <p className="mt-6 flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide">
              <Crown className="h-4 w-4 text-sol" /> Desbloquea todas las funciones
            </p>
            <ul className="mt-4 space-y-2.5">
              {max.map((t) => (
                <li key={t} className="flex gap-2.5 text-[13.5px] text-white/90">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-sol p-0.5 text-tinta" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <p className="mt-6 text-center text-[13px] text-tinta-70">
        Prueba gratis de 14 días en cualquier plan. Precios en {cur === "MXN" ? "pesos mexicanos" : "dólares estadounidenses"}.
      </p>
    </>
  );
}
