import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Post } from "@/lib/blog";
import { PHOTOS, photo } from "@/lib/site";

export function BlogCard({ post }: { post: Post }) {
  const [a, ...rest] = post.coverTitle.split(" ");
  return (
    <Link href={`/blog/${post.slug}`} className="group block overflow-hidden rounded-[28px] bg-white shadow-[0_16px_50px_-24px_rgba(27,17,48,0.35)] ring-1 ring-tinta/5">
      <div className="relative aspect-[16/9] overflow-hidden bg-tinta">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo(PHOTOS[post.cover], 900, 506)}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover opacity-70 transition-transform duration-[1500ms] group-hover:scale-110"
          style={{ filter: "saturate(1.15) contrast(1.05)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/antojo-logo-blanco.svg" alt="" className="absolute left-5 top-4 h-4 w-auto" />
        <p className="absolute bottom-5 left-5 max-w-[60%] text-[30px] font-extrabold leading-[1.05] text-white">
          {a} <span className="text-rosa">{rest.join(" ")}</span>
        </p>
      </div>
      <div className="p-6">
        <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-rosa">Blog Antojo</p>
        <h3 className="mt-2 text-[19px] font-semibold leading-snug">{post.title}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-tinta-70">{post.excerpt}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 font-semibold text-rosa">
          Leer más <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
