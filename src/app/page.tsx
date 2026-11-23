import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Gamepad2,
  Globe,
  Handshake,
  Mail,
  MessageCircle,
  RefreshCw,
  ShoppingCart,
  Smartphone,
  Star,
  Users,
} from "lucide-react";
import { ClienteAIWidget } from "@/components/ClienteAIWidget";
import { Footer } from "@/components/Footer";
import { BlogCard } from "@/components/landing/BlogCard";
import {
  CartMock,
  LanguageMock,
  MailMock,
  MenuToPhoneMock,
  PointsMock,
  PriceMock,
  ReviewMock,
  StatsMock,
  WheelMock,
} from "@/components/landing/Mocks";
import { HeroPhone } from "@/components/landing/HeroPhone";
import { Pricing } from "@/components/landing/Pricing";
import { RotatingWord } from "@/components/landing/RotatingWord";
import { Reveal } from "@/components/landing/Reveal";
import { Showcase } from "@/components/landing/Showcase";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { POSTS } from "@/lib/blog";
import { waLink } from "@/lib/site";

const stats = [
  { n: "5 min", t: "Para tener tu carta en línea", d: "Sin técnicos, sin papeles, sin complicaciones." },
  { n: "0%", t: "De comisión por pedido", d: "El pedido llega directo a tu WhatsApp." },
  { n: "24/7", t: "Tu carta siempre al día", d: "Cambia precios cuando quieras; el QR es el mismo." },
];

type Feature = {
  pill: string;
  icon: React.ComponentType<{ className?: string }>;
  title: React.ReactNode;
  text: string;
  dark?: boolean;
  soon?: boolean;
  mock: React.ReactNode;
};

// Cuadrícula de escritorio igual a LaCarta: 7/5 · 4/4/4 · 5/7 · 6/6
const SPANS = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-4", "lg:col-span-4", "md:col-span-2 lg:col-span-4", "lg:col-span-5", "lg:col-span-7", "lg:col-span-6", "lg:col-span-6"];

const hl = (w: string) => <span className="text-rosa">{w}</span>;

const features: Feature[] = [
  {
    pill: "Carta tipo TikTok",
    icon: Smartphone,
    dark: true,
    title: <>Tu carta deja de ser un PDF y ahora {hl("vende")} por ti</>,
    text: "Muestra tus platillos con fotos, videos y precios claros. Menos dudas, más ganas de pedir.",
    mock: <MenuToPhoneMock />,
  },
  {
    pill: "Reseñas automáticas",
    icon: Star,
    title: <>Convierte cada mesa en una nueva {hl("reseña")}</>,
    text: "Antojo invita a cada cliente a calificarte en Google Maps justo cuando acaba de disfrutar. Sin pedirlo a mano y sin depender del mesero.",
    mock: <ReviewMock />,
  },
  {
    pill: "Datos del negocio",
    icon: BarChart3,
    title: <>Descubre qué {hl("se antoja")} antes de que pidan</>,
    text: "Conoce qué platillos llaman más la atención, a qué hora llegan más clientes y qué conviene destacar.",
    mock: <StatsMock />,
  },
  {
    pill: "Actualización",
    icon: RefreshCw,
    title: <>Cambia {hl("precios")} y platillos sin reimprimir</>,
    text: "Edita productos, fotos, videos y orden desde tu panel. El QR sigue siendo el mismo.",
    mock: <PriceMock />,
  },
  {
    pill: "Clientes de todo el mundo",
    icon: Globe,
    title: <>Tu carta también habla {hl("inglés")}</>,
    text: "Tus clientes entienden la carta sin importar de dónde vengan.",
    mock: <LanguageMock />,
  },
  {
    pill: "Lealtad",
    icon: Users,
    dark: true,
    title: <>Dales una {hl("razón")} para volver</>,
    text: "Tus clientes suman puntos, ganan premios y los canjean en tu negocio. Más visitas repetidas, sin esfuerzo extra.",
    mock: <PointsMock />,
  },
  {
    pill: "Juegos y premios",
    icon: Gamepad2,
    dark: true,
    title: <>Convierte cada visita en una {hl("experiencia")}</>,
    text: "La ruleta “Juega y gana” sorprende con premios y aumenta la participación de tus clientes.",
    mock: <WheelMock />,
  },
  {
    pill: "Promociones por correo",
    icon: Mail,
    soon: true,
    title: <>Envía promociones y haz que {hl("vuelvan")}</>,
    text: "Manda campañas a tus clientes directamente desde tu panel de Antojo, sin contratar servicios externos.",
    mock: <MailMock />,
  },
  {
    pill: "Carrito por WhatsApp",
    icon: ShoppingCart,
    title: <>Recibe pedidos para llevar directo en {hl("WhatsApp")}</>,
    text: "Tus clientes arman el carrito desde la carta y te envían el pedido listo por WhatsApp. Menos idas y vueltas, más pedidos organizados.",
    mock: <CartMock />,
  },
];

