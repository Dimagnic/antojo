"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

const links = [
  { href: "/#funciones", label: "Funciones" },
  { href: "/demo", label: "Demo" },
  { href: "/#preguntas", label: "Preguntas" },
  { href: "/#precios", label: "Precios" },
  { href: "/#partners", label: "Ser partner" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      {/* Barra promocional */}
      <div className="bg-gradient-to-r from-rosa via-[#f2362f] to-[#ff6a3d] shadow-[0_6px_24px_-8px_rgba(225,29,46,0.6)]">
        <div className="mx-auto flex max-w-[1210px] items-center justify-center gap-3 px-4 py-1.5 text-[11.5px] font-semibold text-white md:py-2 md:text-[13px]">
          <span>Prueba Pro 14 días gratis</span>
          <Link
            href="/registro"
            className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-bold text-rosa transition hover:scale-105"
          >
            Activar ahora <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Encabezado flotante: se vuelve translúcido al bajar */}
      <div className="px-3 pt-2.5 sm:px-6 md:pt-3">
        <div
          className={`mx-auto max-w-[1210px] rounded-[28px] transition-all duration-500 ${
            scrolled || open
              ? "bg-white/65 shadow-[0_8px_32px_-12px_rgba(27,17,48,0.25)] ring-1 ring-white/60 backdrop-blur-xl backdrop-saturate-150"
              : "bg-white shadow-[0_10px_40px_-16px_rgba(27,17,48,0.2)]"
          }`}
        >
          <div className="flex items-center justify-between px-4 py-2.5 md:px-5 md:py-3.5">
            <Link href="/" aria-label="Antojo, inicio" onClick={() => setOpen(false)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/antojo-logo.svg" alt="Antojo" className="h-6 w-auto md:h-8" />
            </Link>

            <nav className="hidden items-center gap-7 text-[15px] font-medium text-tinta lg:flex">
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="transition hover:text-rosa">
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="hidden items-center gap-2 lg:flex">
              <Link href="/entrar" className="rounded-full px-4 py-2 text-[15px] font-medium hover:bg-rosa-50">
                Iniciar sesión
              </Link>
              <Link href="/registro" className="btn-primary rounded-full px-5 py-2.5 text-[15px] font-semibold text-white">
                Probar gratis
              </Link>
            </div>

            <button
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
              className="rounded-full p-1.5 text-tinta lg:hidden"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Menú hamburguesa */}
        <div
          className={`mx-auto mt-2 max-w-[1210px] origin-top overflow-hidden rounded-3xl bg-white shadow-[0_20px_50px_-20px_rgba(27,17,48,0.35)] ring-1 ring-tinta/5 transition-all duration-300 lg:hidden ${
            open ? "max-h-[480px] scale-100 opacity-100" : "pointer-events-none max-h-0 scale-95 opacity-0"
          }`}
        >
          <nav className="flex flex-col px-3 pt-3">
            {links.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3.5 text-[16px] font-semibold text-tinta transition hover:bg-rosa-50"
                style={{ transitionDelay: `${i * 30}ms` }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mx-4 mt-2 border-t border-tinta/10" />
          <div className="space-y-2 p-4">
            <Link
              href="/entrar"
              onClick={() => setOpen(false)}
              className="block rounded-2xl py-3 text-center font-medium text-tinta-70 ring-1 ring-tinta/10"
            >
              Iniciar sesión
            </Link>
            <Link href="/registro" onClick={() => setOpen(false)} className="btn-primary block rounded-2xl py-3 text-center font-semibold text-white">
              Probar gratis
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
