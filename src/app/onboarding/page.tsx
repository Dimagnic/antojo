import { Suspense } from "react";
import { OnboardingWizard } from "./OnboardingWizard";

export const metadata = { title: "Crea tu carta" };

export default function Page() {
  return (
    <Suspense>
      <OnboardingWizard />
    </Suspense>
  );
}
