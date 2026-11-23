"use client";

import { useEffect, useState } from "react";

/** Palabra que cambia con desenfoque, como "Ahora [Trabaja · Vende · Califica] por Vos." */
export function RotatingWord({ words, interval = 2200 }: { words: string[]; interval?: number }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [words.length, interval]);
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), "");
  return (
    <span className="relative inline-block align-bottom">
      {/* Reserva el ancho de la palabra más larga para que el título no brinque */}
      <span className="invisible">{longest}</span>
      <span key={i} className="word-in absolute left-0 top-0 bg-gradient-to-r from-rosa to-[#ff5c7a] bg-clip-text text-transparent">
        {words[i]}
      </span>
    </span>
  );
}
