export function FlagMX({ className = "h-3.5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 20" className={`${className} overflow-hidden rounded-[2px]`} aria-hidden>
      <rect width="10" height="20" fill="#006847" />
      <rect x="10" width="10" height="20" fill="#fff" />
      <rect x="20" width="10" height="20" fill="#ce1126" />
      <circle cx="15" cy="10" r="2.6" fill="#8c5a2b" />
    </svg>
  );
}

export function FlagUS({ className = "h-3.5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 20" className={`${className} overflow-hidden rounded-[2px]`} aria-hidden>
      <rect width="30" height="20" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map((i) => (
        <rect key={i} y={(i * 20) / 13} width="30" height={20 / 13} fill="#b22234" />
      ))}
      <rect width="13" height="10.8" fill="#3c3b6e" />
    </svg>
  );
}
