"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Gift, LayoutGrid, Settings, ShoppingBag, UtensilsCrossed } from "lucide-react";

const tabs = [
  { href: "/panel", label: "Resumen", icon: LayoutGrid },
  { href: "/panel/productos", label: "Platillos", icon: UtensilsCrossed },
  { href: "/panel/metricas", label: "Métricas", icon: BarChart3 },
  { href: "/panel/ajustes", label: "Ajustes", icon: Settings },
];
const soon = [
  { label: "Lealtad", icon: Gift },
  { label: "Pedidos", icon: ShoppingBag },
];

export function PanelTabs() {
  const path = usePathname();
  return (
    <nav className="no-scrollbar -mb-px flex gap-1 overflow-x-auto">
      {tabs.map((t) => {
        const active = t.href === "/panel" ? path === "/panel" : path.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`inline-flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-3 text-sm font-semibold ${
              active ? "border-rosa text-rosa" : "border-transparent text-tinta-70 hover:text-tinta"
            }`}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </Link>
        );
      })}
      {soon.map((t) => (
        <span key={t.label} className="inline-flex shrink-0 cursor-not-allowed items-center gap-1.5 px-3 py-3 text-sm font-semibold text-tinta-70/50">
          <t.icon className="h-4 w-4" /> {t.label}
          <span className="rounded-full bg-sol/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">Pronto</span>
        </span>
      ))}
    </nav>
  );
}
