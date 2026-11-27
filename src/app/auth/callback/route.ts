import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const raw = searchParams.get("next") ?? "/panel";
  const next = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/panel";

  // Google o Supabase devolvieron un error (proveedor apagado, permiso cancelado, enlace vencido…)
  const oauthError = searchParams.get("error_description") ?? searchParams.get("error");
  if (oauthError) {
    const kind = /provider|not enabled/i.test(oauthError) ? "google" : "auth";
    return NextResponse.redirect(`${origin}/entrar?error=${kind}`);
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }
  return NextResponse.redirect(`${origin}/entrar?error=auth`);
}
