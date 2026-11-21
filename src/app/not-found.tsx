import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <span className="text-6xl">🌮</span>
      <h1 className="mt-4 text-3xl font-extrabold">Aquí no hay nada… todavía</h1>
      <p className="mt-2 text-tinta-70">La página que buscas no existe o cambió de dirección.</p>
      <Link href="/" className="mt-6 rounded-full bg-rosa px-6 py-3 font-semibold text-white">Ir al inicio</Link>
    </main>
  );
}
