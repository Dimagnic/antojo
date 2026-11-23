"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { PHOTOS, photo } from "@/lib/site";

const cards = [
  { type: "Taquería", emoji: "🌮", chips: ["Tacos", "Tortas", "Bebidas"], img2: PHOTOS.burrito, img: PHOTOS.tacos, name: "Tacos de asada (3)", price: "$89" },
  { type: "Cafetería", emoji: "☕", chips: ["Café", "Pan dulce", "Desayunos"], img2: PHOTOS.donut, img: PHOTOS.latte, name: "Latte de la casa", price: "$55" },
  { type: "Sushi", emoji: "🍣", chips: ["Rollos", "Entradas", "Bebidas"], img2: PHOTOS.sushi, img: PHOTOS.sushiRolls, name: "Roll philadelphia", price: "$159" },
  { type: "Pizzería", emoji: "🍕", chips: ["Pizzas", "Pastas", "Postres"], img2: PHOTOS.pasta, img: PHOTOS.pizzaPepperoni, name: "Pizza pepperoni", price: "$199" },
  { type: "Hamburguesas", emoji: "🍔", chips: ["Burgers", "Papas", "Malteadas"], img2: PHOTOS.burgerDouble, img: PHOTOS.burger, name: "Burger Antojo", price: "$169" },
  { type: "Cortes", emoji: "🥩", chips: ["Cortes", "Guarniciones", "Vinos"], img2: PHOTOS.steakSalad, img: PHOTOS.steak, name: "Corte al fuego", price: "$289" },
  { type: "Bar", emoji: "🍸", chips: ["Coctelería", "Cerveza", "Botanas"], img2: PHOTOS.beer, img: PHOTOS.cocktail, name: "Mezcalita de la casa", price: "$129" },
  { type: "Postres", emoji: "🍰", chips: ["Pasteles", "Donas", "Café"], img2: PHOTOS.donut, img: PHOTOS.cake, name: "Pastel de chocolate", price: "$89" },
];

/** Carrusel de cartas de ejemplo: se mueve solo y se pausa al pasar el dedo o el ratón. */
export function Showcase() {
  const wrap = useRef<HTMLDivElement>(null);
  const loop = [...cards, ...cards];
  // Cada celular alterna entre dos platillos, como las cartas en vivo de LaCarta
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 1600);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="relative">
      <div ref={wrap} className="no-scrollbar overflow-x-auto lg:overflow-visible">
        <div className="marquee flex w-max gap-4 px-4 py-4 lg:w-full lg:justify-center lg:gap-7">
          {loop.map((c, i) => (
            <figure key={i} className={`w-[150px] shrink-0 sm:w-[170px] lg:w-[186px] ${i >= 5 ? "lg:hidden" : ""}`}>
              <figcaption className="mb-3 flex h-9 items-center justify-center gap-1.5 text-[15px] font-extrabold tracking-tight text-rosa">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rosa-50 text-[14px]">{c.emoji}</span>
                {c.type}
              </figcaption>
              <div className="overflow-hidden rounded-[1.4rem] bg-black p-1 shadow-[0_18px_40px_-20px_rgba(27,17,48,0.6)]">
                <div className="relative aspect-[9/16] overflow-hidden rounded-[1.2rem]">
                  {/* eslint-disable @next/next/no-img-element */}
                  {[c.img, c.img2].map((src, k) => (
                    <img
                      key={src + k}
                      src={photo(src, 400, 760)}
                      alt={c.name}
                      loading="lazy"
                      className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ${
                        (Math.floor((tick + i) / 3) % 2) === k ? "scale-100 opacity-100" : "scale-110 opacity-0"
                      }`}
                      style={{ filter: "saturate(1.12) contrast(1.05) brightness(1.03)" }}
                    />
                  ))}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />
                  <div className="absolute inset-x-1.5 top-1.5 flex gap-1 overflow-hidden text-[7px] font-semibold">
                    {c.chips.map((ch, n) => (
                      <span key={ch} className={`shrink-0 rounded-full px-1.5 py-0.5 ${n === 0 ? "bg-white text-tinta" : "bg-black/45 text-white"}`}>
                        {ch}
                      </span>
                    ))}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-2.5 text-white">
                    <span className="rounded-full bg-rosa px-1.5 py-0.5 text-[8px] font-bold">{c.price}</span>
                    <p className="mt-1 text-[11px] font-bold leading-tight">{c.name}</p>
                  </div>
                </div>
              </div>
            </figure>
          ))}
        </div>
      </div>
      <button
        aria-label="Ver más"
        onClick={() => wrap.current?.scrollBy({ left: 360, behavior: "smooth" })}
        className="absolute right-3 top-1/2 flex h-10 w-10 lg:hidden -translate-y-1/2 items-center justify-center rounded-full bg-white text-tinta shadow-lg ring-1 ring-tinta/10"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 lg:hidden bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 lg:hidden bg-gradient-to-l from-white to-transparent" />
    </div>
  );
}
