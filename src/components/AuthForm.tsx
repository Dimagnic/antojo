"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function AuthForm({ mode }: { mode: "entrar" | "registro" }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/panel";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const isLogin = mode === "entrar";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);
    const supabase = createClient();
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError("Correo o contraseña incorrectos.");
      else {
        router.push(next);
        router.refresh();
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding` },
      });
      if (error) setError(error.message);
      else if (data.session) {
        router.push("/onboarding");
        router.refresh();
      } else setInfo("Te enviamos un correo para confirmar tu cuenta. Ábrelo para continuar.");
    }
    setLoading(false);
  }

  async function withGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(isLogin ? next : "/onboarding")}` },
    });
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold">{isLogin ? "Qué gusto verte" : "Crea tu carta gratis"}</h1>
      <p className="mt-1 text-sm text-tinta-70">
        {isLogin ? "Entra a tu panel de Antojo." : "En 5 minutos tienes tu QR listo."}
      </p>

      <button
        type="button"
        onClick={withGoogle}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-tinta/15 py-2.5 text-sm font-semibold hover:bg-crema"
      >
        <svg viewBox="0 0 48 48" className="h-4 w-4" aria-hidden>
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
          <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
          <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
        </svg>
        Continuar con Google
      </button>

      <div className="my-5 flex items-center gap-3 text-xs text-tinta-70">
        <span className="h-px flex-1 bg-tinta/10" /> o con tu correo <span className="h-px flex-1 bg-tinta/10" />
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          type="email"
          required
          placeholder="tu@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-tinta/15 px-4 py-2.5 outline-none focus:border-rosa focus:ring-2 focus:ring-rosa/20"
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Contraseña (mínimo 6)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-tinta/15 px-4 py-2.5 outline-none focus:border-rosa focus:ring-2 focus:ring-rosa/20"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        {info && <p className="text-sm text-emerald-700">{info}</p>}
        <button
          disabled={loading}
          className="w-full rounded-full bg-rosa py-3 font-semibold text-white hover:bg-rosa-600 disabled:opacity-60"
        >
          {loading ? "Un momento…" : isLogin ? "Entrar" : "Crear cuenta"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-tinta-70">
        {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
        <Link href={isLogin ? "/onboarding" : "/entrar"} className="font-semibold text-rosa">
          {isLogin ? "Regístrate" : "Entra aquí"}
        </Link>
      </p>
    </div>
  );
}
