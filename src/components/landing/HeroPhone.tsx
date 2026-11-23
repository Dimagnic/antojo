"use client";

import { useEffect, useState } from "react";
import { BarChart3, Clock, Eye, Heart, LayoutGrid, MapPin, Menu, MessageCircle, Plus, Share2, ShoppingCart, Star, Trophy, UtensilsCrossed } from "lucide-react";
import { PHOTOS, photo } from "@/lib/site";

/**
 * Celular del inicio: cuenta todo el proceso de Antojo en escenas que se repiten.
 * 1 panel de platillos → 2 agregar platillo → 3 carta tipo TikTok → 4 Google Maps → 5 reseña → 6 métricas
 */
const SCENES = [
  { id: "panel", ms: 3200 },
  { id: "form", ms: 4200 },
  { id: "feed", ms: 5200 },
  { id: "maps", ms: 2800 },
  { id: "review", ms: 4600 },
  { id: "metrics", ms: 4600 },
] as const;

const vivid = { filter: "saturate(1.12) contrast(1.05) brightness(1.03)" } as const;

function useTyping(text: string, active: boolean, speed = 55, delay = 300) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    let i = 0;
    let t: ReturnType<typeof setTimeout>;
    const start = setTimeout(function tick() {
      i += 1;
      setN(i);
      if (i < text.length) t = setTimeout(tick, speed);
    }, delay);
    return () => (clearTimeout(start), clearTimeout(t), setN(0));
  }, [text, active, speed, delay]);
  return text.slice(0, n);
}

export function HeroPhone() {
  const [s, setS] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setS((n) => (n + 1) % SCENES.length), SCENES[s].ms);
    return () => clearTimeout(t);
  }, [s]);
  const scene = SCENES[s].id;

  return (
    <div className="relative w-[220px] rounded-[2.5rem] bg-[#0c0814] p-[8px] shadow-[0_40px_80px_-30px_rgba(27,17,48,0.55)] ring-1 ring-black/40 sm:w-[236px]">
      <div className="relative aspect-[9/19.5] overflow-hidden rounded-[2.15rem] bg-white">
        {/* Isla y barra de estado */}
        <div className="absolute left-1/2 top-2 z-40 h-[22px] w-[84px] -translate-x-1/2 rounded-full bg-black" />
        <div
          className={`absolute inset-x-0 top-2.5 z-30 flex justify-between px-6 text-[11px] font-semibold ${
            scene === "feed" ? "text-white" : "text-tinta"
          }`}
        >
          <span>10:52</span>
          <span className="tracking-tight">●●● ▮</span>
        </div>

        <div key={scene} className="anim-fade absolute inset-0">
          {scene === "panel" && <PanelScene />}
          {scene === "form" && <FormScene />}
          {scene === "feed" && <FeedScene />}
          {scene === "maps" && <MapsScene />}
          {scene === "review" && <ReviewScene />}
          {scene === "metrics" && <MetricsScene />}
        </div>

        {/* Barra del navegador */}
        {scene !== "feed" && (
          <div className="absolute inset-x-0 bottom-0 z-30 flex items-center justify-between border-t border-tinta/5 bg-white/95 px-4 pb-3 pt-2 text-[9px] text-tinta-70">
            <span>‹</span>
            <span className="rounded-full bg-crema px-3 py-0.5">{scene === "maps" || scene === "review" ? "google.com/maps" : "antojo.mx"}</span>
            <span>⋯</span>
          </div>
        )}
      </div>
    </div>
  );
}

