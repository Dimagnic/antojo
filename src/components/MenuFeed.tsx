"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Heart, Minus, Plus, Share2, ShoppingBag, Star, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Category, Product } from "@/lib/types";
import { formatMoney } from "@/lib/utils";

type MenuRestaurant = {
  id: string;
  name: string;
  whatsapp: string | null;
  currency: string;
  logo_url: string | null;
  is_open: boolean;
  review: string | null;
};

type EventType = "visit" | "view" | "add_cart" | "whatsapp_order" | "review_click";

const REVIEW_DELAY_MS = 25000;

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
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [liked, setLiked] = useState<Record<string, number>>({});
  const seen = useRef(new Set<string>());

  // Orden de la carta: por categoría y luego los que no tienen
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

  // Visita (una por sesión)
  useEffect(() => {
    const key = `antojo:visit:${restaurant.id}`;
    try {
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, "1");
        track("visit");
      }
    } catch {
      track("visit");
    }
  }, [restaurant.id, track]);

  // Invitación a reseñar después de un rato navegando
  const showReview = useCallback(() => {
    if (!restaurant.review) return;
    const key = `antojo:review:${restaurant.id}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {}
    setReviewOpen(true);
  }, [restaurant.id, restaurant.review]);

  useEffect(() => {
    const t = setTimeout(showReview, REVIEW_DELAY_MS);
    return () => clearTimeout(t);
  }, [showReview]);

  // Reproduce videos visibles, registra vistas y actualiza la categoría activa
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

  function goToCategory(id: string) {
    const el = feedRef.current?.querySelector(`[data-cat="${id}"]`);
    el?.scrollIntoView({ behavior: "smooth" });
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

  async function share(p: Product) {
    const url = window.location.href.split("#")[0];
    const text = `Mira ${p.name} en ${restaurant.name}`;
    if (navigator.share) navigator.share({ title: restaurant.name, text, url }).catch(() => {});
    else navigator.clipboard.writeText(url);
  }

  const items = ordered.filter((p) => cart[p.id]);
  const count = items.reduce((s, p) => s + cart[p.id], 0);
  const total = items.reduce((s, p) => s + cart[p.id] * p.price, 0);
  const money = (n: number) => formatMoney(n, restaurant.currency);

  return (
    <div className="flex h-[100dvh] justify-center bg-black">
      <div className="relative h-full w-full max-w-[460px] overflow-hidden bg-tinta text-white">
        {/* Barra superior */}
        <div className="absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-black/70 to-transparent pb-6">
          <div className="flex items-center justify-between px-4 pt-3">
            <div className="flex min-w-0 items-center gap-2">
              {restaurant.logo_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={restaurant.logo_url} alt="" className="h-8 w-8 rounded-full object-cover" />
              )}
              <span className="truncate font-extrabold">{restaurant.name}</span>
            </div>
            {restaurant.whatsapp && (
              <button
                onClick={() => setCartOpen(true)}
                className="relative rounded-full bg-white/15 p-2.5 backdrop-blur"
                aria-label="Ver mi pedido"
              >
                <ShoppingBag className="h-5 w-5" />
                {count > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rosa px-1 text-[11px] font-bold">
                    {count}
                  </span>
                )}
              </button>
            )}
          </div>
          {categories.length > 0 && (
            <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto px-4">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => goToCategory(c.id)}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                    activeCat === c.id ? "bg-white text-tinta" : "bg-white/15 text-white backdrop-blur"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}
          {!restaurant.is_open && (
            <p className="mx-4 mt-3 rounded-xl bg-sol px-3 py-1.5 text-center text-sm font-semibold text-tinta">
              Ahorita estamos cerrados. Puedes ver la carta.
            </p>
          )}
        </div>

        {/* Feed vertical */}
        <div ref={feedRef} className="no-scrollbar h-full snap-y snap-mandatory overflow-y-scroll">
          {ordered.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center p-10 text-center">
              <span className="text-6xl">🍽️</span>
              <p className="mt-4 text-xl font-bold">La carta se está cocinando</p>
              <p className="mt-1 text-white/70">Vuelve pronto.</p>
            </div>
          )}
          {ordered.map((p, i) => (
            <section
              key={p.id}
              data-slide
              data-id={p.id}
              data-cat={p.category_id ?? ""}
              className="relative h-full w-full snap-start snap-always overflow-hidden"
            >
              {p.media_url ? (
                p.media_type === "video" ? (
                  <video src={p.media_url} muted loop playsInline preload={i < 2 ? "auto" : "metadata"} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.media_url} alt={p.name} loading={i < 2 ? "eager" : "lazy"} className="absolute inset-0 h-full w-full object-cover" />
                )
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-rosa-600 via-tinta to-black text-8xl">🍽️</div>
              )}

              {/* Acciones laterales */}
              <div className="absolute bottom-48 right-3 z-10 flex flex-col items-center gap-5">
                <button onClick={() => like(p)} className="flex flex-col items-center" aria-label="Me gusta">
                  <Heart className={`h-7 w-7 drop-shadow ${liked[p.id] !== undefined ? "fill-rosa text-rosa" : ""}`} />
                  <span className="text-xs font-semibold drop-shadow">{liked[p.id] ?? p.likes}</span>
                </button>
                <button onClick={() => share(p)} aria-label="Compartir">
                  <Share2 className="h-7 w-7 drop-shadow" />
                </button>
              </div>

              {/* Info del platillo */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-5 pb-8 pt-24">
                {p.tags.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <span key={t} className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase ${t === "Picante" ? "bg-red-600" : "bg-white/20"}`}>
                        {t === "Picante" ? "🌶️ " : ""}
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-rosa px-3.5 py-1 text-base font-extrabold">{money(p.price)}</span>
                  {p.is_available ? (
                    restaurant.whatsapp && (
                      <button
                        onClick={() => add(p)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1.5 text-sm font-semibold backdrop-blur hover:bg-white/30"
                      >
                        <Plus className="h-4 w-4" /> {cart[p.id] ? `Agregado (${cart[p.id]})` : "Agregar"}
                      </button>
                    )
                  ) : (
                    <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold text-white/80">Agotado</span>
                  )}
                </div>
                <h2 className="mt-2 text-2xl font-extrabold leading-tight drop-shadow">{p.name}</h2>
                {p.description && <p className="mt-1 text-sm text-white/80">{p.description}</p>}
                {i === 0 && ordered.length > 1 && <p className="mt-4 animate-bounce text-center text-xs text-white/60">Desliza hacia arriba para ver más ↑</p>}
                {i === ordered.length - 1 && (
                  <p className="mt-5 text-center text-[11px] text-white/50">
                    Carta hecha con{" "}
                    <Link href="/" className="font-bold text-white/80">
                      antojo
                    </Link>
                  </p>
                )}
              </div>
            </section>
          ))}
        </div>

        {/* Botón flotante del pedido */}
        {count > 0 && !cartOpen && (
          <button
            onClick={() => setCartOpen(true)}
            className="absolute inset-x-4 bottom-4 z-20 flex items-center justify-between rounded-full bg-rosa px-5 py-3.5 font-bold shadow-xl shadow-black/40"
          >
            <span>Ver mi pedido ({count})</span>
            <span>{money(total)}</span>
          </button>
        )}

        {cartOpen && (
          <CartSheet
            items={items}
            cart={cart}
            money={money}
            total={total}
            restaurant={restaurant}
            onAdd={add}
            onClose={() => setCartOpen(false)}
            onSent={() => {
              track("whatsapp_order");
              setCart({});
              setCartOpen(false);
              setTimeout(showReview, 1200);
            }}
          />
        )}

        {reviewOpen && restaurant.review && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm" onClick={() => setReviewOpen(false)}>
            <div className="w-full max-w-xs rounded-3xl bg-white p-6 text-center text-tinta" onClick={(e) => e.stopPropagation()}>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sol/20">
                <Star className="h-6 w-6 fill-sol text-sol" />
              </div>
              <h3 className="mt-3 text-xl font-extrabold">¿Qué tal tu experiencia?</h3>
              <p className="mt-1 text-sm text-tinta-70">Tu opinión en Google nos ayuda muchísimo. Toma 30 segundos.</p>
              <a
                href={restaurant.review}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  track("review_click");
                  setReviewOpen(false);
                }}
                className="mt-5 block rounded-full bg-rosa py-3 font-bold text-white"
              >
                Dejar mi opinión en Google
              </a>
              <button onClick={() => setReviewOpen(false)} className="mt-2 w-full py-2 text-sm text-tinta-70">
                Ahora no
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CartSheet({
  items,
  cart,
  money,
  total,
  restaurant,
  onAdd,
  onClose,
  onSent,
}: {
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
  const [mode, setMode] = useState<"llevar" | "domicilio" | "mesa">("llevar");
  const [detail, setDetail] = useState("");
  const [notes, setNotes] = useState("");

  function send() {
    const lines = [
      `Hola ${restaurant.name}, quiero hacer un pedido:`,
      "",
      ...items.map((p) => `• ${cart[p.id]}× ${p.name} — ${money(p.price * cart[p.id])}`),
      "",
      `*Total: ${money(total)}*`,
      `Entrega: ${mode === "llevar" ? "Para llevar" : mode === "domicilio" ? "A domicilio" : "En mesa"}${detail ? ` (${detail})` : ""}`,
      name ? `Nombre: ${name}` : "",
      notes ? `Notas: ${notes}` : "",
    ].filter((l, i, arr) => l !== "" || arr[i - 1] !== "");
    const url = `https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank");
    onSent();
  }

  const field = "w-full rounded-xl border border-tinta/15 px-3.5 py-2.5 text-sm outline-none focus:border-rosa";

  return (
    <div className="absolute inset-0 z-30 flex items-end bg-black/50" onClick={onClose}>
      <div className="max-h-[88%] w-full overflow-y-auto rounded-t-3xl bg-white p-5 text-tinta" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-extrabold">Tu pedido</h3>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-crema" aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <p className="py-8 text-center text-tinta-70">Aún no agregas nada. ¡Date un antojo!</p>
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
              {(["llevar", "domicilio", "mesa"] as const).map((m) => (
                <button key={m} onClick={() => setMode(m)} className={`rounded-xl py-2 ${mode === m ? "bg-tinta text-white" : "bg-crema"}`}>
                  {m === "llevar" ? "Para llevar" : m === "domicilio" ? "A domicilio" : "En mesa"}
                </button>
              ))}
            </div>
            <div className="mt-3 space-y-2">
              <input className={field} placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} />
              {mode !== "llevar" && (
                <input
                  className={field}
                  placeholder={mode === "domicilio" ? "Dirección de entrega" : "Número de mesa"}
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                />
              )}
              <textarea className={field} rows={2} placeholder="Notas (sin cebolla, salsa aparte…)" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>

            <button onClick={send} className="mt-4 flex w-full items-center justify-between rounded-full bg-[#25D366] px-5 py-3.5 font-bold text-white">
              <span>Enviar pedido por WhatsApp</span>
              <span>{money(total)}</span>
            </button>
            <p className="mt-2 text-center text-xs text-tinta-70">Se abrirá WhatsApp con tu pedido listo para enviar.</p>
          </>
        )}
      </div>
    </div>
  );
}
