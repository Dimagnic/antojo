"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  Clock,
  Eye,
  Gift,
  Heart,
  MessageCircle,
  QrCode,
  RefreshCw,
  Share2,
  ShoppingCart,
  Star,
  Trophy,
  UtensilsCrossed,
} from "lucide-react";
import { PHOTOS, photo } from "@/lib/site";
import { FlagMX, FlagUS } from "@/components/Flags";

const img = (id: string, w = 800, h?: number) => photo(id, w, h);
const vivid = { filter: "saturate(1.12) contrast(1.05) brightness(1.03)" } as const;

/** Se activa una vez cuando el bloque entra en pantalla. */
function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setInView(true), io.disconnect()), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, inView };
}

function useCountUp(target: number, active: boolean, ms = 1400) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / ms);
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, ms]);
  return v;
}

/* 1 · De PDF a carta tipo TikTok */
export function MenuToPhoneMock() {
  return (
    <div className="mt-8 flex items-end justify-center gap-4">
      <div className="relative w-[120px] rotate-[-4deg]">
        <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-2.5 py-0.5 text-[10px] font-medium text-tinta shadow">
          Carta en PDF
        </span>
        <div className="rounded-2xl bg-white p-3 text-[7px] leading-[1.6] text-tinta shadow-xl">
          <p className="mb-1 text-center text-[9px] font-bold tracking-widest">MENÚ</p>
          {["Entradas", "Platos fuertes", "Bebidas"].map((s) => (
            <div key={s} className="mb-1.5">
              <p className="font-bold">{s}</p>
              <p className="flex justify-between text-tinta-70">
                <span>Platillo 1</span>
                <span>$95</span>
              </p>
              <p className="flex justify-between text-tinta-70">
                <span>Platillo 2</span>
                <span>$120</span>
              </p>
            </div>
          ))}
        </div>
      </div>
      <ArrowRight className="mb-20 h-7 w-7 shrink-0 text-rosa" />
      <div className="relative w-[140px] overflow-hidden rounded-[1.6rem] bg-black p-1.5 shadow-2xl ring-1 ring-white/10">
        <div className="relative aspect-[9/17] overflow-hidden rounded-[1.25rem]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img(PHOTOS.burgerDouble, 400, 760)} alt="Hamburguesa doble" className="kb-hero h-full w-full object-cover" style={vivid} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
          <div className="absolute left-1.5 top-1.5 flex gap-1 text-[6px] font-semibold">
            <span className="rounded-full bg-rosa px-1.5 py-0.5 text-white">Principales</span>
            <span className="rounded-full bg-black/40 px-1.5 py-0.5 text-white">Bebidas</span>
          </div>
          <div className="absolute right-1.5 top-1/2 flex flex-col gap-1.5 text-white">
            <Heart className="h-3 w-3" />
            <MessageCircle className="h-3 w-3" />
            <Share2 className="h-3 w-3" />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-2 text-white">
            <span className="rounded-full bg-rosa px-1.5 py-0.5 text-[7px] font-bold">$199</span>
            <p className="mt-1 text-[9px] font-bold">Doble cheddar</p>
            <p className="text-[6.5px] text-white/70">Doble carne y queso fundido.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 2 · Invitación a reseñar */
export function ReviewMock() {
  return (
    <div className="relative mt-8 overflow-hidden rounded-2xl bg-black shadow-2xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img(PHOTOS.sushi, 900, 560)} alt="Sushi" className="h-64 w-full object-cover opacity-60 sm:h-72" style={vivid} />
      <div className="absolute left-3 top-3 rounded-full bg-black/50 px-3 py-1 text-[11px] font-medium text-white">Principales</div>
      <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 rounded-2xl bg-[#140c22]/90 p-4 text-center text-white ring-1 ring-white/10 backdrop-blur-md">
        <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-sol/25">
          <Star className="h-5 w-5 fill-sol text-sol" />
        </div>
        <p className="mt-2 text-[15px] font-semibold">¿Qué tal tu experiencia?</p>
        <p className="mx-auto mt-1 max-w-[240px] text-[11px] text-white/70">Tu opinión en Google Maps nos ayuda muchísimo.</p>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[11px] font-semibold text-tinta">
          Dejar reseña en Google Maps <span className="text-red-500">📍</span>
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4 text-white/80">
        <span className="rounded-full bg-rosa/80 px-2 py-0.5 text-[10px] font-bold">$169</span>
        <p className="mt-1 text-sm font-semibold">Roll de salmón y aguacate</p>
      </div>
    </div>
  );
}

/* 3 · Datos del negocio */
export function StatsMock() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const v = useCountUp(97, inView);
  return (
    <div ref={ref} className="mt-6">
      <div className="border-t border-tinta/10 pt-6">
        <Eye className="h-5 w-5 text-rosa" />
        <p className="mt-3 text-[13px] text-tinta-70">Visitas de hoy</p>
        <p className="text-[44px] font-medium leading-tight tracking-tight">{v} visitas</p>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <Clock className="h-5 w-5 text-rosa" />
          <p className="mt-3 text-[13px] text-tinta-70">Hora pico</p>
          <p className="text-2xl font-medium">21:00 h</p>
        </div>
        <div>
          <UtensilsCrossed className="h-5 w-5 text-rosa" />
          <p className="mt-3 text-[13px] text-tinta-70">Más visto</p>
          <p className="text-2xl font-medium">Tacos</p>
        </div>
      </div>
      <p className="mt-4 text-[11px] text-tinta-70/70">Datos de ejemplo</p>
    </div>
  );
}

/* 4 · Cambio de precio sin reimprimir */
export function PriceMock() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [price, setPrice] = useState(169);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    if (!inView) return;
    const a = setTimeout(() => setPrice(189), 900);
    const b = setTimeout(() => setSaved(true), 1500);
    return () => (clearTimeout(a), clearTimeout(b));
  }, [inView]);
  return (
    <div ref={ref} className="mt-8 overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_-20px_rgba(27,17,48,0.35)] ring-1 ring-tinta/5">
      <div className="p-5">
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-tinta-70">Precio actualizado</span>
          <span className={`flex items-center gap-1 text-emerald-600 transition-opacity duration-500 ${saved ? "opacity-100" : "opacity-0"}`}>
            <Check className="h-4 w-4" /> Guardado
          </span>
        </div>
        <p className="mt-2 text-3xl font-medium tabular-nums transition-all">${price}</p>
      </div>
      <div className="flex items-center justify-between border-t border-tinta/5 bg-crema/60 px-5 py-3.5 text-[13px] text-tinta-70">
        <span className="flex items-center gap-2">
          <QrCode className="h-4 w-4" /> Mismo QR en la mesa
        </span>
        <RefreshCw className={`h-4 w-4 ${saved ? "" : "animate-spin"}`} />
      </div>
    </div>
  );
}

