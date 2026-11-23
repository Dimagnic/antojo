"use client";

import { useRef } from "react";
import { ChevronRight } from "lucide-react";
import { PHOTOS, photo } from "@/lib/site";

const cards = [
  { type: "Taquería", chips: ["Tacos", "Tortas", "Bebidas"], img: PHOTOS.tacos, name: "Tacos de asada (3)", price: "$89" },
  { type: "Cafetería", chips: ["Café", "Pan dulce", "Desayunos"], img: PHOTOS.latte, name: "Latte de la casa", price: "$55" },
  { type: "Sushi", chips: ["Rollos", "Entradas", "Bebidas"], img: PHOTOS.sushiRolls, name: "Roll philadelphia", price: "$159" },
  { type: "Pizzería", chips: ["Pizzas", "Pastas", "Postres"], img: PHOTOS.pizzaPepperoni, name: "Pizza pepperoni", price: "$199" },
  { type: "Hamburguesas", chips: ["Burgers", "Papas", "Malteadas"], img: PHOTOS.burger, name: "Burger Antojo", price: "$169" },
  { type: "Cortes", chips: ["Cortes", "Guarniciones", "Vinos"], img: PHOTOS.steak, name: "Corte al fuego", price: "$289" },
  { type: "Bar", chips: ["Coctelería", "Cerveza", "Botanas"], img: PHOTOS.cocktail, name: "Mezcalita de la casa", price: "$129" },
  { type: "Postres", chips: ["Pasteles", "Donas", "Café"], img: PHOTOS.cake, name: "Pastel de chocolate", price: "$89" },
];

/** Carrusel de cartas de ejemplo: se mueve solo y se pausa al pasar el dedo o el ratón. */
export function Showcase() {
  const wrap = useRef<HTMLDivElement>(null);
  const loop = [...cards, ...cards];
  return (
    <div className="relative">
      <div ref={wrap} className="no-scrollbar overflow-x-auto">
        <div className="marquee flex w-max gap-4 px-4 py-4">
          {loop.map((c, i) => (
            <figure key={i} className="w-[170px] shrink-0">
              <figcaption className="mb-2 text-center text-[15px] font-bold text-rosa">{c.type}</figcaption>
              <div className="overflow-hidden rounded-[1.6rem] bg-black p-1.5 shadow-[0_18px_40px_-20px_rgba(27,17,48,0.6)]">
                <div className="relative aspect-[9/17] overflow-hidden rounded-[1.3rem]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo(c.img, 400, 760)}
                    alt={c.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[2000ms] hover:scale-110"
                    style={{ filter: "saturate(1.12) contrast(1.05) brightness(1.03)" }}
                  />
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
        className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-tinta shadow-lg ring-1 ring-tinta/10"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent" />
    </div>
  );
}
