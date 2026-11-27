"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Box,
  ChevronDown,
  CircleHelp,
  ClipboardCheck,
  Eye,
  Heart,
  LayoutGrid,
  MapPin,
  Menu,
  MessageCircle,
  Pencil,
  RefreshCw,
  Share2,
  Store,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { LoginModal } from "@/components/LoginModal";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { createClient } from "@/lib/supabase/client";
import {
  COUNTRIES,
  deleteMedia,
  emptyDraft,
  getMedia,
  loadDraft,
  prepareImage,
  putMedia,
  saveDraft,
  type Draft,
  type DraftProduct,
} from "@/lib/draft";
import { publishDraft } from "@/lib/publish";
import { waLink } from "@/lib/site";

const blankProduct = (category: string): DraftProduct => ({
  id: crypto.randomUUID(),
  name: "",
  price: null,
  category,
  description: "",
  mediaId: null,
  mediaType: null,
});

/** URL temporal para mostrar fotos/videos guardados en el navegador */
function useMediaUrl(id: string | null) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!id) return;
    let u: string | null = null;
    let alive = true;
    getMedia(id).then((b) => {
      if (b && alive) {
        u = URL.createObjectURL(b);
        setUrl(u);
      }
    });
    return () => {
      alive = false;
      if (u) URL.revokeObjectURL(u);
      setUrl(null);
    };
  }, [id]);
  return id ? url : null;
}

export function OnboardingWizard() {
  const router = useRouter();
  const params = useSearchParams();
  const supabase = useMemo(() => createClient(), []);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [ready, setReady] = useState(false);
  const [publishing, setPublishing] = useState<string | null>(null);
  const [signup, setSignup] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carga el borrador; si ya tiene cuenta con negocio, lo manda a su panel
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- leer el borrador del navegador */
    setDraft(loadDraft());
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: r } = await supabase.from("restaurants").select("id").eq("owner_id", data.user.id).limit(1).maybeSingle();
      if (r && params.get("publicar") !== "1") router.replace("/panel");
    });
  }, [supabase, router, params]);

  const update = useCallback((fn: (d: Draft) => Draft) => {
    setDraft((d) => {
      const n = fn(d);
      saveDraft(n);
      return n;
    });
  }, []);

  const runPublish = useCallback(async () => {
    setError(null);
    setPublishing("Preparando tu carta");
    const started = Date.now();
    try {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        // Igual que LaCarta: se guarda primero y la cuenta se crea después
        const anon = await supabase.auth.signInAnonymously();
        if (anon.error) {
          setPublishing(null);
          setSignup(true);
          return;
        }
      }
      await publishDraft(supabase, loadDraft(), setPublishing);
      const wait = Math.max(0, 2600 - (Date.now() - started));
      setTimeout(() => {
        router.push("/panel?nueva=1");
        router.refresh();
      }, wait);
    } catch {
      setPublishing(null);
      setError("No pudimos publicar tu carta. Revisa tu conexión e intenta de nuevo.");
    }
  }, [supabase, router]);

  // Regreso de Google al crear la cuenta en este paso
  useEffect(() => {
    if (ready && params.get("publicar") === "1") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- continuar la publicación tras el regreso
      runPublish();
    }
  }, [ready, params, runPublish]);

  if (!ready) return null;
  if (publishing) return <Creating status={publishing} />;

  const step = draft.step;
  return (
    <main className="min-h-screen bg-white px-4 pb-24 pt-6 md:pt-8">
      <Stepper step={step} />
      <div className="mx-auto mt-6 max-w-[525px]">
        {step === 1 && <BusinessStep draft={draft} update={update} />}
        {step === 2 && <ProductsStep draft={draft} update={update} />}
        {step === 3 && <ReadyStep draft={draft} update={update} onPublish={runPublish} error={error} />}
      </div>

      <a
        href={waLink("Hola, ¿me ayudan a terminar mi carta de Antojo?")}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[12px] font-medium text-tinta shadow-[0_6px_20px_-6px_rgba(10,10,10,0.35)] ring-1 ring-tinta/10 transition hover:-translate-y-0.5"
      >
        Ayúdame a terminar este menú
        <span className="relative text-[#25D366]">
          <WhatsAppIcon className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-[#25D366] ring-2 ring-white" />
        </span>
      </a>

      <LoginModal
        open={signup}
        onClose={() => setSignup(false)}
        initialMode="registro"
        googleNext="/onboarding?publicar=1"
        onAuthed={() => {
          setSignup(false);
          runPublish();
        }}
      />
    </main>
  );
}

