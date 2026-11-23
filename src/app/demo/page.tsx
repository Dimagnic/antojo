import type { Metadata } from "next";
import { MenuFeed } from "@/components/MenuFeed";
import { DEMO_CATEGORIES, DEMO_PRODUCTS } from "@/lib/demo";

export const metadata: Metadata = {
  title: "Demo de carta",
  description: "Así se ve una carta de Antojo: fotos que abren el apetito, ruleta de premios y pedidos por WhatsApp.",
};

export default function DemoPage() {
  return (
    <MenuFeed
      demo
      restaurant={{
        id: "demo",
        name: "Antojo · Demo",
        whatsapp: "demo",
        currency: "MXN",
        logo_url: null,
        is_open: true,
        review: "https://www.google.com/maps",
        instagram: null,
        game: true,
      }}
      categories={DEMO_CATEGORIES}
      products={DEMO_PRODUCTS}
    />
  );
}
