import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/Footer";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { POSTS } from "@/lib/blog";
import { PHOTOS, photo } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  return post ? { title: post.title, description: post.excerpt } : { title: "Artículo no encontrado" };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) notFound();
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 pb-20 pt-36">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-rosa">
          <ArrowLeft className="h-4 w-4" /> Todos los artículos
        </Link>
        <p className="mt-6 text-[13px] font-semibold uppercase tracking-[0.18em] text-rosa">Blog Antojo</p>
        <h1 className="mt-2 text-[32px] font-semibold leading-tight tracking-tight md:text-[42px]">{post.title}</h1>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo(PHOTOS[post.cover], 1400, 700)} alt="" className="mt-8 aspect-[2/1] w-full rounded-3xl object-cover" style={{ filter: "saturate(1.12) contrast(1.05)" }} />
        <article className="mt-10 space-y-5 text-[17px] leading-relaxed text-tinta/90">
          {post.body.map((b, i) =>
            b.h ? (
              <h2 key={i} className="pt-4 text-2xl font-semibold text-tinta">
                {b.h}
              </h2>
            ) : b.list ? (
              <ul key={i} className="list-disc space-y-2 pl-6">
                {b.list.map((li) => (
                  <li key={li}>{li}</li>
                ))}
              </ul>
            ) : (
              <p key={i}>{b.p}</p>
            ),
          )}
        </article>
        <div className="mt-12 rounded-3xl bg-gradient-to-br from-rosa to-[#ff5c7a] p-8 text-center text-white">
          <p className="text-2xl font-semibold">¿Lista tu carta en 5 minutos?</p>
          <Link href="/registro" className="mt-4 inline-block rounded-full bg-white px-6 py-3 font-semibold text-rosa">
            Crear mi carta gratis
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
