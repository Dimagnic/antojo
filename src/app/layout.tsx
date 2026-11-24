import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Poppins: la misma tipografía y pesos que usa LaCarta
const poppins = localFont({
  src: [
    { path: "./fonts/poppins-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/poppins-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/poppins-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/poppins-700.woff2", weight: "700", style: "normal" },
    { path: "./fonts/poppins-800.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Antojo · Tu carta QR que vende sola",
    template: "%s · Antojo",
  },
  description:
    "Carta digital con QR para restaurantes en México: fotos y videos que abren el antojo, pedidos por WhatsApp y más reseñas en Google.",
};

export const viewport: Viewport = {
  themeColor: "#e11d2e",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX" className={poppins.variable}>
      <body>{children}</body>
    </html>
  );
}
