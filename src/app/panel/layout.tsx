import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { Logo } from "@/components/Logo";
import { PanelTabs } from "@/components/PanelTabs";
import { signOut } from "@/app/actions";
import { requireRestaurant } from "@/lib/data";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const r = await requireRestaurant();
  return (
    <div className="min-h-screen">
      <header className="border-b border-rosa-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3">
          <div className="flex items-center gap-4">
            <Logo href="/panel" />
            <span className="hidden h-6 w-px bg-tinta/10 sm:block" />
            <span className="hidden truncate font-semibold sm:block">{r.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/m/${r.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-full bg-tinta px-4 py-2 text-sm font-semibold text-white hover:bg-tinta/90"
            >
              Ver mi carta <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <form action={signOut}>
              <button className="rounded-full p-2 text-tinta-70 hover:bg-rosa-50 hover:text-rosa" aria-label="Cerrar sesión" title="Cerrar sesión">
                <LogOut className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-5">
          <PanelTabs />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
    </div>
  );
}
