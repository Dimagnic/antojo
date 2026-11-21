import Link from "next/link";

export function Logo({ light = false, href = "/" }: { light?: boolean; href?: string }) {
  return (
    <Link href={href} aria-label="Antojo, inicio" className="inline-flex items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={light ? "/brand/antojo-logo-blanco.svg" : "/brand/antojo-logo.svg"}
        alt="Antojo"
        className="h-8 w-auto"
      />
    </Link>
  );
}
