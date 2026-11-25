import { redirect } from "next/navigation";

// Página anterior del alta; ahora los platillos se editan desde el panel.
export default function Page() {
  redirect("/panel/productos");
}
