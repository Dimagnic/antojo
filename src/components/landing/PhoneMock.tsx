"use client";

import { useEffect, useState } from "react";
import { Heart, LayoutGrid, Menu, MessageCircle, Share2, ShoppingCart, Ticket } from "lucide-react";

export type Slide = { img: string; name: string; desc: string; price: string; tag?: string };

/** Celular con una carta de Antojo en movimiento (fotos que cambian con zoom suave). */
export function PhoneMock({
  slides,
  chips,
  interval = 3800,
  size = "lg",
  time = "10:52",
}: {
  slides: Slide[];
  chips: string[];
  interval?: number;
  size?: "lg" | "sm";
  time?: string;
}) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % slides.length), interval);
    return () => clearInterval(t);
  }, [slides.length, interval]);

  const big = size === "lg";
  return (
    <div className={`relative rounded-[2.6rem] bg-[#0a0a0a] p-[9px] shadow-[0_40px_80px_-30px_rgba(10,10,10,0.55)] ring-1 ring-black/40 ${big ? "w-[270px] sm:w-[290px]" : "w-[190px]"}`}>
      <div className={`relative overflow-hidden rounded-[2.1rem] bg-black ${big ? "aspect-[9/19.5]" : "aspect-[9/18]"}`}>
        {/* Isla dinámica y barra de estado */}
        {big && (
          <>
            <div className="absolute left-1/2 top-2 z-30 h-[22px] w-[86px] -translate-x-1/2 rounded-full bg-black" />
            <div className="absolute inset-x-0 top-2.5 z-20 flex justify-between px-6 text-[11px] font-semibold text-white">
              <span>{time}</span>
              <span className="tracking-tight">●●● ▮</span>
            </div>
          </>
        )}

        {slides.map((s, n) => (
          <div key={s.img} className={`absolute inset-0 transition-opacity duration-1000 ${n === i ? "opacity-100" : "opacity-0"}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.img}
              alt={s.name}
              loading={n === 0 ? "eager" : "lazy"}
              className={`h-full w-full object-cover ${n === i ? "kb-hero" : ""}`}
              style={{ filter: "saturate(1.12) contrast(1.05) brightness(1.03)" }}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/40" />

        {/* Barra superior de la carta */}
        <div className={`absolute inset-x-0 z-10 ${big ? "top-10" : "top-2"} px-2.5`}>
          <div className="no-scrollbar flex gap-1.5 overflow-hidden">
            {chips.map((c, n) => (
              <span
                key={c}
                className={`shrink-0 rounded-full px-2.5 py-1 font-semibold ${big ? "text-[10px]" : "text-[8px]"} ${
                  n === 0 ? "bg-white text-tinta" : "bg-black/40 text-white backdrop-blur"
                }`}
              >
                {c}
              </span>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between text-white">
            <span className="rounded-full bg-black/40 p-1.5 backdrop-blur">
              <LayoutGrid className={big ? "h-3.5 w-3.5" : "h-2.5 w-2.5"} />
            </span>
            <span className="flex items-center gap-1">
              {big && (
                <span className="flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 text-[9px] font-semibold backdrop-blur">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sol" />
                  <Ticket className="h-3 w-3" /> Juega y gana
                </span>
              )}
              <span className="rounded-full bg-black/40 p-1.5 backdrop-blur">
                <Menu className={big ? "h-3.5 w-3.5" : "h-2.5 w-2.5"} />
              </span>
            </span>
          </div>
        </div>

        {/* Acciones laterales */}
        <div className={`absolute right-2 z-10 flex flex-col items-center text-white ${big ? "bottom-36 gap-3" : "bottom-24 gap-2"}`}>
          <Heart className={big ? "h-5 w-5" : "h-3.5 w-3.5"} />
          <MessageCircle className={big ? "h-5 w-5" : "h-3.5 w-3.5"} />
          <Share2 className={big ? "h-5 w-5" : "h-3.5 w-3.5"} />
        </div>

        {/* Info del platillo */}
        {slides.map((s, n) => (
          <div
            key={s.name}
            className={`absolute inset-x-0 bottom-0 z-10 px-3 pr-9 text-white transition-all duration-700 ${big ? "pb-6" : "pb-3"} ${
              n === i ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            {s.tag && <span className={`mb-1.5 inline-block rounded-full bg-red-600 px-2 py-0.5 font-bold uppercase ${big ? "text-[9px]" : "text-[7px]"}`}>{s.tag}</span>}
            <div className="flex items-center gap-1.5">
              <span className={`rounded-full bg-rosa px-2 py-0.5 font-bold ${big ? "text-xs" : "text-[9px]"}`}>{s.price}</span>
              <span className={`inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 ${big ? "text-[10px]" : "text-[8px]"}`}>
                Agregar <ShoppingCart className="h-2.5 w-2.5" />
              </span>
            </div>
            <p className={`mt-1 font-bold leading-tight ${big ? "text-base" : "text-[11px]"}`}>{s.name}</p>
            <p className={`mt-0.5 leading-snug text-white/75 ${big ? "text-[10.5px]" : "text-[8px]"}`}>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
