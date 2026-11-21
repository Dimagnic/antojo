const STEPS = ["Tu negocio", "Tus platillos", "Tu QR"];

export function Stepper({ current }: { current: number }) {
  return (
    <ol className="mb-8 flex items-center gap-2 text-sm">
      {STEPS.map((s, i) => (
        <li key={s} className="flex flex-1 items-center gap-2">
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
              i <= current ? "bg-rosa text-white" : "bg-rosa-50 text-tinta-70"
            }`}
          >
            {i + 1}
          </span>
          <span className={i === current ? "font-semibold" : "text-tinta-70"}>{s}</span>
          {i < STEPS.length - 1 && <span className={`h-0.5 flex-1 rounded ${i < current ? "bg-rosa" : "bg-rosa-100"}`} />}
        </li>
      ))}
    </ol>
  );
}
