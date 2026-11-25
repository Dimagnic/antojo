import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Gamepad2,
  Globe,
  ArrowUpRight,
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
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { BlogCard } from "@/components/landing/BlogCard";
import {
  CartMock,
  LanguageMock,
  MailEmail,
  MailPhone,
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
  tint?: "cream" | "blue" | "green" | "purple" | "rosa";
  aside?: React.ReactNode;
  mock: React.ReactNode;
};

// Cuadrícula de escritorio igual a LaCarta: 7/5 · 4/4/4 · 5/7 · 6/6
const SPANS = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-4", "lg:col-span-4", "md:col-span-2 lg:col-span-4", "lg:col-span-5", "lg:col-span-7", "md:col-span-2 lg:col-span-7", "lg:col-span-5"];

const hl = (w: string) => <span className="text-rosa">{w}</span>;

const features: Feature[] = [
  {
    pill: "Carta tipo TikTok",
    icon: Smartphone,
    dark: true,
    title: <>Tu menú deja de ser un PDF y ahora {hl("trabaja")} por ti</>,
    text: "Muestra tus platillos con fotos, videos y precios claros. Menos dudas, más ganas de pedir.",
    mock: <MenuToPhoneMock />,
  },
  {
    pill: "Reseñas automáticas",
    icon: Star,
    tint: "cream",
    title: <>Convierte cada mesa en una nueva {hl("reseña")}</>,
    text: "Antojo guía al comensal para dejar su reseña en Google Maps dentro de la experiencia del menú. Sin pedirlo a mano. Sin depender del mesero. Sin que sea incómodo.",
    mock: <ReviewMock />,
  },
  {
    pill: "Datos del negocio",
    icon: BarChart3,
    tint: "blue",
    title: <>Descubre qué {hl("mira")} la gente antes de pedir</>,
    text: "Conoce qué platillos llaman más la atención, en qué horarios entran más clientes y qué productos deberías destacar.",
    mock: <StatsMock />,
  },
  {
    pill: "Actualización",
    icon: RefreshCw,
    tint: "green",
    title: <>Cambia {hl("precios")} y platillos sin reimprimir</>,
    text: "Edita productos, fotos, videos y orden desde tu panel. El QR sigue siendo el mismo.",
    mock: <PriceMock />,
  },
  {
    pill: "Clientes de todo el mundo",
    icon: Globe,
    tint: "purple",
    title: <>Tu menú también habla {hl("inglés")}</>,
    text: "Tus clientes entienden tu menú, sin importar de dónde vengan.",
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
    tint: "blue",
    title: <>Envía promociones por <br className="hidden sm:block" />correo y haz que {hl("vuelvan")}</>,
    text: "Envía campañas de correo masivas a tus clientes directamente desde el panel de Antojo, sin contratar servicios externos.",
    mock: <MailEmail />,
    aside: <MailPhone />,
  },
  {
    pill: "Carrito por WhatsApp",
    icon: ShoppingCart,
    tint: "green",
    title: <>Recibe pedidos {hl("para llevar")} <br className="hidden sm:block" />directo en WhatsApp</>,
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
      <section className="relative px-4 pb-24 pt-[124px] md:px-5 md:pt-48">
        <div className="pointer-events-none absolute -right-40 top-20 h-[460px] w-[460px] rounded-full bg-rosa/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-40 top-[520px] h-[360px] w-[360px] rounded-full bg-sol/15 blur-3xl" />
        <div className="relative mx-auto grid max-w-[1210px] items-center gap-6 md:gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="anim-fade-up text-center lg:text-left">
              <span className="inline-block rounded-full bg-gradient-to-r from-rosa to-[#ff6a3d] px-3 py-1 text-[11px] md:px-4 md:py-1.5 md:text-[14px] font-semibold text-white shadow-md shadow-rosa/30">
                Carta QR tipo TikTok
              </span>
            </div>
            <h1 className="anim-fade-up mt-3 text-[27px] font-semibold leading-[1.2] tracking-tight sm:text-5xl md:mt-5 lg:text-[54px]" style={{ animationDelay: "100ms" }}>
              Tu carta QR,
              <br />
              ahora <RotatingWord words={["vende", "trabaja", "califica"]} /> por <span className="text-rosa">ti.</span>
            </h1>
            <p className="anim-fade-up mt-3 max-w-xl text-[13px] leading-relaxed text-tinta/85 md:mt-5 md:text-[17px] lg:text-lg" style={{ animationDelay: "200ms" }}>
              Transforma tu <span className="font-semibold text-tinta-70 line-through decoration-rosa decoration-2">PDF aburrido</span> en una{" "}
              <b className="font-semibold text-rosa">experiencia interactiva</b>
              <br className="hidden lg:block" /> que vende más y consigue reseñas sin descargar nada.
            </p>
            <div className="anim-fade-up mt-5 flex flex-col gap-2 sm:flex-row sm:items-center md:mt-8 md:gap-3" style={{ animationDelay: "300ms" }}>
              <Link href="/registro" className="btn-primary flex items-center justify-center gap-2 rounded-xl px-8 py-2.5 text-[13px] font-semibold text-white md:rounded-2xl md:py-3.5 md:text-[16px]">
                Crear menú gratis <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/demo" className="flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-2 text-[12px] font-semibold text-tinta md:rounded-2xl md:py-3.5 md:text-[16px] shadow-[0_8px_24px_-12px_rgba(27,17,48,0.25)] ring-1 ring-tinta/10 sm:shadow-none sm:ring-0">
                Ver en acción <span className="h-2 w-2 animate-pulse rounded-full bg-rosa" />
              </Link>
            </div>
            <p className="anim-fade-up mt-3 text-[11.5px] text-tinta-70 md:mt-5 md:text-[15px]" style={{ animationDelay: "400ms" }}>
              <b className="font-semibold text-tinta/80">Prueba gratuita</b> de 14 días. No se requieren datos de tarjeta.
            </p>
            <p className="anim-fade-up mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] md:mt-3 md:gap-x-2 md:text-[15px]" style={{ animationDelay: "450ms" }}>
              <span className="text-tinta-70">Integración con</span> <b className="font-semibold">Google Maps</b> <span className="text-red-500">📍</span> <span className="text-tinta-70">y</span> <b className="font-semibold">WhatsApp</b>{" "}
              <MessageCircle className="h-4 w-4 fill-[#25D366] text-[#25D366]" />
            </p>
            <div className="anim-fade-up mt-5 hidden items-center gap-3 border-l-4 border-rosa pl-4 md:flex" style={{ animationDelay: "500ms" }}>
              <span className="text-lg tracking-wider text-sol">★★★★★</span>
              <span className="text-[15px] text-tinta-70">
                Hecha para <b className="font-semibold text-tinta">juntar reseñas</b> en Google Maps
              </span>
            </div>
          </div>

          <div className="anim-fade-up relative mx-auto flex items-center lg:mr-14" style={{ animationDelay: "250ms" }}>
            {/* Reseñas de ejemplo, escalonadas a la izquierda del celular */}
            <div className="relative z-10 -mr-6 hidden h-[420px] w-[270px] lg:block">
              {[
                { n: "S", c: "bg-red-500", q: "Muy rica la comida, la atención de 10.", w: "Sofía L.", pos: "left-6 top-2" },
                { n: "J", c: "bg-blue-600", q: "Todo muy rico y el lugar es hermoso.", w: "Javier R.", pos: "left-0 top-[150px]" },
                { n: "M", c: "bg-purple-600", q: "Increíble el lugar, volveré pronto.", w: "Mariana D.", pos: "left-10 top-[292px]" },
              ].map((r, i) => (
                <div
                  key={r.w}
                  className={`float-y absolute w-[236px] rounded-xl bg-white p-3 shadow-[0_10px_30px_-12px_rgba(27,17,48,0.3)] ring-1 ring-tinta/5 ${r.pos}`}
                  style={{ animationDelay: `${i * 0.8}s` }}
                >
                  <div className="flex gap-2.5">
                    <span className={`mt-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ${r.c}`}>{r.n}</span>
                    <div>
                      <p className="text-[10px] tracking-widest text-sol">★★★★★</p>
                      <p className="text-[13px] font-medium leading-snug">“{r.q}”</p>
                      <p className="mt-0.5 text-[10.5px] text-tinta-70">
                        {r.w} · <span className="text-red-500">📍</span> Google Maps
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <p className="absolute bottom-0 left-10 text-[10px] text-tinta-70/70">Reseñas de ejemplo</p>
            </div>
            <div className="relative">
              <div className="absolute -right-12 -top-6 rotate-[8deg] rounded-2xl md:-right-10 md:-top-10 bg-white p-2.5 shadow-[0_20px_40px_-15px_rgba(27,17,48,0.35)] ring-1 ring-tinta/5 sm:-right-24">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/qr-demo.svg" alt="Código QR de la demo" className="h-20 w-20 sm:h-[120px] sm:w-[120px]" />
              </div>
              <div className="relative">
                <HeroPhone />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Cartas de ejemplo ───── */}
      <section className="pb-12">
        <Reveal className="px-5 text-center">
          <h2 className="text-[20px] font-medium text-tinta-70 md:text-[22px]">
            Así se ve tu carta en <span className="font-bold text-tinta">anto</span>
            <span className="font-bold text-rosa">jo</span>
          </h2>
          <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-tinta-70">
            Taquerías, cafeterías, bares y restaurantes que quieren vender más con su carta QR.
          </p>
        </Reveal>
        <Reveal className="mx-auto mt-8 max-w-[1210px]" delay={100}>
          <Showcase />
        </Reveal>
      </section>

      {/* ───── Cifras ───── */}
      <section className="relative z-10 -mt-14 px-5 pb-28">
        <Reveal className="card-dark mx-auto max-w-[900px] overflow-hidden rounded-[24px] text-white shadow-2xl shadow-tinta/30">
          <div className="grid divide-y divide-white/10 md:grid-cols-3 md:divide-x md:divide-y-0">
            {stats.map((s) => (
              <div key={s.n} className="px-7 py-6">
                <p className="text-[28px] font-bold leading-none text-rosa md:text-[30px]">{s.n}</p>
                <p className="mt-2 text-[14px] font-semibold">{s.t}</p>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/60">{s.d}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ───── Funciones ───── */}
      <section id="funciones" className="scroll-mt-32 px-5 pb-28">
        <Reveal className="mx-auto text-center">
          <h2 className="mx-auto max-w-[280px] text-[22px] font-semibold leading-tight tracking-tight sm:max-w-none md:text-[38px]">Muestra mejor. Vende más. Junta reseñas.</h2>
        </Reveal>
        <div className="mx-auto mt-10 grid max-w-[1210px] gap-4 md:grid-cols-2 lg:grid-cols-12">
          {features.map((f, i) => (
            <Reveal
              key={f.pill}
              delay={(i % 3) * 110}
              className={`relative overflow-hidden rounded-[20px] p-5 md:rounded-[24px] md:p-8 ${SPANS[i]} ${
                f.dark ? "card-dark text-white shadow-2xl shadow-tinta/25" : `tint-${f.tint ?? "rosa"} shadow-[0_20px_50px_-35px_rgba(27,17,48,0.35)]`
              }`}
            >
              <div className={f.aside ? "grid items-start gap-6 lg:grid-cols-[1fr_auto]" : ""}>
                <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-medium ${
                    f.dark ? "bg-white/10 text-rosa-100" : "pill"
                  }`}
                >
                  <f.icon className="h-3.5 w-3.5" /> {f.pill}
                </span>
                {f.soon && <span className="rounded-full bg-sol/20 px-2.5 py-1 text-[11px] font-bold text-amber-700">Próximamente</span>}
              </div>
              <h3 className={`mt-4 font-medium leading-[1.25] tracking-tight ${i === 0 ? "max-w-[420px] text-[21px] md:text-[30px]" : "text-[19px] md:text-[24px]"}`}>{f.title}</h3>
              <p className={`mt-2.5 max-w-[460px] text-[12.5px] leading-[1.7] md:text-[13.5px] ${f.dark ? "text-white/70" : "text-tinta-70"}`}>{f.text}</p>
              {f.mock}
                </div>
                {f.aside && <div className="lg:pt-10">{f.aside}</div>}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───── Precios ───── */}
      <section id="precios" className="scroll-mt-32 px-5 pb-28">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-[20px] font-bold leading-tight tracking-tight md:text-[40px]">
            Elige el plan que acompaña el <span className="text-rosa">crecimiento de tu negocio</span>
          </h2>
          <p className="mt-3 text-[12.5px] leading-relaxed text-tinta-70 md:mt-4 md:text-[17px]">
            Empieza gratis con una carta QR profesional o desbloquea todo para vender, medir y hacer crecer tu marca.
          </p>
        </Reveal>
        <Pricing />
      </section>

      {/* ───── Blog ───── */}
      <section className="px-5 pb-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-rosa">Blog</p>
          <h2 className="mt-2 text-[22px] font-semibold leading-tight tracking-tight md:text-[44px]">Guías para vender más con tu carta QR</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-tinta-70">
            Ideas prácticas para atraer clientes desde Google, mejorar tu carta digital y juntar reseñas sin depender de publicidad.
          </p>
        </Reveal>
        <div className="mx-auto mt-10 grid max-w-[1210px] gap-6 md:grid-cols-3">
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
      <section id="preguntas" className="scroll-mt-32 px-5 pb-28">
        <Reveal className="mx-auto max-w-3xl">
          <h2 className="text-center text-[22px] font-semibold tracking-tight md:text-[44px]">
            Preguntas <span className="text-rosa">frecuentes</span>
          </h2>
          <p className="mt-3 text-center text-[16px] text-tinta-70">Resolvemos tus dudas sobre tu nueva carta estilo TikTok.</p>
          <div className="mx-auto mt-8 max-w-[690px] divide-y divide-tinta/10 md:mt-10">
            {faqs.map(([q, a]) => (
              <details key={q} name="preguntas" className="group py-3 md:py-3.5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[13px] text-tinta md:text-[15px]">
                  {q}
                  <span className="text-[16px] font-light text-tinta-70 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 pr-8 text-[12.5px] leading-relaxed text-tinta-70 md:text-[14px]">{a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ───── Llamado final ───── */}
      <section className="px-5 pb-28">
        <Reveal className="relative mx-auto max-w-[1210px] overflow-hidden rounded-[28px] bg-gradient-to-br from-white via-[#fbf8f5] to-[#f6f1ec] px-6 py-10 shadow-[0_30px_80px_-40px_rgba(27,17,48,0.35)] ring-1 ring-tinta/5 md:px-12 md:py-14">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-tinta/[0.03]" />
          <div className="pointer-events-none absolute -bottom-20 right-40 h-48 w-48 rounded-full bg-tinta/[0.03]" />
          <div className="relative grid items-center gap-8 md:grid-cols-[1.15fr_1fr] md:gap-12">
            <div>
              <h2 className="max-w-[520px] text-[24px] font-semibold leading-[1.1] tracking-tight md:text-[46px]">
                Comienza tu prueba gratuita <span className="text-rosa">hoy</span>
              </h2>
              <p className="mt-3 text-[13px] leading-relaxed text-tinta-70 md:text-[17px]">Crea tu primera carta digital sin compromiso.</p>
              <Link href="/registro" className="btn-primary mt-6 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-[13px] font-semibold text-white md:mt-8 md:text-[15px]">
                Crear menú gratis <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="mt-3 text-[11.5px] text-tinta-70 md:mt-4 md:text-[13px]">No se requiere tarjeta de crédito.</p>
            </div>
            <div className="space-y-1 rounded-[24px] bg-white/85 p-4 shadow-[0_20px_50px_-25px_rgba(27,17,48,0.35)] backdrop-blur md:p-5">
              {["Lista en 5 minutos", "Sin tarjeta", "Soporte por WhatsApp"].map((t, i) => (
                <p key={t} className={`rounded-2xl px-5 py-3.5 text-[13px] font-semibold md:py-4 md:text-[15px] ${i === 1 ? "bg-gradient-to-r from-transparent via-sol/20 to-sol/10" : ""}`}>
                  {t}
                </p>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ───── Partners ───── */}
      <section id="partners" className="scroll-mt-32 px-4 pb-28 md:px-5">
        <Reveal className="relative mx-auto max-w-[1210px] overflow-hidden rounded-[28px] bg-gradient-to-br from-[#fffaf8] via-white to-rosa-50 px-6 py-12 text-center ring-1 ring-rosa-100 md:px-14 md:py-16">
          <span aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-rosa/[0.04]" />
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/antojo-logo.svg" alt="Antojo" className="mx-auto h-12 w-auto md:h-[60px]" />
            <p className="mt-1 text-[12px] font-bold uppercase tracking-[0.4em] text-tinta md:text-[15px]">Partners</p>
            <h2 className="mx-auto mt-6 max-w-[680px] text-[26px] font-semibold leading-[1.15] tracking-tight md:mt-8 md:text-[44px]">
              Conecta restaurantes. <span className="text-rosa">Genera ingresos todos los meses.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-[600px] text-[14px] leading-relaxed text-tinta-70 md:mt-5 md:text-[17px]">
              Si trabajas con negocios gastronómicos, suma Antojo a tu propuesta y crezcamos juntos.
            </p>
            <p className="mx-auto mt-4 max-w-[480px] text-[13px] leading-relaxed text-tinta-70 md:text-[15px]">
              Tú nos conectas. Nuestro equipo se encarga de la demo, el cierre y la implementación. Tú recibes tu comisión cada mes.
            </p>
            <a
              href={waLink("¡Hola! Estoy interesado/a en ser partner de Antojo. Quisiera conocer cómo empezar.")}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 inline-flex items-center gap-2.5 rounded-full bg-rosa px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_12px_28px_-10px_rgba(225,29,46,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-rosa-600 hover:shadow-[0_16px_32px_-10px_rgba(225,29,46,0.7)] md:text-[16px]"
            >
              <WhatsAppIcon className="h-5 w-5" /> Quiero ser partner{" "}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <p className="mt-4 text-[12px] text-tinta-70 md:text-[13px]">Hablemos por WhatsApp y te contamos cómo empezar.</p>
          </div>
        </Reveal>
      </section>

      <Footer />
      <ClienteAIWidget />
    </div>
  );
}
