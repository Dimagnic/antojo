import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { BlogCard } from "@/components/landing/BlogCard";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { POSTS } from "@/lib/blog";

export const metadata: Metadata = { title: "Blog", description: "Guías para vender más con tu carta QR." };

export default function BlogPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 pb-20 pt-40">
        <h1 className="text-center text-[34px] font-semibold leading-tight tracking-tight md:text-5xl">Guías para vender más con tu carta QR</h1>
        <p className="mx-auto mt-4 max-w-xl text-center text-[16px] leading-relaxed text-tinta-70">
          Ideas prácticas para restaurantes que quieren atraer clientes, mejorar su carta digital y juntar reseñas.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {POSTS.map((p) => (
            <BlogCard key={p.slug} post={p} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
