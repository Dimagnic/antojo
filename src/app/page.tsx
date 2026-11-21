import Link from "next/link";
import {
  BarChart3,
  Check,
  Heart,
  MessageCircle,
  QrCode,
  RefreshCw,
  Share2,
  ShoppingBag,
  Sparkles,
  Star,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { ClienteAIWidget } from "@/components/ClienteAIWidget";
import { Footer } from "@/components/Footer";

const features = [
  {
    icon: Sparkles,
    title: "Una carta que se antoja",
    text: "Fotos y videos a pantalla completa, en scroll vertical como en redes. Tus platillos se venden solos.",
  },
  {
    icon: Star,
    title: "Más reseñas en Google",
    text: "Al terminar, Antojo invita a tus clientes a calificarte en Google Maps con un solo toque.",
  },
  {
    icon: MessageCircle,
    title: "Pedidos por WhatsApp",
    text: "El cliente arma su pedido desde la carta y te llega listo a tu WhatsApp. Sin comisiones.",
  },
  {
    icon: RefreshCw,
    title: "Cambia precios al instante",
    text: "Edita platillos, fotos y precios desde tu celular. El QR nunca cambia, no reimprimes nada.",
  },
  {
    icon: BarChart3,
    title: "Sabe qué se te antoja vender",
    text: "Visitas, horas pico y los platillos más vistos para decidir qué destacar.",
  },
  {
    icon: QrCode,
    title: "QR listo para imprimir",
    text: "Descarga tu código en alta resolución para mesas, mostrador, volantes o redes.",
  },
];

const steps = [
  { n: "1", title: "Registra tu negocio", text: "Nombre, WhatsApp y tu ubicación en Google Maps. Toma un minuto." },
  { n: "2", title: "Sube tus platillos", text: "Foto o video, precio y descripción. Agrúpalos por categoría." },
  { n: "3", title: "Imprime tu QR", text: "Ponlo en tus mesas y empieza a recibir pedidos y reseñas." },
];

const plans = [
  {
    name: "Básico",
    price: "$0",
    note: "para siempre",
    cta: "Empezar gratis",
    highlight: false,
    items: ["Carta digital con QR", "Hasta 15 platillos", "Botón de reseña en Google", "Pedidos por WhatsApp"],
  },
  {
    name: "Pro",
    price: "$349",
    note: "MXN al mes",
    cta: "Probar 14 días gratis",
    highlight: true,
    items: [
      "Todo lo del Básico",
      "Platillos ilimitados con video",
      "Métricas de visitas y platillos",
      "Sin marca de Antojo en tu carta",
      "Soporte por WhatsApp",
    ],
  },
  {
    name: "Plus",
    price: "$599",
    note: "MXN al mes",
    cta: "Hablar con ventas",
    highlight: false,
    items: ["Todo lo del Pro", "Ruleta de premios", "Puntos de lealtad", "Campañas por correo", "Varias sucursales"],
  },
];

const faqs = [
  {
    q: "¿Mis clientes tienen que descargar una app?",
    a: "No. Escanean el QR con la cámara y la carta abre en su navegador al instante.",
  },
  {
    q: "¿Cómo funcionan las reseñas?",
    a: "Después de ver la carta o enviar su pedido, Antojo invita al cliente a dejar su opinión en tu perfil de Google Maps. Mostramos la invitación a todos por igual, como piden las políticas de Google.",
  },
  {
    q: "¿Cobran comisión por pedido?",
    a: "No. El pedido llega directo a tu WhatsApp y tú cobras como siempre.",
  },
  {
    q: "¿Puedo usarlo si no sé de tecnología?",
    a: "Sí. Si sabes mandar un WhatsApp, sabes usar Antojo. Y si te atoras, te ayudamos.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Navegación */}
      <header className="sticky top-0 z-40 border-b border-rosa-100/60 bg-crema/80 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Logo />
          <div className="hidden items-center gap-7 text-sm font-medium text-tinta-70 md:flex">
            <a href="#funciones" className="hover:text-rosa">Funciones</a>
            <a href="#como-funciona" className="hover:text-rosa">Cómo funciona</a>
            <a href="#precios" className="hover:text-rosa">Precios</a>
            <a href="#preguntas" className="hover:text-rosa">Preguntas</a>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/entrar" className="rounded-full px-4 py-2 text-sm font-semibold text-tinta hover:bg-rosa-50">
              Entrar
            </Link>
            <Link
              href="/registro"
              className="rounded-full bg-rosa px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-rosa/25 hover:bg-rosa-600"
            >
              Crear mi carta
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full bg-rosa/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-[-10%] h-[360px] w-[360px] rounded-full bg-sol/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-rosa-50 px-3 py-1 text-xs font-semibold text-rosa">
              <QrCode className="h-3.5 w-3.5" /> Carta digital para restaurantes en México
            </span>
            <h1 className="mt-5 text-5xl font-extrabold leading-[1.02] tracking-tight md:text-6xl">
              Tu carta QR que <span className="text-rosa">abre el antojo</span> y vende sola.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-tinta-70">
              Cambia el PDF aburrido por una carta con fotos y videos, recibe pedidos por WhatsApp y
              junta reseñas en Google sin pedirlas a mano.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/registro"
                className="rounded-full bg-rosa px-6 py-3.5 font-semibold text-white shadow-xl shadow-rosa/30 hover:bg-rosa-600"
              >
                Crear mi carta gratis
              </Link>
              <a href="#como-funciona" className="rounded-full px-5 py-3.5 font-semibold text-tinta hover:bg-white">
                Ver cómo funciona →
              </a>
            </div>
            <p className="mt-4 text-sm text-tinta-70">Sin tarjeta. Lista en 5 minutos.</p>
          </div>

          <PhoneMock />
        </div>
      </section>

      {/* Funciones */}
      <section id="funciones" className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="max-w-2xl text-4xl font-extrabold tracking-tight">
          Muestra mejor. Vende más. <span className="text-rosa">Junta reseñas.</span>
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-3xl border border-rosa-100 bg-white p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rosa-50 text-rosa">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-tinta-70">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="bg-tinta py-20 text-white">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-4xl font-extrabold tracking-tight">
            De cero a carta en <span className="text-sol">3 pasos</span>
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rosa text-lg font-extrabold">
                  {s.n}
                </div>
                <h3 className="mt-4 text-xl font-bold">{s.title}</h3>
                <p className="mt-2 text-white/70">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Precios */}
      <section id="precios" className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="text-center text-4xl font-extrabold tracking-tight">Precios en pesos, sin sorpresas</h2>
        <p className="mt-3 text-center text-tinta-70">Cancela cuando quieras.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`flex flex-col rounded-3xl p-7 ${
                p.highlight ? "bg-rosa text-white shadow-2xl shadow-rosa/30" : "border border-rosa-100 bg-white"
              }`}
            >
              <h3 className="text-lg font-bold">{p.name}</h3>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-5xl font-extrabold">{p.price}</span>
                <span className={p.highlight ? "text-white/80" : "text-tinta-70"}>{p.note}</span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {p.items.map((i) => (
                  <li key={i} className="flex gap-2">
                    <Check className={`mt-0.5 h-5 w-5 shrink-0 ${p.highlight ? "text-sol" : "text-rosa"}`} />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/registro"
                className={`mt-8 rounded-full px-5 py-3 text-center font-semibold ${
                  p.highlight ? "bg-white text-rosa hover:bg-rosa-50" : "bg-tinta text-white hover:bg-tinta/90"
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Preguntas */}
      <section id="preguntas" className="mx-auto max-w-3xl px-5 pb-20">
        <h2 className="text-center text-4xl font-extrabold tracking-tight">Preguntas frecuentes</h2>
        <div className="mt-8 space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-rosa-100 bg-white p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                {f.q}
                <span className="text-rosa transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-tinta-70">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="rounded-[2rem] bg-gradient-to-br from-rosa to-rosa-600 px-8 py-14 text-center text-white">
          <h2 className="text-4xl font-extrabold tracking-tight">¿Se te antojó?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/85">
            Crea tu carta hoy y empieza a recibir pedidos y reseñas esta misma semana.
          </p>
          <Link
            href="/registro"
            className="mt-7 inline-block rounded-full bg-white px-7 py-3.5 font-semibold text-rosa hover:bg-rosa-50"
          >
            Crear mi carta gratis
          </Link>
        </div>
      </section>

      <Footer />
      <ClienteAIWidget />
    </div>
  );
}

function PhoneMock() {
  return (
    <div className="relative mx-auto w-[290px]">
      <div className="absolute -left-16 top-16 hidden rotate-[-6deg] rounded-2xl bg-white p-3 shadow-xl md:block">
        <div className="flex gap-0.5 text-sol">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-current" />
          ))}
        </div>
        <p className="mt-1 text-xs font-medium">&ldquo;Pedí por la carta y llegó rapidísimo&rdquo;</p>
      </div>
      <div className="absolute -right-12 bottom-24 hidden rotate-[5deg] rounded-2xl bg-white p-3 shadow-xl md:block">
        <p className="text-xs font-semibold text-[#128C7E]">Nuevo pedido por WhatsApp</p>
        <p className="text-xs text-tinta-70">2× Tacos al pastor · $130</p>
      </div>
      <div className="rounded-[2.6rem] bg-tinta p-2.5 shadow-2xl shadow-tinta/30">
        <div className="relative h-[580px] overflow-hidden rounded-[2.1rem] bg-gradient-to-b from-[#3a1d0e] via-[#7a2e12] to-[#1b1130]">
          <div className="absolute inset-x-0 top-0 flex gap-2 overflow-hidden p-3 text-[11px] font-semibold">
            {["Tacos", "Tortas", "Bebidas", "Postres"].map((c, i) => (
              <span key={c} className={`rounded-full px-3 py-1 ${i === 0 ? "bg-white text-tinta" : "bg-white/15 text-white"}`}>
                {c}
              </span>
            ))}
          </div>
          <div className="absolute inset-0 flex items-center justify-center text-[130px]">🌮</div>
          <div className="absolute right-3 top-1/2 flex flex-col items-center gap-4 text-white">
            <Heart className="h-6 w-6" />
            <Share2 className="h-6 w-6" />
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5 text-white">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-rosa px-3 py-1 text-sm font-bold">$65</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs">
                <ShoppingBag className="h-3.5 w-3.5" /> Agregar
              </span>
            </div>
            <p className="mt-2 text-xl font-extrabold">Tacos al pastor (3)</p>
            <p className="text-sm text-white/75">Con piña, cebolla, cilantro y salsa de la casa.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