const faqs = [
  ["¿Sirve solo para restaurantes con mesas?", "No. Funciona igual para taquerías, cafeterías, bares, food trucks y negocios para llevar o a domicilio."],
  ["¿Puedo usarlo desde mi celular?", "Sí. Puedes crear, editar y compartir tu carta desde el celular, la tablet o la computadora, sin descargar nada."],
  ["¿Mis clientes tienen que instalar una app?", "No. Escanean el QR con la cámara y la carta abre al instante en su navegador."],
  ["¿Cómo funcionan las reseñas?", "Después de ver la carta o enviar su pedido, Antojo invita al cliente a calificarte en Google Maps con un toque. La invitación se muestra a todos por igual, como piden las reglas de Google."],
  ["¿Cobran comisión por pedido?", "No. El pedido llega a tu WhatsApp y cobras como siempre."],
  ["¿Y si no sé de tecnología?", "Si sabes mandar un WhatsApp, sabes usar Antojo. Y si te atoras, te ayudamos."],
];

export default function Home() {
  return (
    <div className="overflow-x-clip bg-white">
      <SiteHeader />

      {/* ───── Hero ───── */}
      <section className="relative px-5 pb-10 pt-40 md:pt-48">
        <div className="pointer-events-none absolute -right-40 top-20 h-[460px] w-[460px] rounded-full bg-rosa/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-40 top-[520px] h-[360px] w-[360px] rounded-full bg-sol/15 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="anim-fade-up text-center lg:text-left">
              <span className="inline-block rounded-full bg-gradient-to-r from-rosa to-[#ff5c7a] px-4 py-1.5 text-[14px] font-semibold text-white shadow-md shadow-rosa/30">
                Carta QR tipo TikTok
              </span>
            </div>
            <h1 className="anim-fade-up mt-5 text-[34px] font-semibold leading-[1.2] tracking-tight sm:text-5xl lg:text-[54px]" style={{ animationDelay: "100ms" }}>
              Tu carta QR,
              <br />
              ahora <RotatingWord words={["trabaja", "vende", "califica"]} /> por <span className="text-rosa">ti.</span>
            </h1>
            <p className="anim-fade-up mt-5 max-w-xl text-[17px] leading-relaxed text-tinta/85 lg:text-lg" style={{ animationDelay: "200ms" }}>
              Cambia tu <span className="text-tinta-70 line-through decoration-rosa decoration-2">PDF aburrido</span> por una{" "}
              <b className="font-semibold text-rosa">carta interactiva</b> que abre el antojo, vende más y junta reseñas. Sin descargar apps.
            </p>
            <div className="anim-fade-up mt-8 flex flex-col gap-3 sm:flex-row sm:items-center" style={{ animationDelay: "300ms" }}>
              <Link href="/registro" className="btn-primary flex items-center justify-center gap-2 rounded-2xl px-8 py-3.5 text-[16px] font-semibold text-white">
                Crear mi carta gratis <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/demo" className="flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-3.5 text-[16px] font-semibold text-tinta shadow-[0_8px_24px_-12px_rgba(27,17,48,0.25)] ring-1 ring-tinta/10 sm:shadow-none sm:ring-0">
                Ver en acción <span className="h-2 w-2 animate-pulse rounded-full bg-rosa" />
              </Link>
            </div>
            <p className="anim-fade-up mt-5 text-[15px] text-tinta-70" style={{ animationDelay: "400ms" }}>
              <b className="font-semibold text-tinta/80">Prueba gratis</b> de 14 días. No necesitas tarjeta de crédito.
            </p>
            <p className="anim-fade-up mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px]" style={{ animationDelay: "450ms" }}>
              <span className="text-tinta-70">Integración con</span> <b className="font-semibold">Google Maps</b> <span className="text-red-500">📍</span> <span className="text-tinta-70">y</span> <b className="font-semibold">WhatsApp</b>{" "}
              <MessageCircle className="h-4 w-4 fill-[#25D366] text-[#25D366]" />
            </p>
            <div className="anim-fade-up mt-5 flex items-center gap-3 border-l-4 border-rosa pl-4" style={{ animationDelay: "500ms" }}>
              <span className="text-lg tracking-wider text-sol">★★★★★</span>
              <span className="text-[15px] text-tinta-70">
                Hecha para <b className="font-semibold text-tinta">juntar reseñas</b> en Google Maps
              </span>
            </div>
          </div>

          <div className="anim-fade-up relative mx-auto flex items-center gap-6 lg:mr-0" style={{ animationDelay: "250ms" }}>
            {/* Reseñas que llegan a Google (ilustración) */}
            <div className="hidden w-52 flex-col gap-10 xl:flex">
              <p className="text-[11px] font-medium uppercase tracking-wider text-tinta-70">Ejemplo de reseñas en Google Maps</p>
              {[
                { n: "S", c: "bg-red-500", q: "Muy rica la comida, la atención de 10.", w: "Sofía L.", x: "ml-6" },
                { n: "J", c: "bg-blue-600", q: "Todo muy rico y el lugar es hermoso.", w: "Javier R.", x: "" },
                { n: "M", c: "bg-purple-600", q: "Increíble el lugar, volveré pronto.", w: "Mariana D.", x: "ml-4" },
              ].map((r, i) => (
                <div key={r.w} className={`float-y flex gap-2.5 ${r.x}`} style={{ animationDelay: `${i * 0.8}s` }}>
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${r.c}`}>{r.n}</span>
                  <div>
                    <p className="text-[11px] tracking-widest text-sol">★★★★★</p>
                    <p className="text-[13px] leading-snug">“{r.q}”</p>
                    <p className="mt-0.5 text-[11px] text-tinta-70">
                      {r.w} · <span className="text-red-500">📍</span> Google Maps
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="relative">
              <HeroPhone />
              <div className="absolute -right-10 -top-8 rotate-6 rounded-2xl bg-white p-2 shadow-xl ring-1 ring-tinta/5 sm:-right-20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/qr-demo.svg" alt="Código QR de la demo" className="h-16 w-16 sm:h-24 sm:w-24" />
                <p className="mt-1 text-center text-[9px] font-semibold text-tinta-70">Escanéame</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Cartas de ejemplo ───── */}
      <section className="pb-12 pt-6">
        <Reveal className="px-5 text-center">
          <h2 className="text-[24px] font-medium text-tinta-70 md:text-3xl">
            Así se ve tu carta en <span className="font-bold text-tinta">anto</span>
            <span className="font-bold text-rosa">jo</span>
          </h2>
          <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-tinta-70">
            Taquerías, cafeterías, bares y restaurantes que quieren vender más con su carta QR.
          </p>
        </Reveal>
        <Reveal className="mx-auto mt-8 max-w-6xl" delay={100}>
          <Showcase />
        </Reveal>
      </section>

      {/* ───── Cifras ───── */}
      <section className="px-5 pb-20">
        <Reveal className="card-dark mx-auto max-w-6xl overflow-hidden rounded-[32px] text-white shadow-2xl shadow-tinta/30">
          <div className="grid divide-y divide-white/10 md:grid-cols-3 md:divide-x md:divide-y-0">
            {stats.map((s) => (
              <div key={s.n} className="p-7 md:p-9">
                <p className="text-[38px] font-bold leading-none text-rosa">{s.n}</p>
                <p className="mt-3 text-[17px] font-semibold">{s.t}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-white/65">{s.d}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ───── Funciones ───── */}
      <section id="funciones" className="scroll-mt-32 px-5 pb-20">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-[32px] font-semibold leading-tight tracking-tight md:text-5xl">
            Muestra mejor. Vende más. <span className="text-rosa">Junta reseñas.</span>
          </h2>
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-12">
          {features.map((f, i) => (
            <Reveal
              key={f.pill}
              delay={(i % 3) * 110}
              className={`relative overflow-hidden rounded-[32px] p-7 md:p-9 ${SPANS[i]} ${
                f.dark ? "card-dark text-white shadow-2xl shadow-tinta/25" : "card-light grid-dots shadow-[0_20px_60px_-30px_rgba(27,17,48,0.35)] ring-1 ring-tinta/5"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-medium ${
                    f.dark ? "bg-white/10 text-rosa-100" : "bg-rosa-50 text-rosa"
                  }`}
                >
                  <f.icon className="h-4 w-4" /> {f.pill}
                </span>
                {f.soon && <span className="rounded-full bg-sol/20 px-2.5 py-1 text-[11px] font-bold text-amber-700">Próximamente</span>}
              </div>
              <h3 className="mt-5 text-[26px] font-medium leading-[1.2] tracking-tight md:text-[30px]">{f.title}</h3>
              <p className={`mt-4 text-[15px] leading-[1.75] ${f.dark ? "text-white/70" : "text-tinta-70"}`}>{f.text}</p>
              {f.mock}
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───── Precios ───── */}
      <section id="precios" className="scroll-mt-32 px-5 pb-20">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-[30px] font-bold leading-tight tracking-tight md:text-[40px]">
            Elige el plan que acompaña el <span className="text-rosa">crecimiento de tu negocio</span>
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-tinta-70">
            Empieza gratis con una carta QR profesional o desbloquea todo para vender, medir y hacer crecer tu marca.
          </p>
        </Reveal>
        <Pricing />
      </section>

      {/* ───── Blog ───── */}
      <section className="px-5 pb-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-rosa">Blog</p>
          <h2 className="mt-2 text-[30px] font-semibold leading-tight tracking-tight md:text-[44px]">Guías para vender más con tu carta QR</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-tinta-70">
            Ideas prácticas para atraer clientes desde Google, mejorar tu carta digital y juntar reseñas sin depender de publicidad.
          </p>
        </Reveal>
        <div className="mx-auto mt-10 grid max-w-6xl gap-6 md:grid-cols-3">
          {POSTS.map((p, i) => (
            <Reveal key={p.slug} delay={i * 100}>
              <BlogCard post={p} />
            </Reveal>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/blog" className="btn-primary inline-flex items-center gap-2 rounded-2xl px-8 py-3.5 font-semibold text-white">
            Ver todos los artículos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ───── Preguntas ───── */}
      <section id="preguntas" className="scroll-mt-32 px-5 pb-20">
        <Reveal className="mx-auto max-w-3xl">
          <h2 className="text-center text-[30px] font-semibold tracking-tight md:text-[44px]">
            Preguntas <span className="text-rosa">frecuentes</span>
          </h2>
          <p className="mt-3 text-center text-[16px] text-tinta-70">Resolvemos tus dudas sobre tu nueva carta estilo TikTok.</p>
          <div className="mt-8 divide-y divide-tinta/10 border-y border-tinta/10">
            {faqs.map(([q, a]) => (
              <details key={q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] font-medium">
                  {q}
                  <span className="text-xl text-tinta-70 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-[15px] leading-relaxed text-tinta-70">{a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ───── Llamado final ───── */}
      <section className="px-5 pb-20">
        <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-[36px] bg-gradient-to-br from-white to-rosa-50 p-8 shadow-[0_30px_80px_-40px_rgba(27,17,48,0.4)] ring-1 ring-tinta/5 md:p-14">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-rosa/10" />
          <div className="pointer-events-none absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-sol/15" />
          <div className="relative grid items-center gap-10 md:grid-cols-2">
            <div>
              <h2 className="text-[34px] font-semibold leading-[1.15] tracking-tight md:text-5xl">
                Comienza tu prueba gratuita <span className="text-rosa">hoy</span>
              </h2>
              <p className="mt-4 text-[18px] leading-relaxed text-tinta-70">Crea tu primera carta digital sin compromiso.</p>
              <Link href="/registro" className="btn-primary mt-7 flex items-center justify-center gap-2 rounded-2xl py-3.5 font-semibold text-white md:max-w-sm">
                Crear mi carta gratis <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="mt-3 text-[15px] text-tinta-70">No necesitas tarjeta de crédito.</p>
            </div>
            <div className="space-y-3 rounded-[28px] bg-white/80 p-5 shadow-lg backdrop-blur">
              {["Lista en 5 minutos", "Sin tarjeta", "Soporte por WhatsApp"].map((t, i) => (
                <p key={t} className={`rounded-2xl px-5 py-4 text-[16px] font-medium ${i === 1 ? "bg-sol/15" : "bg-crema"}`}>
                  {t}
                </p>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ───── Partners ───── */}
      <section id="partners" className="scroll-mt-32 px-5 pb-24">
        <Reveal className="mx-auto max-w-3xl rounded-[36px] bg-gradient-to-b from-white to-rosa-50/60 p-8 text-center shadow-[0_30px_80px_-40px_rgba(230,0,126,0.35)] ring-1 ring-rosa-100 md:p-14">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/antojo-logo.svg" alt="Antojo" className="mx-auto h-12 w-auto" />
          <p className="mt-2 text-[13px] font-semibold uppercase tracking-[0.4em] text-tinta">Partners</p>
          <h2 className="mt-6 text-[32px] font-semibold leading-tight tracking-tight md:text-5xl">
            Conecta restaurantes.
            <br />
            <span className="text-rosa">Genera ingresos todos los meses.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-tinta-70">
            Si trabajas con negocios de comida, suma Antojo a tu propuesta y crezcamos juntos.
          </p>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-tinta-70">
            Tú nos presentas al negocio; nosotros nos encargamos de la demo, el cierre y la puesta en marcha. Tú recibes tu comisión cada mes.
          </p>
          <a
            href={waLink("Hola, quiero ser partner de Antojo")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-8 inline-flex items-center gap-2 rounded-2xl px-8 py-3.5 font-semibold text-white"
          >
            <Handshake className="h-5 w-5" /> Quiero ser partner <ArrowRight className="h-4 w-4" />
          </a>
          <p className="mt-3 text-[13px] text-tinta-70">Hablamos por WhatsApp y te contamos cómo empezar.</p>
        </Reveal>
      </section>

      <Footer />
      <ClienteAIWidget />
    </div>
  );
}
