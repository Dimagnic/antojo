import type { SupabaseClient } from "@supabase/supabase-js";

type AuthSettings = {
  external?: Record<string, boolean>;
  mailer_autoconfirm?: boolean;
  disable_signup?: boolean;
};

let cache: Promise<AuthSettings | null> | null = null;

/** Lee la configuración pública de Supabase Auth (qué proveedores están activos). */
export function authSettings(): Promise<AuthSettings | null> {
  if (!cache) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    cache = fetch(`${url}/auth/v1/settings`, { headers: { apikey: key ?? "" } })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null);
  }
  return cache;
}

export const GOOGLE_OFF = "El acceso con Google todavía no está activado. Usa tu correo y una contraseña.";

/** Inicia sesión / registro con Google; si Google no está activo devuelve un mensaje en vez de mostrar el error de Supabase. */
export async function startGoogle(
  supabase: SupabaseClient,
  redirectTo: string,
  link = false,
): Promise<string | null> {
  const s = await authSettings();
  if (s?.external && s.external.google === false) return GOOGLE_OFF;
  const { error } = link
    ? await supabase.auth.linkIdentity({ provider: "google", options: { redirectTo } })
    : await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo } });
  if (error) return /not enabled|unsupported provider/i.test(error.message) ? GOOGLE_OFF : authError(error.message);
  return null;
}

/** Traduce los errores de Supabase Auth a mensajes claros en español. */
export function authError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("invalid login credentials")) return "Correo o contraseña incorrectos.";
  if (m.includes("email not confirmed")) return "Aún no confirmas tu correo. Abre el enlace que te enviamos para activar tu cuenta.";
  if (m.includes("already registered") || m.includes("already been registered") || m.includes("already exists"))
    return "Ese correo ya tiene una cuenta. Inicia sesión.";
  if (m.includes("rate limit") || m.includes("too many") || m.includes("security purposes"))
    return "Hiciste demasiados intentos. Espera un minuto e inténtalo de nuevo.";
  if (m.includes("error sending") || m.includes("confirmation email"))
    return "No pudimos enviar el correo de confirmación. Inténtalo más tarde o entra con Google.";
  if (m.includes("password") && (m.includes("at least") || m.includes("weak") || m.includes("short")))
    return "La contraseña es muy débil. Usa al menos 6 caracteres.";
  if (m.includes("signups not allowed") || m.includes("signup is disabled")) return "Por ahora no se aceptan registros nuevos.";
  if (m.includes("invalid") && m.includes("email")) return "Escribe un correo electrónico válido.";
  if (m.includes("anonymous")) return "No se pudo crear tu cuenta temporal. Crea tu cuenta con correo para publicar.";
  if (m.includes("fetch") || m.includes("network")) return "No hay conexión. Revisa tu internet e inténtalo de nuevo.";
  return "Algo salió mal. Inténtalo de nuevo.";
}
