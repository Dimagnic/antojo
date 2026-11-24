import Link from "next/link";
import { CeroBadge } from "@/components/CeroBadge";
import { Logo } from "@/components/Logo";
import { SITE } from "@/lib/site";

// Tus datos de contacto y redes se editan en src/lib/site.ts
const CONTACT = SITE;
// QR de tu asistente de ClienteAI (guárdalo en public/brand/clienteai-qr.png)
const ASSISTANT_QR = "/brand/clienteai-qr.png";
// ─────────────────────────────────────────────────────────────────────────

const product = [
  { href: "/#funciones", label: "Funciones" },
  { href: "/#precios", label: "Precios" },
  { href: "/#preguntas", label: "Preguntas frecuentes" },
  { href: "/demo", label: "Ver demo" },
  { href: "/blog", label: "Blog" },
];

const account = [
  { href: "/registro", label: "Crear mi carta" },
  { href: "/entrar", label: "Entrar a mi panel" },
];

export function Footer() {
  const waText = encodeURIComponent("Hola, quiero información de Antojo");
  return (
    <footer className="bg-tinta text-white">
      {/* Franja decorativa tipo papel picado */}
      <div
        aria-hidden
        className="h-6 w-full"
        style={{
          backgroundColor: "#e11d2e",
          backgroundImage:
            "radial-gradient(circle at 12px 0, #1b1130 7px, transparent 7.5px), radial-gradient(circle at 12px 24px, #ffb800 3px, transparent 3.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-xs leading-relaxed text-white/75">
            Cartas digitales con QR para restaurantes en México. Más pedidos por WhatsApp y más reseñas en Google.
          </p>
          <div className="mt-6 flex gap-3">
            {CONTACT.instagram && (
              <SocialLink href={CONTACT.instagram} label="Instagram">
                <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm5-3.2a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z" />
              </SocialLink>
            )}
            {CONTACT.facebook && (
              <SocialLink href={CONTACT.facebook} label="Facebook">
                <path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1v2.4H7.6V14h2.7v8h3.2Z" />
              </SocialLink>
            )}
            {CONTACT.whatsapp && (
              <SocialLink href={`https://wa.me/${CONTACT.whatsapp}?text=${waText}`} label="WhatsApp">
                <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
              </SocialLink>
            )}
          </div>
        </div>

        <FooterColumn title="Producto" links={product} />

        <div>
          <FooterColumn title="Tu cuenta" links={account} />
          {(CONTACT.whatsapp || CONTACT.email) && (
            <ul className="mt-3 space-y-3 text-white/85">
              {CONTACT.whatsapp && (
                <li>
                  <a href={`https://wa.me/${CONTACT.whatsapp}?text=${waText}`} target="_blank" rel="noopener noreferrer" className="hover:text-sol">
                    WhatsApp +{CONTACT.whatsapp}
                  </a>
                </li>
              )}
              {CONTACT.email && (
                <li>
                  <a href={`mailto:${CONTACT.email}`} className="hover:text-sol">
                    {CONTACT.email}
                  </a>
                </li>
              )}
            </ul>
          )}
        </div>

        <div>
          <h3 className="text-xl font-bold">Asistente virtual</h3>
          <div className="mt-5 w-36 overflow-hidden rounded-lg bg-white shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ASSISTANT_QR} alt="Código QR del asistente virtual de Antojo" className="w-full" />
          </div>
          <p className="mt-4 max-w-[220px] text-sm text-white/65">Escanea el código y chatea con nuestro asistente.</p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl border-t border-white/10 px-5 py-6">
        <p className="text-sm text-white/55">
          Precios en pesos mexicanos. Los planes de pago se renuevan cada mes y puedes cancelar cuando quieras.
        </p>
        <div className="mt-5 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-white/80">© {new Date().getFullYear()} Antojo. Hecho en México.</p>
          <CeroBadge />
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h3 className="text-xl font-bold">{title}</h3>
      <ul className="mt-5 space-y-3 text-white/85">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="hover:text-sol">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white/85 hover:border-sol hover:text-sol"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
        {children}
      </svg>
    </a>
  );
}