/* 5 · Carta en inglés */
export function LanguageMock() {
  const [en, setEn] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setEn((v) => !v), 2800);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="mt-8 rounded-2xl bg-white p-4 shadow-[0_12px_40px_-20px_rgba(27,17,48,0.35)] ring-1 ring-tinta/5">
      <div className="inline-flex rounded-full bg-crema p-1 text-[13px] font-semibold">
        <span className={`rounded-full px-3.5 py-1.5 transition ${!en ? "bg-white shadow" : "text-tinta-70"}`}><FlagMX className="mr-1.5 inline h-3 w-4 align-[-1px]" />Español</span>
        <span className={`rounded-full px-3.5 py-1.5 transition ${en ? "bg-white shadow" : "text-tinta-70"}`}><FlagUS className="mr-1.5 inline h-3 w-4 align-[-1px]" />English</span>
      </div>
      <div className="mt-4 flex gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img(PHOTOS.pizzaBoard, 240, 320)} alt="Pizza" className="h-28 w-20 shrink-0 rounded-xl object-cover" style={vivid} />
        <div key={String(en)} className="anim-fade-up">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-tinta-70">{en ? "Artisan pizzas" : "Pizzas artesanales"}</p>
          <p className="mt-1 text-[17px] font-semibold">{en ? "Margherita pizza" : "Pizza margarita"}</p>
          <p className="mt-1 text-[13px] leading-snug text-tinta-70">
            {en ? "Slow-fermented dough, fresh mozzarella and basil." : "Masa de fermentación lenta, mozzarella fresca y albahaca."}
          </p>
        </div>
      </div>
    </div>
  );
}

