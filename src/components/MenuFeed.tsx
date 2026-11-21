"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ChevronRight,
  Flame,
  Heart,
  LayoutGrid,
  Menu,
  MessageCircle,
  Minus,
  Plus,
  Share2,
  ShoppingCart,
  Star,
  Ticket,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Category, Product } from "@/lib/types";
import { formatMoney } from "@/lib/utils";
import { getDict, type Dict, type Lang } from "./menu/i18n";
import { Wheel } from "./menu/Wheel";

type MenuRestaurant = {
  id: string;
  name: string;
  whatsapp: string | null;
  currency: string;
  logo_url: string | null;
  is_open: boolean;
  review: string | null;
  instagram: string | null;
  game: boolean;
};

type EventType = "visit" | "view" | "add_cart" | "whatsapp_order" | "review_click" | "spin" | "share" | "comment";
type Points = { total: number; lastSpin: string | null; history: { date: string; pts: number }[] };

const REVIEW_DELAY_MS = 25000;
const today = () => new Date().toLocaleDateString("en-CA");

function load<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function MenuFeed({
  restaurant,
  categories,
  products,
}: {
  restaurant: MenuRestaurant;
  categories: Category[];
  products: Product[];
}) {
  const supabase = useMemo(() => createClient(), []);
  const feedRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);
  const seen = useRef(new Set<string>());
  const swipes = useRef(0);
  const firstVisit = useRef<boolean | null>(null);

  const [lang, setLang] = useState<Lang>("es");
  const t = getDict(lang);
  const [splash, setSplash] = useState(true);
  const [active, setActive] = useState<string | null>(null);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [hint, setHint] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [liked, setLiked] = useState<Record<string, number>>({});
  const [panel, setPanel] = useState<null | "menu" | "grid" | "wheel" | "points" | "cart" | "review">(null);
  const [points, setPoints] = useState<Points>({ total: 0, lastSpin: null, history: [] });

  const ptsKey = `antojo:pts:${restaurant.id}`;

  const ordered = useMemo(() => {
    const byCat = categories.flatMap((c) => products.filter((p) => p.category_id === c.id));
    const rest = products.filter((p) => !categories.some((c) => c.id === p.category_id));
    return [...byCat, ...rest];
  }, [categories, products]);

  const track = useCallback(
    (type: EventType, productId?: string) => {
      supabase.from("events").insert({ restaurant_id: restaurant.id, type, product_id: productId ?? null }).then(() => {});
    },
    [supabase, restaurant.id],
  );

  // Arranque: idioma, puntos, visita y pantalla de entrada
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- leer localStorage solo es posible en el cliente */
    setLang(load<Lang>("antojo:lang", "es"));
    setPoints(load<Points>(ptsKey, { total: 0, lastSpin: null, history: [] }));
    /* eslint-enable react-hooks/set-state-in-effect */
    if (firstVisit.current === null) {
      try {
        const k = `antojo:visit:${restaurant.id}`;
        firstVisit.current = !sessionStorage.getItem(k);
        if (firstVisit.current) {
          sessionStorage.setItem(k, "1");
          track("visit");
        }
      } catch {
        firstVisit.current = true;
        track("visit");
      }
    }
    const timer = setTimeout(() => setSplash(false), firstVisit.current ? 1700 : 300);
    return () => clearTimeout(timer);
  }, [restaurant.id, ptsKey, track]);

  // Invitación a reseñar
  const showReview = useCallback(() => {
    if (!restaurant.review) return;
    try {
      const k = `antojo:review:${restaurant.id}`;
      if (sessionStorage.getItem(k)) return;
      sessionStorage.setItem(k, "1");
    } catch {}
    setPanel((p) => p ?? "review");
  }, [restaurant.id, restaurant.review]);

  useEffect(() => {
    const timer = setTimeout(showReview, REVIEW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [showReview]);

  // Slide activo: video, vistas, categoría
  useEffect(() => {
    const root = feedRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement;
          const video = el.querySelector("video");
          if (e.isIntersecting) {
            video?.play().catch(() => {});
            const id = el.dataset.id!;
            setActive(id);
            setActiveCat(el.dataset.cat || null);
            if (!seen.current.has(id)) {
              seen.current.add(id);
              track("view", id);
            }
          } else video?.pause();
        }
      },
      { root, threshold: 0.6 },
    );
    root.querySelectorAll("[data-slide]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ordered, track]);

  // Pista "desliza" en cada platillo hasta que el usuario ya sepa deslizar
  useEffect(() => {
    if (!active || splash || ordered.length < 2) return;
    swipes.current += 1;
    if (swipes.current > 3) return;
    const show = setTimeout(() => setHint(true), 900);
    const hide = setTimeout(() => setHint(false), 3800);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
      setHint(false);
    };
  }, [active, splash, ordered.length]);

  // Mantener visible la pastilla de la categoría activa
  useEffect(() => {
    if (!activeCat) return;
    pillsRef.current?.querySelector(`[data-pill="${activeCat}"]`)?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeCat]);

  function goTo(selector: string) {
    feedRef.current?.querySelector(selector)?.scrollIntoView({ behavior: "smooth" });
  }

  function add(p: Product, delta = 1) {
    setCart((c) => {
      const n = Math.max(0, (c[p.id] ?? 0) + delta);
      const next = { ...c, [p.id]: n };
      if (!n) delete next[p.id];
      return next;
    });
    if (delta > 0) track("add_cart", p.id);
  }

  async function like(p: Product) {
    if (liked[p.id] !== undefined) return;
    setLiked((l) => ({ ...l, [p.id]: p.likes + 1 }));
    const { data } = await supabase.rpc("like_product", { p_id: p.id });
    if (typeof data === "number") setLiked((l) => ({ ...l, [p.id]: data }));
  }

  function share(p: Product) {
    track("share", p.id);
    const url = window.location.href.split("#")[0];
    const text = `${t.look} ${p.name} ${t.at} ${restaurant.name}`;
    if (navigator.share) navigator.share({ title: restaurant.name, text, url }).catch(() => {});
    else navigator.clipboard.writeText(url);
  }

  function comment(p: Product) {
    track("comment", p.id);
    if (restaurant.whatsapp) {
      const msg = encodeURIComponent(`${t.hello} ${restaurant.name}, ${t.ask} "${p.name}"`);
      window.open(`https://wa.me/${restaurant.whatsapp}?text=${msg}`, "_blank");
    } else if (restaurant.review) setPanel("review");
  }

  function changeLang(l: Lang) {
    setLang(l);
    save("antojo:lang", l);
  }

  function onSpinResult(pts: number) {
    track("spin");
    setPoints((prev) => {
      const next: Points = {
        total: prev.total + pts,
        lastSpin: today(),
        history: [{ date: today(), pts }, ...prev.history].slice(0, 30),
      };
      save(ptsKey, next);
      return next;
    });
  }

  const items = ordered.filter((p) => cart[p.id]);
  const count = items.reduce((s, p) => s + cart[p.id], 0);
  const total = items.reduce((s, p) => s + cart[p.id] * p.price, 0);
  const money = (n: number) => formatMoney(n, restaurant.currency);
  const canSpin = points.lastSpin !== today();

  return (
    <div className="flex h-[100dvh] justify-center bg-black">
      <div className="relative h-full w-full max-w-[460px] overflow-hidden bg-black text-white">
        {/* ── Pantalla de entrada ── */}
        <div
          className={`absolute inset-0 z-[60] flex flex-col items-center justify-center bg-white transition-opacity duration-500 ${
            splash ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          {restaurant.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={restaurant.logo_url} alt="" className="anim-pop mb-5 h-20 w-20 rounded-full object-cover shadow-lg" />
          ) : null}
          <p className="anim-fade-up text-lg text-tinta" style={{ animationDelay: "150ms" }}>
            {t.madeWith}
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/antojo-logo.svg" alt="antojo" className="anim-pop mt-2 h-14 w-auto" style={{ animationDelay: "300ms" }} />
        </div>

        {/* ── Barra superior ── */}
        <div className="absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-black/60 via-black/25 to-transparent pb-10 pt-3">
          {categories.length > 0 && (
            <div ref={pillsRef} className="no-scrollbar flex gap-2 overflow-x-auto px-3">
              {categories.map((c) => (
                <button
                  key={c.id}
                  data-pill={c.id}
                  onClick={() => goTo(`[data-cat="${c.id}"]`)}
                  className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-bold transition-all duration-300 ${
                    activeCat === c.id ? "scale-105 bg-white text-tinta shadow-lg" : "bg-black/40 text-white backdrop-blur-md"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}
          <div className="mt-3 flex items-center justify-between px-3">
            <IconButton label="Vista en cuadrícula" onClick={() => setPanel("grid")}>
              <LayoutGrid className="h-5 w-5" />
            </IconButton>
            <div className="flex items-center gap-2">
              {restaurant.game && (
                <button
                  onClick={() => setPanel("wheel")}
                  className="flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-2 text-[13px] font-bold backdrop-blur-md transition active:scale-95"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sol opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-sol" />
                  </span>
                  <Ticket className="h-4 w-4" /> {t.play}
                </button>
              )}
              <IconButton label="Menú" onClick={() => setPanel("menu")}>
                <Menu className="h-5 w-5" />
              </IconButton>
            </div>
          </div>
          {!restaurant.is_open && (
            <p className="anim-fade-up mx-3 mt-3 rounded-xl bg-sol px-3 py-1.5 text-center text-sm font-semibold text-tinta">{t.closed}</p>
          )}
        </div>

        {/* ── Pista para deslizar ── */}
        <div
          className={`pointer-events-none absolute left-1/2 top-[44%] z-20 -translate-x-1/2 transition-all duration-500 ${
            hint ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          <span className="flex items-center gap-2 whitespace-nowrap rounded-full bg-black/55 px-4 py-2.5 text-[13px] font-semibold backdrop-blur-md">
            {t.swipe} <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
          </span>
        </div>

        {/* ── Feed vertical ── */}
        <div ref={feedRef} className="no-scrollbar h-full snap-y snap-mandatory overflow-y-scroll">
          {ordered.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center p-10 text-center">
              <span className="text-6xl">🍽️</span>
              <p className="mt-4 text-xl font-bold">{t.cooking}</p>
              <p className="mt-1 text-white/70">{t.soon}</p>
            </div>
          )}
          {ordered.map((p, i) => {
            const isActive = active === p.id;
            return (
              <section
                key={p.id}
                data-slide
                data-id={p.id}
                data-cat={p.category_id ?? ""}
                data-active={isActive}
                className="slide relative h-full w-full snap-start snap-always overflow-hidden"
              >
                <div className="media absolute inset-0">
                  {p.media_url ? (
                    p.media_type === "video" ? (
                      <video src={p.media_url} muted loop playsInline preload={i < 2 ? "auto" : "metadata"} className="h-full w-full object-cover" />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.media_url} alt={p.name} loading={i < 2 ? "eager" : "lazy"} className="h-full w-full object-cover" />
                    )
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-rosa-600 via-tinta to-black text-8xl">🍽️</div>
                  )}
                </div>
                <div className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-black/95 via-black/55 to-transparent" />

                {/* Acciones laterales */}
                <div className="absolute bottom-[30%] right-3 z-10 flex flex-col items-center gap-5">
                  <button onClick={() => like(p)} className="flex flex-col items-center transition active:scale-125" aria-label="Me gusta">
                    <Heart className={`h-7 w-7 drop-shadow-lg transition ${liked[p.id] !== undefined ? "scale-110 fill-rosa text-rosa" : ""}`} />
                    <span className="mt-0.5 text-xs font-bold drop-shadow">{liked[p.id] ?? p.likes}</span>
                  </button>
                  <button onClick={() => comment(p)} aria-label="Preguntar por este platillo" className="transition active:scale-110">
                    <MessageCircle className="h-7 w-7 drop-shadow-lg" />
                  </button>
                  <button onClick={() => share(p)} aria-label="Compartir" className="transition active:scale-110">
                    <Share2 className="h-7 w-7 drop-shadow-lg" />
                  </button>
                </div>

                {/* Info del platillo con entrada animada */}
                <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-9 pr-16">
                  {p.tags.length > 0 && (
                    <div className="anim mb-2.5 flex flex-wrap gap-1.5" style={{ animationDelay: "60ms" }}>
                      {p.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide ${
                            tag === "Picante" ? "bg-red-600" : "bg-white/20 backdrop-blur"
                          }`}
                        >
                          {tag === "Picante" && <Flame className="h-3.5 w-3.5" />}
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="anim flex items-center gap-2" style={{ animationDelay: "140ms" }}>
                    <span className="rounded-full bg-rosa px-4 py-1.5 text-base font-extrabold shadow-lg shadow-rosa/30">{money(p.price)}</span>
                    {p.is_available ? (
                      restaurant.whatsapp && (
                        <button
                          onClick={() => add(p)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-black/35 px-3.5 py-1.5 text-sm font-semibold backdrop-blur-md transition hover:bg-black/50 active:scale-95"
                        >
                          {cart[p.id] ? `${t.added} (${cart[p.id]})` : t.add} <ShoppingCart className="h-4 w-4" />
                        </button>
                      )
                    ) : (
                      <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold text-white/80">{t.soldOut}</span>
                    )}
                  </div>
                  <h2 className="anim mt-2.5 text-[28px] font-extrabold leading-[1.1] drop-shadow-lg" style={{ animationDelay: "220ms" }}>
                    {p.name}
                  </h2>
                  {p.description && (
                    <p className="anim mt-2 text-[15px] leading-relaxed text-white/85" style={{ animationDelay: "320ms" }}>
                      {p.description}
                    </p>
                  )}
                </div>
              </section>
            );
          })}
        </div>

        {/* Botón flotante del pedido */}
        {count > 0 && !panel && (
          <button
            onClick={() => setPanel("cart")}
            className="anim-fade-up absolute inset-x-4 bottom-4 z-30 flex items-center justify-between rounded-full bg-rosa px-5 py-3.5 font-bold shadow-xl shadow-black/40"
          >
            <span>
              {t.seeOrder} ({count})
            </span>
            <span>{money(total)}</span>
          </button>
        )}

        {/* ── Vista en cuadrícula ── */}
        {panel === "grid" && (
          <div className="anim-fade absolute inset-0 z-40 overflow-y-auto bg-black pt-28">
            <button onClick={() => setPanel(null)} className="absolute right-3 top-[62px] rounded-full bg-white/10 p-2.5" aria-label="Cerrar">
              <X className="h-5 w-5" />
            </button>
            <div className="grid grid-cols-2 gap-1 p-1">
              {ordered.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setPanel(null);
                    setTimeout(() => goTo(`[data-id="${p.id}"]`), 50);
                  }}
                  className="anim relative aspect-[3/4] overflow-hidden rounded-md bg-tinta text-left"
                  style={{ animationDelay: `${Math.min(i, 10) * 40}ms` }}
                >
                  {p.media_url ? (
                    p.media_type === "video" ? (
                      <video src={p.media_url} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.media_url} alt="" loading="lazy" className="h-full w-full object-cover" />
                    )
                  ) : (
                    <div className="flex h-full items-center justify-center text-5xl">🍽️</div>
                  )}
                  <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/90 to-transparent px-2 pb-2 pt-6 text-xs font-bold">
                    {p.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Menú lateral ── */}
        {panel === "menu" && (
          <div className="anim-fade absolute inset-0 z-40 flex flex-col bg-black/70 px-4 pb-4 pt-3 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setPanel("points")}
                className="flex items-center gap-2 rounded-full bg-white/10 py-1.5 pl-1.5 pr-3 font-bold ring-1 ring-white/15"
              >
                <Coin /> {t.myPoints}
                <span className="rounded-full bg-sol px-2 text-xs font-extrabold text-tinta">{points.total}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
              <button onClick={() => setPanel(null)} className="rounded-full p-2 hover:bg-white/10" aria-label="Cerrar">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-4 flex gap-2">
              <LangButton active={lang === "es"} onClick={() => changeLang("es")} flag={<FlagMX />} label="ES" />
              <LangButton active={lang === "en"} onClick={() => changeLang("en")} flag={<FlagUS />} label="EN" />
            </div>
            <nav className="no-scrollbar mt-4 flex-1 overflow-y-auto">
              {categories.length === 0 && <p className="px-3 py-3 text-white/70">{t.all}</p>}
              {categories.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setPanel(null);
                    setTimeout(() => goTo(`[data-cat="${c.id}"]`), 50);
                  }}
                  className={`anim block w-full rounded-xl px-4 py-3.5 text-left text-[17px] font-semibold transition ${
                    activeCat === c.id ? "bg-white/15" : "hover:bg-white/5"
                  }`}
                  style={{ animationDelay: `${i * 35}ms` }}
                >
                  {c.name}
                </button>
              ))}
            </nav>
            <div className="flex items-center justify-between border-t border-white/10 pt-3 text-sm">
              {restaurant.instagram ? (
                <a href={restaurant.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/90">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                    <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm5-3.2a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z" />
                  </svg>
                </a>
              ) : (
                <span />
              )}
              <Link href="/" className="text-white/70">
                {t.madeWith} <b className="text-white">anto</b>
                <b className="text-rosa">jo</b>
              </Link>
            </div>
          </div>
        )}

        {/* ── Ruleta ── */}
        {panel === "wheel" && (
          <Modal onClose={() => setPanel(null)}>
            <h3 className="text-center text-2xl font-extrabold">{t.wheel}</h3>
            <p className="mb-4 mt-1 text-center text-sm text-white/75">{t.wheelText}</p>
            <Wheel t={t} canSpin={canSpin} onResult={onSpinResult} />
            <button onClick={() => setPanel("points")} className="mt-3 flex w-full items-center justify-center gap-2 text-sm font-semibold text-white/80">
              <Coin small /> {t.myPoints}: {points.total} {t.pts}
            </button>
          </Modal>
        )}

        {/* ── Mis puntos ── */}
        {panel === "points" && (
          <Modal onClose={() => setPanel(null)}>
            <div className="flex flex-col items-center text-center">
              <Coin big />
              <h3 className="mt-3 text-2xl font-extrabold">{t.pointsTitle}</h3>
              <p className="anim-pop mt-2 text-5xl font-extrabold text-sol">{points.total}</p>
              <p className="text-sm text-white/60">{t.pts}</p>
              <p className="mt-3 text-sm text-white/80">{t.pointsText}</p>
              <p className="mt-1 text-xs text-white/50">{restaurant.name}</p>
            </div>
            <ul className="mt-4 max-h-40 space-y-1 overflow-y-auto text-sm">
              {points.history.length === 0 && <li className="text-center text-white/60">{t.noHistory}</li>}
              {points.history.map((h, i) => (
                <li key={i} className="flex justify-between rounded-lg bg-white/5 px-3 py-2">
                  <span className="text-white/70">{h.date}</span>
                  <span className={h.pts ? "font-bold text-sol" : "text-white/50"}>{h.pts ? `+${h.pts}` : t.keepPlaying}</span>
                </li>
              ))}
            </ul>
            {restaurant.game && (
              <button onClick={() => setPanel("wheel")} className="mt-4 w-full rounded-full bg-rosa py-3 font-bold">
                {t.play}
              </button>
            )}
          </Modal>
        )}

        {/* ── Reseña ── */}
        {panel === "review" && restaurant.review && (
          <Modal onClose={() => setPanel(null)} compact>
            <div className="flex flex-col items-center text-center">
              <div className="anim-pop flex h-14 w-14 items-center justify-center rounded-full bg-sol/20">
                <Star className="h-7 w-7 fill-sol text-sol" />
              </div>
              <h3 className="mt-3 text-xl font-extrabold">{t.reviewTitle}</h3>
              <p className="mt-1 text-sm text-white/75">{t.reviewText}</p>
              <a
                href={restaurant.review}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  track("review_click");
                  setPanel(null);
                }}
                className="mt-5 block w-full rounded-full bg-white py-3 font-bold text-tinta transition active:scale-95"
              >
                {t.reviewCta}
              </a>
            </div>
          </Modal>
        )}

        {/* ── Pedido ── */}
        {panel === "cart" && (
          <CartSheet
            t={t}
            items={items}
            cart={cart}
            money={money}
            total={total}
            restaurant={restaurant}
            onAdd={add}
            onClose={() => setPanel(null)}
            onSent={() => {
              track("whatsapp_order");
              setCart({});
              setPanel(null);
              setTimeout(showReview, 1500);
            }}
          />
        )}
      </div>
    </div>
  );
}

/* ───────────── Piezas pequeñas ───────────── */

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} aria-label={label} className="rounded-full bg-black/40 p-2.5 backdrop-blur-md transition active:scale-90">
      {children}
    </button>
  );
}

function Modal({ onClose, children, compact }: { onClose: () => void; children: React.ReactNode; compact?: boolean }) {
  return (
    <div className="anim-fade absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`anim-pop relative w-full rounded-3xl bg-[#140c22]/90 p-6 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl ${compact ? "max-w-xs" : "max-w-sm"}`}
      >
        <button onClick={onClose} className="absolute right-3 top-3 rounded-full bg-white/10 p-2 hover:bg-white/20" aria-label="Cerrar">
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  );
}

function Coin({ small, big }: { small?: boolean; big?: boolean }) {
  const s = big ? "h-14 w-14 text-2xl" : small ? "h-5 w-5 text-[10px]" : "h-7 w-7 text-xs";
  return (
    <span className={`inline-flex ${s} items-center justify-center rounded-full bg-gradient-to-br from-sol to-[#ff8a00] font-extrabold text-tinta ring-2 ring-[#ffd666]`}>
      ★
    </span>
  );
}

function LangButton({ active, onClick, flag, label }: { active: boolean; onClick: () => void; flag: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold transition ${active ? "bg-white text-tinta" : "text-white/80 hover:bg-white/10"}`}
    >
      {flag} {label}
    </button>
  );
}

function FlagMX() {
  return (
    <svg viewBox="0 0 30 20" className="h-3.5 w-5 overflow-hidden rounded-[2px]">
      <rect width="10" height="20" fill="#006847" />
      <rect x="10" width="10" height="20" fill="#fff" />
      <rect x="20" width="10" height="20" fill="#ce1126" />
      <circle cx="15" cy="10" r="2.6" fill="#8c5a2b" />
    </svg>
  );
}

function FlagUS() {
  return (
    <svg viewBox="0 0 30 20" className="h-3.5 w-5 overflow-hidden rounded-[2px]">
      <rect width="30" height="20" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map((i) => (
        <rect key={i} y={(i * 20) / 13} width="30" height={20 / 13} fill="#b22234" />
      ))}
      <rect width="13" height="10.8" fill="#3c3b6e" />
    </svg>
  );
}

function CartSheet({
  t,
  items,
  cart,
  money,
  total,
  restaurant,
  onAdd,
  onClose,
  onSent,
}: {
  t: Dict;
  items: Product[];
  cart: Record<string, number>;
  money: (n: number) => string;
  total: number;
  restaurant: MenuRestaurant;
  onAdd: (p: Product, delta: number) => void;
  onClose: () => void;
  onSent: () => void;
}) {
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"toGo" | "delivery" | "table">("toGo");
  const [detail, setDetail] = useState("");
  const [notes, setNotes] = useState("");

  function send() {
    const lines = [
      `${t.hello} ${restaurant.name}, ${t.wantOrder}`,
      "",
      ...items.map((p) => `• ${cart[p.id]}× ${p.name} — ${money(p.price * cart[p.id])}`),
      "",
      `*Total: ${money(total)}*`,
      `${t.delivery_}: ${t[mode]}${detail ? ` (${detail})` : ""}`,
      name ? `${t.name_}: ${name}` : "",
      notes ? `${t.notes_}: ${notes}` : "",
    ].filter((l, i, arr) => l !== "" || arr[i - 1] !== "");
    window.open(`https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank");
    onSent();
  }

  const field = "w-full rounded-xl border border-tinta/15 px-3.5 py-2.5 text-sm outline-none focus:border-rosa";

  return (
    <div className="anim-fade absolute inset-0 z-50 flex items-end bg-black/50" onClick={onClose}>
      <div className="anim-sheet max-h-[88%] w-full overflow-y-auto rounded-t-3xl bg-white p-5 text-tinta" onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-tinta/15" />
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-extrabold">{t.order}</h3>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-crema" aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <p className="py-8 text-center text-tinta-70">{t.empty}</p>
        ) : (
          <>
            <ul className="mt-3 divide-y divide-tinta/5">
              {items.map((p) => (
                <li key={p.id} className="flex items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{p.name}</p>
                    <p className="text-sm text-tinta-70">{money(p.price)}</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-crema p-1">
                    <button onClick={() => onAdd(p, -1)} className="rounded-full bg-white p-1.5" aria-label="Quitar uno">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-5 text-center font-bold">{cart[p.id]}</span>
                    <button onClick={() => onAdd(p, 1)} className="rounded-full bg-white p-1.5" aria-label="Agregar uno">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-3 grid grid-cols-3 gap-2 text-sm font-semibold">
              {(["toGo", "delivery", "table"] as const).map((m) => (
                <button key={m} onClick={() => setMode(m)} className={`rounded-xl py-2 ${mode === m ? "bg-tinta text-white" : "bg-crema"}`}>
                  {t[m]}
                </button>
              ))}
            </div>
            <div className="mt-3 space-y-2">
              <input className={field} placeholder={t.name} value={name} onChange={(e) => setName(e.target.value)} />
              {mode !== "toGo" && (
                <input className={field} placeholder={mode === "delivery" ? t.address : t.tableNo} value={detail} onChange={(e) => setDetail(e.target.value)} />
              )}
              <textarea className={field} rows={2} placeholder={t.notes} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <button onClick={send} className="mt-4 flex w-full items-center justify-between rounded-full bg-[#25D366] px-5 py-3.5 font-bold text-white">
              <span>{t.sendWa}</span>
              <span>{money(total)}</span>
            </button>
            <p className="mt-2 text-center text-xs text-tinta-70">{t.waHint}</p>
          </>
        )}
      </div>
    </div>
  );
}