function PanelTop({ active }: { active: "carta" | "metricas" | "platillos" }) {
  const tab = (id: typeof active, label: string, Icon: React.ComponentType<{ className?: string }>) => (
    <span className={`flex items-center gap-1 rounded-full px-2 py-1 ${active === id ? "bg-rosa text-white" : "text-tinta-70"}`}>
      <Icon className="h-2.5 w-2.5" /> {label}
    </span>
  );
  return (
    <div className="px-3 pt-9">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-tinta px-2 py-0.5 text-[7px] font-semibold text-white">Mejorar plan</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/antojo-icono.svg" alt="" className="h-4 w-4" />
      </div>
      <p className="mt-1 text-[7.5px] text-tinta-70">Prueba gratuita vence en 14 días.</p>
      <div className="mt-2 flex gap-1 text-[7.5px] font-medium">
        {tab("carta", "Mi carta", LayoutGrid)}
        {tab("metricas", "Métricas", BarChart3)}
        {tab("platillos", "Platillos", UtensilsCrossed)}
      </div>
    </div>
  );
}

function PanelScene() {
  const items = [
    { n: "Pizza margarita", c: "Pizzas", p: "$189", img: PHOTOS.pizzaBoard, l: 133 },
    { n: "Tacos de asada (3)", c: "Mexicano", p: "$89", img: PHOTOS.tacos, l: 402 },
    { n: "Burger Antojo", c: "Hamburguesas", p: "$169", img: PHOTOS.burger, l: 187 },
  ];
  return (
    <div className="h-full bg-white">
      <PanelTop active="platillos" />
      <div className="px-3">
        <p className="mt-3 flex items-center gap-1 text-[11px] font-semibold">
          <UtensilsCrossed className="h-3 w-3 text-rosa" /> Platillos
        </p>
        <p className="text-[7.5px] text-tinta-70">Agrega, modifica o elimina platillos.</p>
        <div className="mt-2 flex gap-1.5">
          <span className="rounded-full bg-rosa-50 px-2 py-1 text-[7.5px] font-semibold text-rosa">Ver carta</span>
          <span className="anim-pop flex items-center gap-0.5 rounded-full bg-rosa px-2 py-1 text-[7.5px] font-semibold text-white" style={{ animationDelay: "1.6s" }}>
            Agregar platillo <Plus className="h-2.5 w-2.5" />
          </span>
        </div>
        <div className="mt-2 flex gap-1 text-[7px] font-medium">
          {["Entradas", "Pizzas", "Mexicano", "Bebidas"].map((c, i) => (
            <span key={c} className={`rounded-full px-1.5 py-0.5 ${i === 2 ? "bg-rosa text-white" : "bg-crema"}`}>
              {c}
            </span>
          ))}
        </div>
        <div className="mt-2 space-y-2">
          {items.map((it, i) => (
            <div key={it.n} className="anim-fade-up rounded-xl border border-tinta/10 p-2" style={{ animationDelay: `${i * 150}ms` }}>
              <div className="flex gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo(it.img, 120, 120)} alt="" className="h-10 w-10 rounded-lg object-cover" style={vivid} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[9px] font-semibold">{it.n}</p>
                  <p className="text-[7px] text-tinta-70">{it.c}</p>
                  <p className="text-[9px] font-bold text-rosa">{it.p}</p>
                </div>
                <span className="flex items-start gap-0.5 text-[7px] text-tinta-70">
                  <Heart className="h-2.5 w-2.5 fill-rosa text-rosa" /> {it.l}
                </span>
              </div>
              <div className="mt-1.5 flex justify-between text-[7px]">
                <span className="text-tinta-70">Ver vista previa</span>
                <span className="rounded-md border border-tinta/15 px-2 py-0.5">Editar ✎</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Keyboard() {
  const rows = ["qwertyuiop", "asdfghjklñ", "zxcvbnm"];
  return (
    <div className="absolute inset-x-0 bottom-0 z-20 bg-[#d3d6dd] px-1 pb-8 pt-1.5">
      {rows.map((r, i) => (
        <div key={r} className="mb-1 flex justify-center gap-[3px]" style={{ paddingInline: i * 6 }}>
          {r.split("").map((k) => (
            <span key={k} className="flex h-[22px] flex-1 items-center justify-center rounded-[4px] bg-white text-[9px] shadow-sm">
              {k}
            </span>
          ))}
        </div>
      ))}
      <div className="flex gap-[3px] px-1">
        <span className="flex h-[22px] w-10 items-center justify-center rounded-[4px] bg-[#aeb3be] text-[8px]">123</span>
        <span className="flex h-[22px] flex-1 items-center justify-center rounded-[4px] bg-white text-[8px]">espacio</span>
        <span className="flex h-[22px] w-12 items-center justify-center rounded-[4px] bg-rosa text-[8px] text-white">listo</span>
      </div>
    </div>
  );
}

function FormScene() {
  const name = useTyping("Tacos al pastor (3)", true, 70, 400);
  const desc = useTyping("Con piña, cebolla y cilantro.", name.length >= 19, 45, 200);
  const field = "mt-0.5 rounded-lg border px-2 py-1.5 text-[9px]";
  return (
    <div className="h-full bg-white px-3 pt-9">
      <p className="flex items-center justify-between text-[11px] font-semibold">
        Nuevo platillo <span className="text-tinta-70">✕</span>
      </p>
      <div className="mt-3 space-y-2 text-[8px] font-medium">
        <div>
          Nombre del platillo *
          <p className={`${field} border-rosa`}>
            {name}
            <span className="ml-px inline-block h-2.5 w-px animate-pulse bg-rosa align-middle" />
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            Precio *<p className={`${field} border-tinta/15`}>$ {name.length > 8 ? "89" : "0.00"}</p>
          </div>
          <div>
            Categoría *<p className={`${field} border-tinta/15`}>Mexicano ▾</p>
          </div>
        </div>
        <div>
          Descripción
          <p className={`${field} min-h-[30px] border-tinta/15 text-tinta-70`}>{desc}</p>
        </div>
        <div>
          Foto o video
          <div className="mt-0.5 flex gap-2">
            <span className="rounded-lg border border-dashed border-rosa px-3 py-2 text-[8px] text-rosa">+ Foto</span>
            <span className="rounded-lg border border-dashed border-tinta/20 px-3 py-2 text-[8px] text-tinta-70">+ Video</span>
          </div>
        </div>
      </div>
      <Keyboard />
    </div>
  );
}

function FeedScene() {
  const slides = [
    { img: PHOTOS.tacos, n: "Tacos al pastor (3)", d: "Con piña, cebolla y cilantro.", p: "$89", tag: "Picante" },
    { img: PHOTOS.steak, n: "Corte al fuego", d: "Corte a la parrilla con cebollitas.", p: "$289" },
    { img: PHOTOS.pizzaBoard, n: "Pizza margarita", d: "Mozzarella fresca y albahaca.", p: "$189" },
  ];
  return (
    <div className="relative h-full overflow-hidden bg-black">
      <div className="feed-scroll absolute inset-x-0 top-0 h-[300%]">
        {slides.map((s) => (
          <div key={s.n} className="relative h-1/3 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo(s.img, 600, 1300)} alt={s.n} className="kb-hero h-full w-full object-cover" style={vivid} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/40" />
            <div className="absolute inset-x-0 bottom-0 px-3 pb-7 pr-9 text-white">
              {s.tag && <span className="mb-1 inline-block rounded-full bg-red-600 px-2 py-0.5 text-[8px] font-bold uppercase">🌶 {s.tag}</span>}
              <div className="flex items-center gap-1.5">
                <span className="rounded-full bg-rosa px-2 py-0.5 text-[10px] font-bold">{s.p}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 text-[9px]">
                  Agregar <ShoppingCart className="h-2.5 w-2.5" />
                </span>
              </div>
              <p className="mt-1 text-[15px] font-bold leading-tight">{s.n}</p>
              <p className="text-[9.5px] text-white/75">{s.d}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 top-9 z-10 px-2.5">
        <div className="flex gap-1.5 text-[9px] font-semibold">
          {["Principales", "Mexicano", "Pizzas", "Bebidas"].map((c, n) => (
            <span key={c} className={`shrink-0 rounded-full px-2.5 py-1 ${n === 1 ? "bg-white text-tinta" : "bg-black/40 text-white backdrop-blur"}`}>
              {c}
            </span>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between text-white">
          <span className="rounded-full bg-black/40 p-1.5">
            <LayoutGrid className="h-3 w-3" />
          </span>
          <span className="flex items-center gap-1">
            <span className="flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 text-[8px] font-semibold">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sol" /> Juega y gana
            </span>
            <span className="rounded-full bg-black/40 p-1.5">
              <Menu className="h-3 w-3" />
            </span>
          </span>
        </div>
      </div>
      <div className="absolute bottom-32 right-2 z-10 flex flex-col items-center gap-3 text-white">
        <Heart className="h-5 w-5" />
        <MessageCircle className="h-5 w-5" />
        <Share2 className="h-5 w-5" />
      </div>
    </div>
  );
}

function MapsScene() {
  return (
    <div className="relative h-full bg-[#eef1f4]">
      <svg viewBox="0 0 280 600" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <rect width="280" height="600" fill="#e8ecf1" />
        <rect x="128" y="110" width="56" height="80" rx="6" fill="#cfe8c8" />
        <rect x="16" y="430" width="80" height="60" rx="6" fill="#cfe8c8" />
        <rect x="200" y="420" width="70" height="90" rx="6" fill="#d6e4f5" />
        {["M-20 120 L300 60", "M-20 260 L300 230", "M-20 420 L300 380", "M60 -20 L110 620", "M190 -20 L230 620", "M-20 540 L300 520"].map((d) => (
          <g key={d}>
            <path d={d} stroke="#d3d9e0" strokeWidth="16" fill="none" />
            <path d={d} stroke="#ffffff" strokeWidth="13" fill="none" />
          </g>
        ))}
        <path d="M-20 340 C80 300 160 360 300 300" stroke="#f3c969" strokeWidth="12" fill="none" />
        <path d="M-20 340 C80 300 160 360 300 300" stroke="#ffe3a3" strokeWidth="9" fill="none" />
        <circle cx="70" cy="190" r="5" fill="#8b9bb0" />
        <circle cx="220" cy="300" r="5" fill="#8b9bb0" />
        <text x="18" y="215" fontSize="9" fill="#7a8796">Av. Juárez</text>
        <text x="150" y="250" fontSize="9" fill="#7a8796">Calle Hidalgo</text>
      </svg>
      <div className="absolute inset-x-3 top-9 flex items-center gap-2 rounded-full bg-white px-3 py-2 text-[9px] text-tinta-70 shadow">
        <span>☰</span> Tacos Don Beto
      </div>
      <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-full">
        <MapPin className="anim-pop h-9 w-9 fill-red-500 text-white drop-shadow-lg" />
      </div>
      <div className="anim-fade-up absolute inset-x-3 bottom-14 rounded-2xl bg-white p-3 shadow-xl" style={{ animationDelay: "500ms" }}>
        <p className="text-[11px] font-semibold">Tacos Don Beto</p>
        <p className="flex items-center gap-1 text-[8.5px] text-tinta-70">
          4.8 <span className="text-sol">★★★★★</span> (126) · Taquería
        </p>
        <div className="mt-2 flex gap-1.5 text-[8px] font-semibold">
          <span className="rounded-full bg-[#1a73e8] px-2.5 py-1 text-white">Cómo llegar</span>
          <span className="rounded-full border border-tinta/15 px-2.5 py-1 text-[#1a73e8]">Opiniones</span>
        </div>
      </div>
    </div>
  );
}

function ReviewScene() {
  const [stars, setStars] = useState(0);
  useEffect(() => {
    const ts = [1, 2, 3, 4, 5].map((n) => setTimeout(() => setStars(n), 250 + n * 220));
    return () => ts.forEach(clearTimeout);
  }, []);
  const text = useTyping("Muy rica la comida, la atención de 10.", stars === 5, 50, 300);
  return (
    <div className="h-full bg-white px-3 pt-9">
      <p className="flex items-center justify-between text-[11px] font-semibold">
        <span>✕</span> Tacos Don Beto <span />
      </p>
      <div className="mt-3 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#7b5cd6] text-[10px] font-bold text-white">M</span>
        <div>
          <p className="text-[9px] font-semibold">Mariana</p>
          <p className="text-[7.5px] text-tinta-70">Se mostrará públicamente en Google</p>
        </div>
      </div>
      <div className="mt-3 flex justify-between px-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} className={`h-6 w-6 transition-all duration-300 ${n <= stars ? "scale-110 fill-sol text-sol" : "text-tinta/25"}`} />
        ))}
      </div>
      <div className="mt-3 min-h-[54px] rounded-lg border border-[#1a73e8] p-2 text-[9px]">
        {text}
        <span className="ml-px inline-block h-2.5 w-px animate-pulse bg-[#1a73e8] align-middle" />
      </div>
      <p className="mt-2 rounded-full bg-[#e8f0fe] py-1.5 text-center text-[8px] font-semibold text-[#1a73e8]">Agregar fotos y videos</p>
      <p className="mt-2 rounded-full bg-[#1a73e8] py-2 text-center text-[9px] font-semibold text-white">Publicar</p>
      <Keyboard />
    </div>
  );
}

function MetricsScene() {
  const d = "M0 70 L12 60 L22 66 L32 30 L42 58 L52 64 L62 18 L72 56 L82 62 L92 26 L102 60 L112 52 L122 12 L132 58 L142 62 L152 34 L162 60 L172 66 L182 22 L192 56 L200 60";
  return (
    <div className="h-full bg-white">
      <PanelTop active="metricas" />
      <div className="px-3">
        <p className="mt-3 text-[11px] font-semibold">Tráfico de la carta</p>
        <p className="text-[7.5px] text-tinta-70">Visitas a tu carta a lo largo del tiempo y horas de más demanda.</p>
        <svg viewBox="0 0 200 80" className="mt-2 w-full">
          <path d={`${d} L200 80 L0 80 Z`} fill="#e6007e" fillOpacity="0.12" className="anim-fade" />
          <path d={d} fill="none" stroke="#e6007e" strokeWidth="1.5" className="draw-line" />
        </svg>
        <div className="flex justify-between text-[6.5px] text-tinta-70">
          <span>1 nov</span>
          <span>8 nov</span>
          <span>15 nov</span>
          <span>22 nov</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="anim-fade-up rounded-xl border border-tinta/10 p-2" style={{ animationDelay: "400ms" }}>
            <p className="flex items-center gap-1 text-[8.5px] font-semibold">
              <Eye className="h-2.5 w-2.5 text-rosa" /> Visitas del día
            </p>
            <p className="mt-1 text-lg font-semibold">48</p>
          </div>
          <div className="anim-fade-up rounded-xl border border-tinta/10 p-2" style={{ animationDelay: "550ms" }}>
            <p className="flex items-center gap-1 text-[8.5px] font-semibold">
              <Clock className="h-2.5 w-2.5 text-rosa" /> Hora pico
            </p>
            <p className="mt-1 text-lg font-semibold text-rosa">
              21:00 <span className="text-[8px]">h</span>
            </p>
          </div>
        </div>
        <div className="anim-fade-up mt-2 rounded-xl border border-tinta/10 p-2" style={{ animationDelay: "700ms" }}>
          <p className="flex items-center gap-1 text-[8.5px] font-semibold">
            <Trophy className="h-2.5 w-2.5 text-sol" /> Platillos más vistos
          </p>
          {[
            ["Tacos de asada", 402],
            ["Corte al fuego", 340],
            ["Burger Antojo", 187],
          ].map(([n, v], i) => (
            <p key={n} className="mt-1 flex justify-between text-[8px]">
              <span>
                <span className="text-tinta-70">#{i + 1}</span> {n}
              </span>
              <span className="text-rosa">♥ {v}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
