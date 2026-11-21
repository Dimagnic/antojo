import { ProductManager } from "@/components/ProductManager";
import { getMenu, requireRestaurant, requireUser } from "@/lib/data";

export const metadata = { title: "Platillos" };

export default async function Page() {
  const user = await requireUser();
  const r = await requireRestaurant();
  const { categories, products } = await getMenu(r.id);
  return <ProductManager userId={user.id} currency={r.currency} categories={categories} products={products} />;
}
