import { Container } from "@/components/ui/Container";

// Keep the section reachable while showing an honest empty state until verified milestones exist.
// Its frame and heading tier match the adjacent sections for consistent hierarchy.
export function Roadmap() {
  return (
    <section id="roadmap" aria-label="Roadmap" className="scroll-mt-24 py-8 md:py-10">
      <Container>
        <h2 className="font-display text-xl font-semibold tracking-tight text-ink-000 md:text-2xl">
          Roadmap
        </h2>
        <div className="mt-8 flex min-h-[280px] items-center justify-center rounded-4xl border border-white/8 bg-ink-900 md:min-h-[360px]">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-300">Soon</p>
        </div>
      </Container>
    </section>
  );
}