/* 6 · Puntos de lealtad */
export function PointsMock() {
  return (
    <div className="mt-8 space-y-3 rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/10">
      <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-sol to-[#ff8a00] text-lg font-extrabold text-tinta ring-4 ring-sol/20">
          ★
        </span>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-white/60">Saldo de puntos</p>
          <p className="text-2xl font-semibold">150 PTS</p>
          <span className="mt-1 inline-block rounded-md bg-rosa/20 px-2 py-0.5 text-[11px] font-semibold text-rosa-100">Canjea tus puntos por premios</span>
        </div>
      </div>
      <div className="rounded-xl bg-white/[0.04] p-4">
        <div className="flex items-center gap-3">
          <Gift className="h-6 w-6 text-sol" />
          <div>
            <p className="text-[11px] text-white/60">Próximo premio</p>
            <p className="text-lg font-semibold">Café de regalo</p>
          </div>
        </div>
        <div className="mt-3 h-1.5 rounded-full bg-white/10">
          <div className="grow-bar h-1.5 w-[83%] rounded-full bg-gradient-to-r from-rosa to-sol" />
        </div>
        <p className="mt-2 text-right text-[11px] text-white/70">Te faltan 30 PTS</p>
      </div>
    </div>
  );
}

/* 7 · Ruleta de premios girando */
export function WheelMock() {
  const icons = ["🎁", "⭐", "☕", "🍩", "🎟️", "🍺", "⭐", "🌮"];
  return (
    <div className="mt-8">
      <div className="relative mx-auto aspect-square w-full max-w-[300px]">
        <span className="absolute left-1/2 top-[-6px] z-10 -translate-x-1/2 text-3xl drop-shadow">▼</span>
        <div className="spin-slow h-full w-full rounded-full p-2 ring-8 ring-white/5" style={{ background: "conic-gradient(#e6007e 0 45deg,#2a1d3d 45deg 90deg,#ff4fa8 90deg 135deg,#2a1d3d 135deg 180deg,#c4006b 180deg 225deg,#2a1d3d 225deg 270deg,#ffb800 270deg 315deg,#2a1d3d 315deg 360deg)" }}>
          {icons.map((ic, n) => (
            <span
              key={n}
              className="absolute left-1/2 top-1/2 text-2xl"
              style={{ transform: `rotate(${n * 45 + 22.5}deg) translateY(-105px) rotate(-${n * 45 + 22.5}deg) translate(-50%, -50%)` }}
            >
              {ic}
            </span>
          ))}
        </div>
        <div className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-[#150d24] ring-4 ring-rosa">
          <Gift className="h-6 w-6 text-sol" />
          <span className="mt-0.5 text-[8px] font-bold uppercase tracking-wider">Tu premio</span>
        </div>
      </div>
      <div className="mt-6 flex items-center gap-4 rounded-2xl bg-white/[0.05] p-4 ring-1 ring-white/10">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
          <Trophy className="h-5 w-5 text-sol" />
        </span>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">¡Ganaste un premio!</p>
          <p className="text-xl font-bold">20% de descuento</p>
          <p className="text-[12px] text-white/60">En tu próxima visita</p>
        </div>
      </div>
    </div>
  );
}

/* 8 · Promociones por correo + notificación en el celular */
export function MailMock() {
  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-2xl bg-white p-4 shadow-[0_12px_40px_-20px_rgba(27,17,48,0.35)] ring-1 ring-tinta/5">
        <p className="text-[14px] font-medium">Te guardamos una mesa y 20% de descuento</p>
        <div className="mt-2 flex items-center gap-2 text-[11px] text-tinta-70">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rosa-50 font-semibold text-rosa">T</span>
          <span>
            <b className="text-tinta">Tacos Don Beto</b> &lt;hola@tu-negocio.mx&gt;
          </span>
          <span className="ml-auto">12:30</span>
        </div>
        <div className="mt-3 overflow-hidden rounded-xl bg-crema text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img(PHOTOS.tacos, 700, 300)} alt="Tacos" className="h-32 w-full object-cover" style={vivid} />
          <div className="p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-rosa">Una invitación para volver</p>
            <p className="mt-1 font-serif text-2xl leading-tight">Tus tacos favoritos, con 20% menos.</p>
            <span className="mt-3 inline-block rounded-lg bg-tinta px-4 py-2 text-[12px] font-semibold text-white">Ver la carta</span>
          </div>
        </div>
      </div>
      <div className="relative mx-auto w-[220px] overflow-hidden rounded-[2.2rem] bg-black p-2 shadow-2xl">
        <div className="relative aspect-[9/12] overflow-hidden rounded-[1.8rem] bg-gradient-to-br from-[#cdd8ef] via-[#e9eef8] to-[#b9c6e4] text-center">
          <p className="pt-7 text-[11px] text-tinta-70">Martes 27 de octubre</p>
          <p className="text-5xl font-light tracking-tight text-tinta">12:30</p>
          <div className="notif absolute inset-x-2.5 top-[112px] rounded-2xl bg-white/90 p-2.5 text-left shadow-lg backdrop-blur">
            <p className="flex justify-between text-[9px] text-tinta-70">
              <span>✉️ Correo</span>
              <span>ahora</span>
            </p>
            <p className="text-[10px] font-semibold">Tacos Don Beto</p>
            <p className="text-[10px]">Tus tacos favoritos, con 20% menos</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 9 · Carrito que llega por WhatsApp */
export function CartMock() {
  const rows = [
    ["2×", "Tacos de asada (3)", "$178"],
    ["1×", "Agua de horchata", "$35"],
  ];
  return (
    <div className="mt-8 rounded-2xl bg-white p-5 shadow-[0_12px_40px_-20px_rgba(27,17,48,0.35)] ring-1 ring-tinta/5">
      {rows.map(([q, n, p]) => (
        <div key={n} className="flex items-center justify-between border-b border-tinta/5 py-3 text-[14px]">
          <span>
            <span className="text-tinta-70">{q}</span> {n}
          </span>
          <span>{p}</span>
        </div>
      ))}
      <div className="flex items-center justify-between py-4">
        <span className="text-[13px] text-tinta-70">Total del pedido</span>
        <span className="text-xl font-medium">$213</span>
      </div>
      <div className="flex items-center justify-center gap-2 rounded-xl bg-[#1f7a4d] py-3 text-[13px] font-semibold text-white">
        <ShoppingCart className="h-4 w-4" /> Enviar pedido por WhatsApp
      </div>
    </div>
  );
}
