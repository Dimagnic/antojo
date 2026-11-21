"use client";

import { useOptimistic, useTransition } from "react";
import { toggleOpen } from "@/app/actions";

export function OpenToggle({ isOpen }: { isOpen: boolean }) {
  const [optimistic, setOptimistic] = useOptimistic(isOpen);
  const [, start] = useTransition();
  return (
    <button
      onClick={() =>
        start(async () => {
          setOptimistic(!optimistic);
          await toggleOpen(!optimistic);
        })
      }
      className="flex w-full items-center justify-between gap-3 text-left"
      aria-pressed={optimistic}
    >
      <span>
        <span className="block text-sm text-tinta-70">Estado del local</span>
        <span className={`flex items-center gap-2 text-2xl font-extrabold ${optimistic ? "text-emerald-600" : "text-tinta-70"}`}>
          <span className={`h-2.5 w-2.5 rounded-full ${optimistic ? "bg-emerald-500" : "bg-tinta-70"}`} />
          {optimistic ? "Abierto" : "Cerrado"}
        </span>
      </span>
      <span className={`relative h-7 w-12 rounded-full transition ${optimistic ? "bg-emerald-500" : "bg-tinta/20"}`}>
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${optimistic ? "left-6" : "left-1"}`} />
      </span>
    </button>
  );
}
