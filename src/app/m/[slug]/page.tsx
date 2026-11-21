import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MenuFeed } from "@/components/MenuFeed";
import { getPublicMenu } from "@/lib/data";
import { reviewUrl } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPublicMenu(slug);
  if (!data) return { title: "Carta no encontrada" };
  const img = data.products.find((p) => p.media_type === "image" && p.media_url)?.media_url;
  return {
    title: `Carta de ${data.restaurant.name}`,
    description: `Mira la carta de ${data.restaurant.name} y pide por WhatsApp.`,
    openGraph: img ? { images: [img] } : undefined,
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const data = await getPublicMenu(slug);
  if (!data) notFound();
  const { restaurant, categories, products } = data;
  return (
    <MenuFeed
      restaurant={{
        id: restaurant.id,
        name: restaurant.name,
        whatsapp: restaurant.whatsapp,
        currency: restaurant.currency,
        logo_url: restaurant.logo_url,
        is_open: restaurant.is_open,
        review: restaurant.review_prompt ? reviewUrl(restaurant) : null,
      }}
      categories={categories.filter((c) => products.some((p) => p.category_id === c.id))}
      products={products}
    />
  );
}
