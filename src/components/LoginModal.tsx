"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Lock, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Mode = "entrar" | "registro";
const LAST_KEY = "antojo:ultimo-acceso";

/** Ventana de inicio de sesión sobre la página, como la de LaCarta. */
export function LoginModal({ open, onClose, initialMode = "entrar" }: { open: boolean; onClose: () => void; initialMode?: Mode }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [last, setLast] = useState<string | null>(null);
  const passRef = useRef<HTMLInputElement>(null);

  // Reinicia la ventana cada vez que se abre
  useEffect(() => {
    if (!open) return;
    /* eslint-disable react-hooks/set-state-in-effect -- reinicio al abrir la ventana */
    setMode(initialMode);
    setStep("email");
    setPassword("");
    setError(null);
    setInfo(null);
    try {
      setLast(localStorage.getItem(LAST_KEY));
    } catch {}
    /* eslint-enable react-hooks/set-state-in-effect */
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, initialMode, onClose]);

  useEffect(() => {
    if (step === "password") passRef.current?.focus();
  }, [step]);

  if (!open) return null;
  const isLogin = mode === "entrar";

  function remember(v: string) {
    try {
      localStorage.setItem(LAST_KEY, v);
    } catch {}
  }

  async function google() {
    remember("google");
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${isLogin ? "/panel" : "/onboarding"}` },
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (step === "email") {
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setError("Escribe un correo electrónico válido.");
      return setStep("password");
    }
    setLoading(true);
    const supabase = createClient();
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return setError("Correo o contraseña incorrectos.");
      remember("email");
      onClose();
      router.push("/panel");
      router.refresh();
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding` },
      });
      setLoading(false);
      if (error) return setError(error.message);
      remember("email");
      if (data.session) {
        onClose();
        router.push("/onboarding");
        router.refresh();
      } else setInfo("Te enviamos un correo para confirmar tu cuenta. Ábrelo para continuar.");
    }
  }

  return (
    <div className="anim-fade fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/45 px-4 pt-[9vh]" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
        onClick={(e) => e.stopPropagation()}
        className="anim-pop relative w-full max-w-[400px] overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_-12px_rgba(0,0,0,0.45)] ring-1 ring-black/5"
      >
        <button onClick={onClose} aria-label="Cerrar" className="absolute right-3 top-3 rounded-md p-1.5 text-tinta-70 transition hover:bg-crema hover:text-tinta">
          <X className="h-4 w-4" />
        </button>

        <div className="px-8 pb-7 pt-8">
          {step === "password" && (
            <button onClick={() => setStep("email")} aria-label="Volver" className="absolute left-3 top-3 rounded-md p-1.5 text-tinta-70 transition hover:bg-crema">
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <h2 id="login-title" className="text-center text-[17px] font-bold text-tinta">
            {step === "password" ? (isLogin ? "Escribe tu contraseña" : "Crea tu contraseña") : isLogin ? "Entrar" : "Crea tu cuenta"}
          </h2>
          <p className="mt-1 text-center text-[13px] text-tinta-70">
            {step === "password" ? email : isLogin ? "para continuar a Antojo" : "para crear tu carta en Antojo"}
          </p>

          {step === "email" && (
            <>
              <div className="relative mt-7">
                {last === "google" && (
                  <span className="absolute -top-2.5 right-2 z-10 rounded-full bg-white px-2 py-0.5 text-[10.5px] text-tinta-70 ring-1 ring-tinta/15">Último uso</span>
                )}
                <button
                  type="button"
                  onClick={google}
                  className="flex w-full items-center justify-center gap-3 rounded-lg bg-white py-2.5 text-[14px] font-medium text-tinta shadow-[0_1px_2px_rgba(0,0,0,0.08)] ring-1 ring-tinta/15 transition hover:bg-crema"
                >
                  <svg viewBox="0 0 48 48" className="h-[18px] w-[18px]" aria-hidden>
                    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
                    <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
                    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
                    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
                  </svg>
                  Continuar con Google
                </button>
              </div>
              <div className="my-6 flex items-center gap-4 text-[13px] text-tinta-70">
                <span className="h-px flex-1 bg-tinta/10" /> o <span className="h-px flex-1 bg-tinta/10" />
              </div>
            </>
          )}

          <form onSubmit={submit} className={step === "password" ? "mt-7" : ""}>
            {step === "email" ? (
              <label className="block text-[13px] font-medium text-tinta">
                Correo electrónico
                <input
                  type="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ingresa tu correo electrónico"
                  className="mt-2 w-full rounded-lg px-3.5 py-2.5 text-[13.5px] font-normal outline-none ring-1 ring-tinta/15 transition placeholder:text-tinta-70/70 focus:ring-2 focus:ring-rosa/40"
                />
              </label>
            ) : (
              <label className="block text-[13px] font-medium text-tinta">
                Contraseña
                <input
                  ref={passRef}
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isLogin ? "Tu contraseña" : "Mínimo 6 caracteres"}
                  className="mt-2 w-full rounded-lg px-3.5 py-2.5 text-[13.5px] font-normal outline-none ring-1 ring-tinta/15 transition focus:ring-2 focus:ring-rosa/40"
                />
              </label>
            )}
            {error && <p className="mt-2 text-[12.5px] text-red-600">{error}</p>}
            {info && <p className="mt-2 text-[12.5px] text-emerald-700">{info}</p>}
            <button
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-to-b from-[#3a3840] to-[#1f1d24] py-2.5 text-[14px] font-semibold text-white shadow-[0_2px_6px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.12)] transition hover:brightness-110 disabled:opacity-60"
            >
              {loading ? "Un momento…" : "Continuar"} <span className="text-[10px]">▸</span>
            </button>
          </form>
        </div>

        <div className="border-t border-tinta/10 bg-[#f7f7f8] py-4 text-center text-[13px] text-tinta-70">
          {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
          <button
            onClick={() => {
              setMode(isLogin ? "registro" : "entrar");
              setStep("email");
              setError(null);
              setInfo(null);
            }}
            className="font-semibold text-tinta hover:text-rosa"
          >
            {isLogin ? "Regístrate" : "Entra aquí"}
          </button>
        </div>
        <div className="flex items-center justify-center gap-1.5 border-t border-tinta/10 bg-[#f7f7f8] py-3 text-[11.5px] text-tinta-70">
          <Lock className="h-3 w-3" /> Protegido por <b className="font-semibold text-tinta">anto</b>
          <b className="-ml-1.5 font-semibold text-rosa">jo</b>
        </div>
      </div>
    </div>
  );
}
