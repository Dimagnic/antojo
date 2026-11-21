import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const dmSans = localFont({
  src: "./fonts/DMSans.ttf",
  variable: "--font-dm-sans",
  weight: "100 1000",
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
  themeColor: "#e6007e",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX" className={dmSans.variable}>
      <body>{children}</body>
    </html>
  );
}
