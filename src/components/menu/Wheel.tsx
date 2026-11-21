"use client";

import { useState } from "react";
import { Gift } from "lucide-react";
import type { Dict } from "./i18n";

// 12 casillas en el orden en que aparecen en la rueda (sentido horario desde arriba)
export const SEGMENTS = [100, 0, 20, 1000, 0, 20, 100, 0, 20, 1000, 0, 20];
// Probabilidad de cada premio (se reparte entre sus casillas)
const ODDS: Record<number, number> = { 0: 0.42, 20: 0.4, 100: 0.16, 1000: 0.02 };
const COLORS = ["#e6007e", "#2a1d3d", "#ff4fa8", "#c4006b", "#2a1d3d", "#ffb800"];

function pickIndex() {
  const r = Math.random();
  let acc = 0;
  for (const [value, p] of Object.entries(ODDS)) {
    acc += p;
    if (r <= acc) {
      const idxs = SEGMENTS.map((v, i) => (v === Number(value) ? i : -1)).filter((i) => i >= 0);
      return idxs[Math.floor(Math.random() * idxs.length)];
    }
  }
  return 1;
}

export function Wheel({
  t,
  canSpin,
  onResult,
}: {
  t: Dict;
  canSpin: boolean;
  onResult: (points: number) => void;
}) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const seg = 360 / SEGMENTS.length;
  const R = 140;

  function spin() {
    if (spinning || !canSpin) return;
    const idx = pickIndex();
    // Gira varias vueltas y deja el centro de la casilla elegida bajo el puntero (arriba)
    const target = 360 * 6 + (360 - (idx * seg + seg / 2));
    const base = rotation - (rotation % 360);
    setSpinning(true);
    setResult(null);
    setRotation(base + target);
    setTimeout(() => {
      setSpinning(false);
      setResult(SEGMENTS[idx]);
      onResult(SEGMENTS[idx]);
    }, 4600);
  }

  const polar = (deg: number, r: number) => {
    const a = ((deg - 90) * Math.PI) / 180;
    return [150 + r * Math.cos(a), 150 + r * Math.sin(a)];
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[290px] w-[290px]">
        {/* Puntero */}
        <div className="absolute left-1/2 top-[-6px] z-10 -translate-x-1/2 drop-shadow-lg">
          <svg width="34" height="40" viewBox="0 0 34 40">
            <path d="M17 38 3 8a14 14 0 1 1 28 0Z" fill="#fff" />
            <circle cx="17" cy="13" r="5" fill="#e6007e" />
          </svg>
        </div>
        <svg
          viewBox="0 0 300 300"
          className="h-full w-full"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? "transform 4.5s cubic-bezier(0.12, 0.8, 0.12, 1)" : "none",
          }}
        >
          <circle cx="150" cy="150" r="149" fill="#1b1130" />
          {SEGMENTS.map((v, i) => {
            const [x1, y1] = polar(i * seg, R);
            const [x2, y2] = polar((i + 1) * seg, R);
            const mid = i * seg + seg / 2;
            const [tx, ty] = polar(mid, R * 0.64);
            const [ix, iy] = polar(mid, R * 0.9);
            return (
              <g key={i}>
                <path d={`M150 150 L${x1} ${y1} A${R} ${R} 0 0 1 ${x2} ${y2} Z`} fill={COLORS[i % COLORS.length]} stroke="#1b1130" strokeWidth="2" />
                {/* Texto en dirección del radio, como en las ruletas de premios */}
                <g transform={`rotate(${mid - 90} ${tx} ${ty})`}>
                  {v ? (
                    <text x={tx} y={ty} fill="#fff" fontSize="17" fontWeight={800} textAnchor="middle" dominantBaseline="middle">
                      +{v}
                      <tspan fontSize="9" dx="2">PTS</tspan>
                    </text>
                  ) : (
                    <text x={tx} y={ty} fill="#ffffffcc" fontSize="8.5" fontWeight={700} textAnchor="middle">
                      <tspan x={tx} dy="-2">{t.keepPlaying.split(" ")[0]}</tspan>
                      <tspan x={tx} dy="10">{t.keepPlaying.split(" ").slice(1).join(" ")}</tspan>
                    </text>
                  )}
                </g>
                <circle cx={ix} cy={iy} r="3" fill={v ? "#fff" : "#ffffff55"} />
              </g>
            );
          })}
          {/* Foquitos del borde */}
          {Array.from({ length: 24 }).map((_, i) => {
            const [x, y] = polar(i * 15, 146);
            return <circle key={i} cx={x} cy={y} r="2.6" fill={i % 2 ? "#ffb800" : "#ffffff"} className={spinning ? "animate-pulse" : ""} />;
          })}
          <circle cx="150" cy="150" r="30" fill="#1b1130" stroke="#e6007e" strokeWidth="5" />
        </svg>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <Gift className="h-7 w-7 text-sol" />
        </div>
      </div>

      <div className="mt-3 h-7 text-center text-lg font-extrabold">
        {result !== null && !spinning && (
          <span className="animate-[pop_.5s_ease-out]">{result ? t.won.replace("{n}", String(result)) : t.noLuck}</span>
        )}
      </div>

      <button
        onClick={spin}
        disabled={spinning || !canSpin}
        className="mt-2 w-full rounded-full bg-rosa py-3.5 text-lg font-extrabold text-white shadow-lg shadow-rosa/40 transition active:scale-95 disabled:opacity-60"
      >
        {spinning ? t.spinning : t.spin}
      </button>
      {!canSpin && !spinning && <p className="mt-2 text-center text-sm text-white/70">{t.comeBack}</p>}
    </div>
  );
}
