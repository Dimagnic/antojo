"use client";

import { useCallback, useState } from "react";
import { ArrowRight, Lock, Sparkles } from "lucide-react";
import { LoginModal } from "@/components/LoginModal";

/**
 * Para quien armó su carta sin cuenta (como LaCarta): la carta ya está guardada
 * y se le invita a crear su cuenta para quedársela.
 */
export function GuestGate() {
  const [step, setStep] = useState<"invite" | "signup" | null>("invite");
  const close = useCallback(() => setStep(null), []);
  return (
    <>
      <button
        onClick={() => setStep("invite")}
        className="flex w-full items-center justify-center gap-2 bg-tinta px-4 py-2 text-[12.5px] font-medium text-white"
      >
        <Lock className="h-3.5 w-3.5 text-sol" /> Tu carta está guardada. <span className="underline underline-offset-2">Crea tu cuenta para quedártela.</span>
      </button>

      {step === "invite" && (
        <div className="anim-fade fixed inset-0 z-[95] flex items-start justify-center bg-black/55 px-4 pt-[16vh]">
          <div className="anim-pop w-full max-w-[380px] rounded-2xl bg-white p-7 text-center shadow-2xl">
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-rosa-50 text-rosa">
              <Sparkles className="h-5 w-5" />
            </span>
            <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.2em] text-rosa">Último paso</p>
            <h2 className="mt-1 text-[22px] font-bold leading-tight">
              Tu carta está lista.
              <br />
              Hazla tuya.
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-tinta-70">Crea tu cuenta en segundos para guardarla, publicarla y compartirla con tus clientes.</p>
            <button
              onClick={() => setStep("signup")}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-rosa py-3 text-[14px] font-semibold text-white shadow-[0_10px_24px_-8px_rgba(225,29,46,0.6)] transition hover:bg-rosa-600"
            >
              Guardar y ver mi carta <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={close} className="mt-3 text-[12px] text-tinta-70 hover:text-tinta">
              Ver mi panel primero
            </button>
          </div>
        </div>
      )}

      <LoginModal open={step === "signup"} onClose={close} initialMode="registro" upgrade googleNext="/panel" />
    </>
  );
}
