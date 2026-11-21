"use client";

import { useActionState } from "react";
import { MapPin, MessageCircle, Store } from "lucide-react";
import type { ActionState } from "@/app/actions";
import type { Restaurant } from "@/lib/types";

type Props = {
  action: (state: ActionState, form: FormData) => Promise<ActionState>;
  restaurant?: Restaurant | null;
  submitLabel: string;
  siteUrl?: string;
};

const input =
  "mt-1 w-full rounded-xl border border-tinta/15 px-3.5 py-2.5 outline-none focus:border-rosa focus:ring-2 focus:ring-rosa/20";

export function BusinessForm({ action, restaurant, submitLabel, siteUrl }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const editing = Boolean(restaurant);

  return (
    <form action={formAction} className="space-y-4 rounded-3xl border border-rosa-100 bg-white p-6">
      <label className="block text-sm font-medium">
        <span className="inline-flex items-center gap-1.5"><Store className="h-4 w-4 text-rosa" /> Nombre del negocio *</span>
        <input name="name" required defaultValue={restaurant?.name} placeholder="Ej. Tacos Don Beto" className={input} />
      </label>

      {editing && (
        <label className="block text-sm font-medium">
          Dirección de tu carta
          <div className="mt-1 flex items-center rounded-xl border border-tinta/15 focus-within:border-rosa">
            <span className="pl-3.5 text-sm text-tinta-70">{siteUrl}/m/</span>
            <input name="slug" defaultValue={restaurant?.slug} className="w-full rounded-xl px-1 py-2.5 outline-none" />
          </div>
        </label>
      )}

      {!editing && (
        <label className="block text-sm font-medium">
          País
          <select name="country" defaultValue="MX" className={input}>
            <option value="MX">México</option>
            <option value="US">Estados Unidos</option>
            <option value="CO">Colombia</option>
            <option value="PE">Perú</option>
            <option value="AR">Argentina</option>
            <option value="ES">España</option>
          </select>
        </label>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          <span className="inline-flex items-center gap-1.5"><MessageCircle className="h-4 w-4 text-[#25D366]" /> WhatsApp para pedidos</span>
          <input name="whatsapp" inputMode="tel" defaultValue={restaurant?.whatsapp ?? ""} placeholder="52 229 123 4567" className={input} />
          <span className="mt-1 block text-xs text-tinta-70">Con lada de país (52 para México).</span>
        </label>
        <label className="block text-sm font-medium">
          <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-rosa" /> Enlace de Google Maps</span>
          <input name="maps_url" type="url" defaultValue={restaurant?.maps_url ?? ""} placeholder="https://maps.app.goo.gl/..." className={input} />
          <span className="mt-1 block text-xs text-tinta-70">Para que tus clientes te dejen reseña.</span>
        </label>
      </div>

      <details className="rounded-xl bg-crema p-3 text-sm">
        <summary className="cursor-pointer font-medium">Opcional: Place ID de Google (enlace directo a la reseña)</summary>
        <p className="mt-2 text-tinta-70">
          Búscalo en el &ldquo;Place ID Finder&rdquo; de Google. Empieza con <code>ChIJ</code>. Con él, el botón abre directo la
          ventana para calificar.
        </p>
        <input name="google_place_id" defaultValue={restaurant?.google_place_id ?? ""} placeholder="ChIJ..." className={input} />
      </details>

      {editing && (
        <>
          <label className="block text-sm font-medium">
            Logo (URL de imagen, opcional)
            <input name="logo_url" type="url" defaultValue={restaurant?.logo_url ?? ""} className={input} />
          </label>
          <label className="block text-sm font-medium">
            Instagram del negocio (opcional)
            <input name="instagram_url" type="url" defaultValue={restaurant?.instagram_url ?? ""} placeholder="https://instagram.com/tu-negocio" className={input} />
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" name="game_enabled" defaultChecked={restaurant?.game_enabled ?? true} className="h-4 w-4 accent-rosa" />
            Mostrar &ldquo;Juega y gana&rdquo; (ruleta de premios) en la carta
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" name="review_prompt" defaultChecked={restaurant?.review_prompt} className="h-4 w-4 accent-rosa" />
            Invitar a los clientes a dejar reseña en Google
          </label>
        </>
      )}

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.ok && <p className="text-sm text-emerald-700">¡Cambios guardados!</p>}
      <div className="flex justify-end">
        <button disabled={pending} className="rounded-full bg-rosa px-6 py-3 font-semibold text-white hover:bg-rosa-600 disabled:opacity-60">
          {pending ? "Guardando…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
