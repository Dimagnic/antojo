import { redirect } from "next/navigation";

// Crear cuenta empieza armando la carta, como en LaCarta.
export default function Page() {
  redirect("/onboarding");
}
