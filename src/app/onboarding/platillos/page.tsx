import Link from "next/link";
import { ProductManager } from "@/components/ProductManager";
import { Stepper } from "@/components/Stepper";
import { getMenu, requireRestaurant, requireUser } from "@/lib/data";

export const metadata = { title: "Tus platillos" };

export default async function Page() {
  const user = await requireUser();
  const restaurant = await requireRestaurant();
  const { categories, products } = await getMenu(restaurant.id);
  return (
    <>
      <Stepper current={1} />
      <h1 className="text-3xl font-extrabold">Agrega tus platillos</h1>
      <p className="mb-6 mt-1 text-tinta-70">
        Empieza con tus 3 o 4 más vendidos. Siempre puedes agregar más desde tu panel.
      </p>
      <ProductManager userId={user.id} currency={restaurant.currency} categories={categories} products={products} />
      <div className="mt-8 flex items-center justify-between">
        <Link href="/panel/ajustes" className="text-sm font-semibold text-tinta-70">Editar datos del negocio</Link>
        <Link href="/panel?bienvenida=1" className="rounded-full bg-rosa px-6 py-3 font-semibold text-white hover:bg-rosa-600">
          Terminar y ver mi QR →
        </Link>
      </div>
    </>
  );
}
