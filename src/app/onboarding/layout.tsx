import { Logo } from "@/components/Logo";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen">
      <header className="border-b border-rosa-100 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-3">
          <Logo href="/onboarding" />
          <span className="text-sm text-tinta-70">Configura tu carta</span>
        </div>
      </header>
      <div className="mx-auto max-w-4xl px-5 py-10">{children}</div>
    </main>
  );
}
