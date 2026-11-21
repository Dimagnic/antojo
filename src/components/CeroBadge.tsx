export function CeroBadge() {
  return (
    <a
      href="https://cero-new-generation-e19z.vercel.app/"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full bg-black px-3.5 py-1.5 text-xs text-white/70 ring-1 ring-white/10 hover:ring-white/30"
    >
      Diseñado por
      <span className="inline-flex items-center font-extrabold text-white">
        Cer
        <span className="mx-[1px] inline-block h-2.5 w-2.5 rounded-full bg-[#e10600]" />+
      </span>
    </a>
  );
}
