import { redirect } from "next/navigation";
import { BusinessForm } from "@/components/BusinessForm";
import { Stepper } from "@/components/Stepper";
import { createRestaurant } from "@/app/actions";
import { getMyRestaurant } from "@/lib/data";

export const metadata = { title: "Tu negocio" };

export default async function Page() {
  if (await getMyRestaurant()) redirect("/onboarding/platillos");
  return (
    <>
      <Stepper current={0} />
      <h1 className="text-3xl font-extrabold">Cuéntanos de tu negocio</h1>
      <p className="mb-6 mt-1 text-tinta-70">Con esto armamos tu carta y tu botón de reseñas.</p>
      <BusinessForm action={createRestaurant} submitLabel="Siguiente →" />
    </>
  );
}
