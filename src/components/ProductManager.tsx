"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ImagePlus, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { createCategory, deleteCategory, deleteProduct, saveProduct, type ProductInput } from "@/app/actions";
import type { Category, Product } from "@/lib/types";
import { formatMoney } from "@/lib/utils";

export const TAGS = ["Picante", "Vegetariano", "Nuevo", "Recomendado", "Sin gluten"];

type Props = {
  userId: string;
  currency: string;
  categories: Category[];
  products: Product[];
};

export function ProductManager({ userId, currency, categories, products }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [newCat, setNewCat] = useState("");
  const [pending, start] = useTransition();
  const [catError, setCatError] = useState<string | null>(null);

  function addCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCat.trim()) return;
    start(async () => {
      const res = await createCategory(newCat);
      if ("error" in res && res.error) setCatError(res.error);
      else {
        setNewCat("");
        setCatError(null);
        router.refresh();
      }
    });
  }

  const grouped = [
    ...categories.map((c) => ({ id: c.id, name: c.name, items: products.filter((p) => p.category_id === c.id) })),
    { id: null, name: "Sin categoría", items: products.filter((p) => !p.category_id || !categories.some((c) => c.id === p.category_id)) },
  ].filter((g) => g.id !== null || g.items.length > 0);

  return (
    <div className="space-y-6">
      {/* Categorías */}
      <section className="rounded-3xl border border-rosa-100 bg-white p-5">
        <h2 className="font-bold">Categorías</h2>
        <p className="text-sm text-tinta-70">Aparecen como pestañas arriba de tu carta.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((c) => (
            <span key={c.id} className="inline-flex items-center gap-1.5 rounded-full bg-rosa-50 py-1.5 pl-3 pr-2 text-sm font-medium">
              {c.name}
              <button
                aria-label={`Borrar ${c.name}`}
                onClick={() =>
                  confirm(`¿Borrar la categoría "${c.name}"? Los platillos se quedan sin categoría.`) &&
                  start(async () => {
                    await deleteCategory(c.id);
                    router.refresh();
                  })
                }
                className="rounded-full p-0.5 text-tinta-70 hover:bg-white hover:text-red-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
          <form onSubmit={addCategory} className="flex items-center gap-1">
            <input
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              placeholder="Nueva categoría (ej. Tacos)"
              className="w-52 rounded-full border border-tinta/15 px-3 py-1.5 text-sm outline-none focus:border-rosa"
            />
            <button disabled={pending} className="rounded-full bg-tinta p-2 text-white disabled:opacity-50" aria-label="Agregar categoría">
              <Plus className="h-4 w-4" />
            </button>
          </form>
        </div>
        {catError && <p className="mt-2 text-sm text-red-600">{catError}</p>}
      </section>

      {/* Productos */}
      <section className="rounded-3xl border border-rosa-100 bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold">Platillos</h2>
            <p className="text-sm text-tinta-70">{products.length} en tu carta</p>
          </div>
          <button
            onClick={() => setEditing({ category_id: categories[0]?.id ?? null, tags: [], is_available: true })}
            className="inline-flex items-center gap-1.5 rounded-full bg-rosa px-4 py-2 text-sm font-semibold text-white hover:bg-rosa-600"
          >
            <Plus className="h-4 w-4" /> Agregar platillo
          </button>
        </div>

        {products.length === 0 ? (
          <div className="mt-6 rounded-2xl border-2 border-dashed border-rosa-100 p-10 text-center text-tinta-70">
            Aún no tienes platillos. Agrega el primero, con foto o video para que se antoje.
          </div>
        ) : (
          <div className="mt-5 space-y-6">
            {grouped.map((g) => (
              <div key={g.id ?? "none"}>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-tinta-70">{g.name}</h3>
                {g.items.length === 0 ? (
                  <p className="text-sm text-tinta-70">Sin platillos todavía.</p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {g.items.map((p) => (
                      <div key={p.id} className="flex gap-3 rounded-2xl border border-tinta/10 p-3">
                        <Thumb p={p} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold">{p.name}</p>
                          <p className="text-sm font-bold text-rosa">{formatMoney(p.price, currency)}</p>
                          {!p.is_available && <p className="text-xs font-medium text-amber-600">Agotado</p>}
                          <div className="mt-1 flex gap-1">
                            <button onClick={() => setEditing(p)} className="rounded-full p-1.5 text-tinta-70 hover:bg-rosa-50 hover:text-rosa" aria-label="Editar">
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                confirm(`¿Borrar "${p.name}"?`) &&
                                start(async () => {
                                  await deleteProduct(p.id);
                                  router.refresh();
                                })
                              }
                              className="rounded-full p-1.5 text-tinta-70 hover:bg-red-50 hover:text-red-600"
                              aria-label="Borrar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {editing && (
        <ProductForm
          userId={userId}
          initial={editing}
          categories={categories}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

function Thumb({ p }: { p: Partial<Product> }) {
  return (
    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-rosa-50">
      {p.media_url ? (
        p.media_type === "video" ? (
          <video src={p.media_url} muted playsInline className="h-full w-full object-cover" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.media_url} alt="" className="h-full w-full object-cover" />
        )
      ) : (
        <div className="flex h-full items-center justify-center text-2xl">🍽️</div>
      )}
    </div>
  );
}

function ProductForm({
  userId,
  initial,
  categories,
  onClose,
  onSaved,
}: {
  userId: string;
  initial: Partial<Product>;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<ProductInput>({
    id: initial.id,
    name: initial.name ?? "",
    description: initial.description ?? "",
    price: initial.price ?? 0,
    category_id: initial.category_id ?? null,
    media_url: initial.media_url ?? null,
    media_type: initial.media_type ?? null,
    tags: initial.tags ?? [],
    is_available: initial.is_available ?? true,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(file: File) {
    const isVideo = file.type.startsWith("video/");
    const max = isVideo ? 50 : 8;
    if (file.size > max * 1024 * 1024) {
      setError(`El archivo pesa más de ${max} MB.`);
      return;
    }
    setUploading(true);
    setError(null);
    const supabase = createClient();
    const ext = file.name.split(".").pop()?.toLowerCase() ?? (isVideo ? "mp4" : "jpg");
    const path = `${userId}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(path, file, { contentType: file.type, upsert: false });
    if (error) setError("No se pudo subir el archivo.");
    else {
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      setForm((f) => ({ ...f, media_url: data.publicUrl, media_type: isVideo ? "video" : "image" }));
    }
    setUploading(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await saveProduct(form);
    setSaving(false);
    if ("error" in res && res.error) setError(res.error);
    else onSaved();
  }

  const input = "w-full rounded-xl border border-tinta/15 px-3.5 py-2.5 outline-none focus:border-rosa focus:ring-2 focus:ring-rosa/20";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-tinta/50 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-6 sm:rounded-3xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold">{form.id ? "Editar platillo" : "Nuevo platillo"}</h2>
          <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-crema" aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 grid gap-6 sm:grid-cols-[1fr_200px]">
          <div className="space-y-3">
            <label className="block text-sm font-medium">
              Nombre
              <input required className={`${input} mt-1`} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Tacos al pastor (3)" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm font-medium">
                Precio
                <input
                  required
                  type="number"
                  min={0}
                  step="0.5"
                  className={`${input} mt-1`}
                  value={Number.isFinite(form.price) ? form.price : ""}
                  onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
                />
              </label>
              <label className="block text-sm font-medium">
                Categoría
                <select className={`${input} mt-1`} value={form.category_id ?? ""} onChange={(e) => setForm({ ...form, category_id: e.target.value || null })}>
                  <option value="">Sin categoría</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block text-sm font-medium">
              Descripción
              <textarea
                rows={3}
                className={`${input} mt-1`}
                value={form.description ?? ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Con piña, cebolla, cilantro y salsa de la casa."
              />
            </label>
            <div>
              <p className="text-sm font-medium">Etiquetas</p>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {TAGS.map((t) => {
                  const on = form.tags?.includes(t);
                  return (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setForm({ ...form, tags: on ? form.tags!.filter((x) => x !== t) : [...(form.tags ?? []), t] })}
                      className={`rounded-full px-3 py-1 text-sm ${on ? "bg-rosa text-white" : "bg-crema text-tinta-70"}`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" checked={form.is_available} onChange={(e) => setForm({ ...form, is_available: e.target.checked })} className="h-4 w-4 accent-rosa" />
              Disponible (si lo desmarcas aparece como agotado)
            </label>
          </div>

          <div>
            <p className="text-sm font-medium">Foto o video</p>
            <label className="mt-1 flex aspect-[9/16] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-rosa-100 bg-crema text-center text-sm text-tinta-70 hover:border-rosa">
              {uploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-rosa" />
              ) : form.media_url ? (
                form.media_type === "video" ? (
                  <video src={form.media_url} autoPlay muted loop playsInline className="h-full w-full object-cover" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.media_url} alt="" className="h-full w-full object-cover" />
                )
              ) : (
                <>
                  <ImagePlus className="h-7 w-7 text-rosa" />
                  <span className="mt-2 px-3">Sube una foto vertical o un video corto</span>
                </>
              )}
              <input type="file" accept="image/*,video/*" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
            </label>
            {form.media_url && (
              <button type="button" onClick={() => setForm({ ...form, media_url: null, media_type: null })} className="mt-2 text-sm text-red-600">
                Quitar archivo
              </button>
            )}
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-full px-5 py-2.5 font-semibold hover:bg-crema">
            Cancelar
          </button>
          <button disabled={saving || uploading} className="rounded-full bg-rosa px-6 py-2.5 font-semibold text-white hover:bg-rosa-600 disabled:opacity-60">
            {saving ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
