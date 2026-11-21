import { BusinessForm } from "@/components/BusinessForm";
import { updateRestaurant } from "@/app/actions";
import { requireRestaurant } from "@/lib/data";
import { siteUrl } from "@/lib/utils";

export const metadata = { title: "Ajustes" };

export default async function Page() {
  const r = await requireRestaurant();
  return (
    <div className="max-w-2xl">
      <h1 className="mb-4 text-2xl font-extrabold">Datos del negocio</h1>
      <BusinessForm action={updateRestaurant} restaurant={r} submitLabel="Guardar cambios" siteUrl={siteUrl()} />
      <p className="mt-4 text-sm text-tinta-70">
        Ojo: si cambias la dirección de tu carta, el QR que ya imprimiste dejará de funcionar.
      </p>
    </div>
  );
}