/* ───────────── Indicador de pasos ───────────── */

function Stepper({ step }: { step: number }) {
  const icons = [Store, Box, ClipboardCheck];
  return (
    <div className="mx-auto flex max-w-[500px] items-center">
      {icons.map((Icon, i) => (
        <div key={i} className="flex flex-1 items-center last:flex-none">
          <span
            className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full transition-colors duration-500 ${
              i < step ? "bg-rosa text-white shadow-[0_4px_12px_-4px_rgba(225,29,46,0.7)]" : "bg-white text-tinta-70 ring-1 ring-tinta/15"
            }`}
          >
            <Icon className="h-[15px] w-[15px]" />
          </span>
          {i < 2 && (
            <span className="relative h-px flex-1 bg-tinta/15">
              <span className="absolute inset-y-0 left-0 bg-rosa transition-all duration-700" style={{ width: i + 1 < step ? "100%" : "0%" }} />
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

const card = "rounded-2xl bg-white p-5 shadow-[0_10px_40px_-16px_rgba(10,10,10,0.25)] ring-1 ring-tinta/10 md:p-6";
const input =
  "w-full rounded-lg bg-white px-3 py-2 text-[13px] outline-none ring-1 ring-tinta/15 transition placeholder:text-tinta-70/60 focus:ring-2 focus:ring-rosa/50 [&:not(:placeholder-shown)]:bg-[#eef3fd]";
const label = "flex items-center gap-1.5 text-[13px] font-medium text-tinta";

function Help({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex">
      <CircleHelp className="h-3.5 w-3.5 text-tinta-70" />
      <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 w-48 -translate-x-1/2 rounded-md bg-tinta px-2 py-1.5 text-[11px] font-normal leading-snug text-white opacity-0 transition group-hover:opacity-100">
        {text}
      </span>
    </span>
  );
}

/* ───────────── Paso 1: Detalles del negocio ───────────── */

function BusinessStep({ draft, update }: { draft: Draft; update: (fn: (d: Draft) => Draft) => void }) {
  const b = draft.business;
  const [err, setErr] = useState(false);
  const [open, setOpen] = useState(false);
  const country = COUNTRIES.find((c) => c.code === b.country) ?? COUNTRIES[0];
  const set = (k: keyof Draft["business"], v: string) => update((d) => ({ ...d, business: { ...d.business, [k]: v } }));

  return (
    <div className={`${card} anim-fade-up`}>
      <h1 className="flex items-center gap-2 text-[17px] font-bold">
        <Store className="h-[18px] w-[18px] text-rosa" /> Detalles del negocio
      </h1>

      <div className="mt-5 space-y-4">
        <div>
          <p className={label}>
            Nombre del negocio <Help text="Así aparecerá en tu carta y en tu QR." /> <span className="text-rosa">*</span>
          </p>
          <div className="relative mt-1.5">
            <Store className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-tinta-70/60" />
            <input
              value={b.name}
              onChange={(e) => {
                set("name", e.target.value);
                setErr(false);
              }}
              placeholder="Ej: Café de las Flores"
              className={`${input} pl-8 ${err ? "!ring-2 !ring-rosa" : ""}`}
            />
          </div>
          {err && <p className="mt-1 text-[11.5px] text-rosa">Escribe el nombre de tu negocio.</p>}
        </div>

        <div className="relative">
          <p className={label}>
            <span className="text-tinta-70">🌐</span> País del negocio <span className="text-rosa">*</span>
          </p>
          <button type="button" onClick={() => setOpen((o) => !o)} className={`${input} mt-1.5 flex items-center justify-between !bg-white text-left`}>
            <span>
              {country.flag} {country.name}
            </span>
            <ChevronDown className="h-4 w-4 text-tinta-70" />
          </button>
          {open && (
            <ul className="anim-fade absolute inset-x-0 top-full z-20 mt-1 max-h-64 overflow-y-auto rounded-lg bg-white py-1 shadow-xl ring-1 ring-tinta/10">
              {COUNTRIES.map((c) => (
                <li key={c.code}>
                  <button
                    type="button"
                    onClick={() => {
                      set("country", c.code);
                      setOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-[13px] hover:bg-crema ${c.code === b.country ? "font-semibold" : ""}`}
                  >
                    {c.flag} {c.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className={`${label} justify-between`}>
              <span className="flex items-center gap-1.5">
                <WhatsAppIcon className="h-4 w-4 text-[#25D366]" /> WhatsApp <Help text="Aquí te llegarán los pedidos de tus clientes." />
              </span>
              <span className="text-[11px] font-normal text-tinta-70">Opcional</span>
            </p>
            <div className="relative mt-1.5">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-tinta-70">+{country.dial}</span>
              <input
                inputMode="tel"
                value={b.whatsapp}
                onChange={(e) => set("whatsapp", e.target.value.replace(/[^\d ]/g, ""))}
                placeholder="Tu número"
                className={input}
                style={{ paddingLeft: `${22 + country.dial.length * 9}px` }}
              />
            </div>
          </div>
          <div>
            <p className={`${label} justify-between`}>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-[#ea4335]" /> Ubicación en Maps <Help text="Con este enlace tus clientes te dejan reseña en Google." />
              </span>
              <span className="text-[11px] font-normal text-tinta-70">Opcional</span>
            </p>
            <input value={b.maps} onChange={(e) => set("maps", e.target.value)} placeholder="Pegar link de Google Maps" className={`${input} mt-1.5`} />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => (b.name.trim() ? update((d) => ({ ...d, step: 2 })) : setErr(true))}
          className="inline-flex items-center gap-2 rounded-lg bg-rosa px-4 py-2 text-[14px] font-semibold text-white shadow-[0_6px_16px_-6px_rgba(225,29,46,0.7)] transition hover:bg-rosa-600"
        >
          Siguiente <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ───────────── Paso 2: Agregar productos ───────────── */

function ProductsStep({ draft, update }: { draft: Draft; update: (fn: (d: Draft) => Draft) => void }) {
  const [form, setForm] = useState<DraftProduct>(() => blankProduct(draft.categories[1] ?? draft.categories[0] ?? "Principales"));
  const [editing, setEditing] = useState(false);
  const [nameErr, setNameErr] = useState(false);
  const [hint, setHint] = useState(false);
  const [preview, setPreview] = useState<DraftProduct | null>(null);
  const [catOpen, setCatOpen] = useState(false);
  const [newCat, setNewCat] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const mediaUrl = useMediaUrl(form.mediaId);

  const dirty = Boolean(form.name.trim() || form.mediaId || form.description.trim() || form.price);

  async function onFile(file?: File) {
    if (!file) return;
    const isVideo = file.type.startsWith("video/");
    if (!isVideo && !file.type.startsWith("image/")) return;
    if (file.size > (isVideo ? 50 : 15) * 1024 * 1024) return alert(isVideo ? "El video debe pesar menos de 50 MB." : "La foto debe pesar menos de 15 MB.");
    const blob = isVideo ? file : await prepareImage(file);
    const id = crypto.randomUUID();
    await putMedia(id, blob);
    if (form.mediaId && !editing) await deleteMedia(form.mediaId);
    setForm((f) => ({ ...f, mediaId: id, mediaType: isVideo ? "video" : "image" }));
  }

  function save() {
    if (!form.name.trim()) return setNameErr(true);
    update((d) => ({
      ...d,
      products: editing ? d.products.map((p) => (p.id === form.id ? form : p)) : [...d.products, form],
    }));
    setForm(blankProduct(form.category));
    setEditing(false);
    setHint(false);
  }

  async function remove(p: DraftProduct) {
    if (p.mediaId) await deleteMedia(p.mediaId);
    update((d) => ({ ...d, products: d.products.filter((x) => x.id !== p.id) }));
    if (editing && form.id === p.id) {
      setForm(blankProduct(form.category));
      setEditing(false);
    }
  }

  function next() {
    if (dirty && !editing) return setHint(true);
    if (!draft.products.length) return setHint(true);
    update((d) => ({ ...d, step: 3 }));
  }

  return (
    <div className={`${card} anim-fade-up`}>
      <h1 className="flex items-center gap-2 text-[17px] font-bold">
        <Box className="h-[18px] w-[18px] text-rosa" /> Agregar productos
      </h1>

      <div className="mt-5 rounded-xl p-3 ring-1 ring-tinta/10 md:p-3.5">
        <div className="grid grid-cols-[1fr_1fr] gap-3 sm:grid-cols-[1fr_1fr_1fr]">
          <div className="col-span-2 sm:col-span-1">
            <p className={label}>
              Nombre <span className="text-rosa">*</span>
            </p>
            <input
              value={form.name}
              maxLength={80}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                setNameErr(false);
              }}
              placeholder="Ej: Hamburguesa"
              className={`${input} mt-1.5 ${nameErr ? "!ring-2 !ring-rosa" : ""}`}
            />
            <p className="mt-0.5 text-right text-[10px] text-tinta-70">{form.name.length}/80</p>
          </div>
          <div>
            <p className={label}>Precio</p>
            <div className="relative mt-1.5">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-tinta-70">$</span>
              <input
                inputMode="decimal"
                value={form.price ?? ""}
                onChange={(e) => {
                  const v = e.target.value.replace(",", ".").replace(/[^\d.]/g, "");
                  setForm({ ...form, price: v === "" ? null : Number(v) });
                }}
                className={`${input} pl-6`}
                placeholder=" "
              />
            </div>
          </div>
          <div className="relative">
            <p className={label}>Categoría</p>
            <button type="button" onClick={() => setCatOpen((o) => !o)} className={`${input} mt-1.5 flex items-center justify-between !bg-white text-left`}>
              <span className="truncate">{form.category}</span>
              <ChevronDown className="h-4 w-4 shrink-0 text-tinta-70" />
            </button>
            {catOpen && (
              <div className="anim-fade absolute right-0 top-full z-20 mt-1 w-52 rounded-lg bg-white py-1 shadow-xl ring-1 ring-tinta/10">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const n = newCat.trim();
                    if (!n) return;
                    update((d) => ({ ...d, categories: d.categories.includes(n) ? d.categories : [...d.categories, n] }));
                    setForm({ ...form, category: n });
                    setNewCat("");
                    setCatOpen(false);
                  }}
                  className="flex items-center gap-1 border-b border-tinta/5 px-2 pb-1.5 pt-1"
                >
                  <input value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="+ Crear categoría" className="w-full rounded px-1.5 py-1 text-[12.5px] text-rosa outline-none placeholder:text-rosa" />
                </form>
                {draft.categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setForm({ ...form, category: c });
                      setCatOpen(false);
                    }}
                    className={`block w-full px-3 py-1.5 text-left text-[12.5px] hover:bg-crema ${c === form.category ? "bg-crema font-semibold" : ""}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-1">
          <p className={label}>Descripción</p>
          <textarea
            rows={1}
            maxLength={250}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className={`${input} mt-1.5 resize-none`}
            placeholder=" "
          />
          <p className="mt-0.5 text-right text-[10px] text-tinta-70">{form.description.length}/250</p>
        </div>

        <div>
          <p className={label}>Contenido</p>
          {form.mediaId ? (
            <div className="mt-1.5 inline-flex items-center gap-2 rounded-lg border border-dashed border-rosa/40 bg-rosa-50/40 p-2">
              <span className="h-9 w-9 overflow-hidden rounded-md bg-tinta">
                {mediaUrl &&
                  (form.mediaType === "video" ? (
                    <video src={mediaUrl} muted className="h-full w-full object-cover" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={mediaUrl} alt="" className="h-full w-full object-cover" />
                  ))}
              </span>
              <button type="button" onClick={() => setPreview(form)} className="flex items-center gap-1 rounded-md bg-rosa-100 px-2 py-1 text-[11px] font-medium text-rosa-600">
                <Eye className="h-3 w-3" /> Ver
              </button>
              <button type="button" onClick={() => fileRef.current?.click()} className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-tinta-70 hover:bg-white">
                <RefreshCw className="h-3 w-3" /> Cambiar
              </button>
              <button
                type="button"
                aria-label="Quitar"
                onClick={async () => {
                  if (!editing && form.mediaId) await deleteMedia(form.mediaId);
                  setForm({ ...form, mediaId: null, mediaType: null });
                }}
                className="rounded-md p-1 text-rosa hover:bg-white"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDrag(true);
              }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDrag(false);
                onFile(e.dataTransfer.files?.[0]);
              }}
              className={`mt-1.5 flex w-full flex-col items-center justify-center rounded-lg border border-dashed px-4 py-3.5 text-center text-[12px] text-tinta-70 transition ${
                drag ? "border-rosa bg-rosa-50" : "border-tinta/20 bg-[#fafafa] hover:border-rosa/50 hover:bg-rosa-50/40"
              }`}
            >
              <Upload className="mb-1 h-4 w-4" />
              Arrastra una imagen o video, o haz clic para
              <br />
              seleccionar un archivo
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*,video/*" hidden onChange={(e) => onFile(e.target.files?.[0] ?? undefined)} />
        </div>

        <button
          type="button"
          onClick={save}
          className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg bg-[#178a3e] py-2 text-[13px] font-semibold text-white transition hover:bg-[#13763a]"
        >
          {editing ? "Guardar cambios" : "Agregar producto +"}
        </button>
      </div>

      {draft.products.length === 0 ? (
        <p className="mt-4 text-[13px] text-tinta-70">Aún no agregas productos.</p>
      ) : (
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {draft.products.map((p) => (
            <ProductChip
              key={p.id}
              p={p}
              onView={() => setPreview(p)}
              onEdit={() => {
                setForm(p);
                setEditing(true);
                setHint(false);
              }}
              onDelete={() => remove(p)}
            />
          ))}
        </div>
      )}

      <div className="relative mt-6 flex items-center justify-between">
        <button
          onClick={() => update((d) => ({ ...d, step: 1 }))}
          className="inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-[14px] font-medium ring-1 ring-tinta/15 transition hover:bg-crema"
        >
          <ArrowLeft className="h-4 w-4" /> Atrás
        </button>
        {hint && (
          <p className="anim-pop absolute bottom-full right-0 mb-2 flex max-w-[260px] items-start gap-1.5 rounded-lg bg-white px-3 py-2 text-[11.5px] leading-snug shadow-lg ring-1 ring-tinta/10">
            <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-rosa" />
            {draft.products.length === 0 && !dirty
              ? "Agrega al menos un producto para continuar."
              : "Toca «Agregar producto +» para agregar el producto antes de continuar."}
          </p>
        )}
        <button
          onClick={next}
          className="inline-flex items-center gap-2 rounded-lg bg-rosa px-4 py-2 text-[14px] font-semibold text-white shadow-[0_6px_16px_-6px_rgba(225,29,46,0.7)] transition hover:bg-rosa-600"
        >
          Siguiente <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {preview && <PreviewModal p={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}

function ProductChip({ p, onView, onEdit, onDelete }: { p: DraftProduct; onView: () => void; onEdit: () => void; onDelete: () => void }) {
  const url = useMediaUrl(p.mediaId);
  return (
    <div className="anim-pop relative flex gap-2.5 rounded-lg bg-white p-2 ring-1 ring-tinta/10">
      <span className="h-11 w-11 shrink-0 overflow-hidden rounded-md bg-crema">
        {url &&
          (p.mediaType === "video" ? (
            <video src={url} muted className="h-full w-full object-cover" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="h-full w-full object-cover" />
          ))}
      </span>
      <div className="min-w-0">
        <p className="truncate pr-5 text-[12.5px] font-semibold">{p.name}</p>
        <p className="text-[11px] text-tinta-70">${p.price ?? 0}</p>
        <div className="mt-1 flex gap-1">
          <button onClick={onView} className="rounded-full bg-rosa px-2 py-0.5 text-[10px] font-semibold text-white">
            Ver
          </button>
          <button onClick={onEdit} className="flex items-center gap-0.5 rounded-full bg-crema px-2 py-0.5 text-[10px] font-medium text-tinta-70">
            <Pencil className="h-2.5 w-2.5" /> Editar
          </button>
        </div>
      </div>
      <button onClick={onDelete} aria-label="Eliminar" className="absolute right-1.5 top-1.5 rounded p-0.5 text-rosa hover:bg-rosa-50">
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/* ───────────── Vista previa tipo TikTok ───────────── */

function Slide({ p, compact = false }: { p: DraftProduct; compact?: boolean }) {
  const url = useMediaUrl(p.mediaId);
  return (
    <div className="relative h-full w-full overflow-hidden bg-tinta text-white">
      {url ? (
        p.mediaType === "video" ? (
          <video src={url} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={p.name} className="kb-hero absolute inset-0 h-full w-full object-cover" />
        )
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-rosa-600 via-tinta to-black text-5xl">🍽️</div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />
      <div className={`absolute inset-x-2.5 top-2.5 flex items-center justify-between ${compact ? "" : "top-3"}`}>
        <span className="rounded-full bg-white px-2 py-0.5 text-[8px] font-semibold text-tinta">{p.category}</span>
      </div>
      <div className="absolute inset-x-2.5 top-8 flex justify-between">
        <LayoutGrid className="h-3.5 w-3.5" />
        <Menu className="h-3.5 w-3.5" />
      </div>
      <div className="absolute bottom-20 right-2 flex flex-col items-center gap-2.5">
        <Heart className="h-4 w-4" />
        <MessageCircle className="h-4 w-4" />
        <Share2 className="h-4 w-4" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-3 pr-8">
        <span className="rounded-full bg-rosa px-2 py-0.5 text-[10px] font-bold">${p.price ?? 0}</span>
        <p className="mt-1 text-[13px] font-bold leading-tight">{p.name}</p>
        {p.description && <p className="mt-0.5 line-clamp-2 text-[9.5px] text-white/80">{p.description}</p>}
      </div>
    </div>
  );
}

function PreviewModal({ p, onClose }: { p: DraftProduct; onClose: () => void }) {
  return (
    <div className="anim-fade fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="anim-pop relative aspect-[9/16] w-[260px] overflow-hidden rounded-[1.6rem] shadow-2xl">
        <Slide p={p} />
        <button onClick={onClose} className="absolute right-2.5 top-2.5 z-10 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-[10px] font-semibold text-white">
          Salir <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

/* ───────────── Paso 3: ¡Tu carta ya está lista! ───────────── */

function ReadyStep({
  draft,
  update,
  onPublish,
  error,
}: {
  draft: Draft;
  update: (fn: (d: Draft) => Draft) => void;
  onPublish: () => void;
  error: string | null;
}) {
  const [i, setI] = useState(0);
  const n = draft.products.length;
  useEffect(() => {
    if (n < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 3200);
    return () => clearInterval(t);
  }, [n]);
  const p = draft.products[i % Math.max(1, n)];

  return (
    <div className="anim-fade-up text-center">
      <h1 className="text-[26px] font-bold tracking-tight md:text-[30px]">
        ¡Tu carta ya está <span className="text-rosa">lista</span>!
      </h1>
      <p className="mt-1.5 text-[13px] text-tinta-70 md:text-[14px]">Después de publicar, puedes seguir cargando y editando tu carta.</p>

      <div className="mx-auto mt-5 w-[200px] rounded-[2rem] bg-[#18151d] p-[6px] shadow-[0_30px_60px_-25px_rgba(10,10,10,0.6)]">
        <div className="aspect-[9/17.5] overflow-hidden rounded-[1.65rem]">{p && <Slide key={p.id} p={p} compact />}</div>
      </div>

      {error && <p className="mt-4 text-[13px] text-rosa">{error}</p>}
      <button
        onClick={onPublish}
        className="mx-auto mt-6 flex w-full max-w-[380px] items-center justify-center gap-2 rounded-xl bg-rosa py-3 text-[15px] font-semibold text-white shadow-[0_10px_24px_-8px_rgba(225,29,46,0.6)] transition hover:-translate-y-0.5 hover:bg-rosa-600"
      >
        Publicar y ver mi carta online <ArrowUpRight className="h-4 w-4" />
      </button>
      <button onClick={() => update((d) => ({ ...d, step: 2 }))} className="mx-auto mt-4 flex items-center gap-1.5 text-[12.5px] text-tinta-70 hover:text-tinta">
        <ArrowLeft className="h-3.5 w-3.5" /> Volver a editar productos
      </button>
    </div>
  );
}

/* ───────────── Pantalla «Creando tu carta» ───────────── */

function Creating({ status }: { status: string }) {
  const cells = [0, 1, 1, 0, 1, 2, 1, 2, 2, 1, 0, 1, 1, 0, 1, 2, 1, 2, 2, 1, 0, 1, 2, 1, 0, 1, 2, 1, 1, 0, 0, 1, 1, 0, 1, 2];
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#fff4f1] to-white px-6 text-center" style={{ backgroundImage: "radial-gradient(rgb(10 10 10 / 0.05) 1px, transparent 1px)", backgroundSize: "16px 16px" }}>
      <div className="relative h-[150px] w-[150px] p-3">
        {["left-0 top-0 border-l-[3px] border-t-[3px] rounded-tl-xl", "right-0 top-0 border-r-[3px] border-t-[3px] rounded-tr-xl", "bottom-0 left-0 border-b-[3px] border-l-[3px] rounded-bl-xl", "bottom-0 right-0 border-b-[3px] border-r-[3px] rounded-br-xl"].map((c) => (
          <span key={c} className={`absolute h-6 w-6 border-rosa ${c}`} />
        ))}
        <div className="grid h-full grid-cols-6 gap-[3px] rounded-md bg-white/70 p-1">
          {cells.map((v, k) => (
            <span
              key={k}
              className="rounded-[3px] animate-pulse"
              style={{ background: v === 2 ? "#e11d2e" : v === 1 ? "#ffb4a8" : "#ffe7e2", animationDelay: `${(k % 7) * 160}ms` }}
            />
          ))}
        </div>
        <span className="scan-line absolute inset-x-3 h-[2px] bg-rosa shadow-[0_0_12px_2px_rgba(225,29,46,0.5)]" />
      </div>
      <h1 className="mt-8 text-[22px] font-bold tracking-tight">Creando tu carta digital</h1>
      <p className="mt-1.5 max-w-[260px] text-[14px] leading-relaxed text-tinta-70">Transformando tu negocio en una experiencia única</p>
      <p className="mt-6 flex items-center gap-2 rounded-full bg-white px-4 py-2 font-mono text-[12px] uppercase tracking-wider text-tinta shadow-[0_6px_20px_-8px_rgba(10,10,10,0.3)] ring-1 ring-tinta/5">
        <span className="h-2 w-2 animate-pulse rounded-full bg-rosa" /> {status}
      </p>
      <div className="mt-4 flex gap-1.5">
        <span className="h-1 w-6 rounded-full bg-rosa" />
        <span className="h-1 w-1 animate-pulse rounded-full bg-rosa/40" />
        <span className="h-1 w-1 animate-pulse rounded-full bg-rosa/40" style={{ animationDelay: "200ms" }} />
        <span className="h-1 w-1 animate-pulse rounded-full bg-rosa/40" style={{ animationDelay: "400ms" }} />
      </div>
    </main>
  );
}
