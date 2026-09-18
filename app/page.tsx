import { Hero } from "@/components/hero/Hero";

// Homepage. Research Teams, Research Archive, and Footer land in Phase 4
// (PRD section 9) — this is Phase 3's hero, built and reviewed on its own
// first because it's the highest-risk, highest-value piece (PRD Phase 3).
export default function Home() {
  return (
    <main className="min-h-[100dvh]">
      <Hero />
    </main>
  );
}
