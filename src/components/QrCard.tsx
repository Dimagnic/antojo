"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { Check, Copy, Download } from "lucide-react";

export function QrCard({ url, name }: { url: string; name: string }) {
  const [png, setPng] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    QRCode.toDataURL(url, { width: 1200, margin: 2, color: { dark: "#1b1130", light: "#ffffff" }, errorCorrectionLevel: "M" }).then(setPng);
  }, [url]);

  async function downloadSvg() {
    const svg = await QRCode.toString(url, { type: "svg", margin: 2, color: { dark: "#1b1130", light: "#ffffff" } });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    a.download = `qr-${name}.svg`;
    a.click();
  }

  return (
    <div className="rounded-3xl border border-rosa-100 bg-white p-5">
      <h2 className="font-bold">Tu QR</h2>
      <p className="text-sm text-tinta-70">Imprímelo para tus mesas, mostrador o volantes.</p>
      <div className="mx-auto mt-4 w-full max-w-[220px] rounded-2xl bg-white p-2 ring-1 ring-tinta/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {png ? <img src={png} alt="Código QR de tu carta" className="w-full" /> : <div className="aspect-square animate-pulse rounded-xl bg-crema" />}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <a
          href={png ?? undefined}
          download={`qr-${name}.png`}
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-rosa px-3 py-2 text-sm font-semibold text-white hover:bg-rosa-600"
        >
          <Download className="h-4 w-4" /> PNG
        </a>
        <button onClick={downloadSvg} className="inline-flex items-center justify-center gap-1.5 rounded-full bg-tinta px-3 py-2 text-sm font-semibold text-white">
          <Download className="h-4 w-4" /> SVG
        </button>
      </div>
      <button
        onClick={() => {
          navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="mt-3 flex w-full items-center justify-between gap-2 rounded-xl bg-crema px-3 py-2 text-left text-xs text-tinta-70"
      >
        <span className="truncate">{url}</span>
        {copied ? <Check className="h-4 w-4 shrink-0 text-emerald-600" /> : <Copy className="h-4 w-4 shrink-0" />}
      </button>
    </div>
  );
}
