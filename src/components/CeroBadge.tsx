export function CeroBadge() {
  return (
    <a
      href="https://cero-new-generation-e19z.vercel.app/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Diseñado por Cero+"
      className="inline-flex items-center gap-2.5 rounded-full bg-white px-4 py-2 text-sm text-tinta shadow-lg transition hover:scale-[1.03]"
    >
      Diseñado por
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/cero-logo.png" alt="Cero+" className="h-6 w-auto" />
    </a>
  );
}
