import { Container } from "@/components/ui/Container";

// Added 2026-09-20 (site owner's correction to the previous pass): the
// header's "Roadmap" link was first built as a disabled comingSoon nav
// item, on the reasoning that a link to nothing is worse than no link
// (PRD 7.9 had deferred this section outright for the same reason,
// content not ready). The site owner's actual ask was the opposite
// shape: a real section, reachable by clicking "Roadmap", sitting
// below the publications gallery — it just doesn't have real content
// yet, so it says so rather than shipping invented milestones (PRD
// 6.6's "no invented content" rule) or not existing at all.
//
// Same frame language as the hero's map card and the publications
// gallery (rounded-4xl border border-white/8 bg-ink-900) — the empty
// canvas reads as "this section is real, just not filled in yet"
// rather than a different, unfinished-looking component.
export function Roadmap() {
  return (
    <section id="roadmap" aria-label="Lab roadmap" className="scroll-mt-24 py-16 md:py-20">
      <Container>
        <h2 className="font-serif text-3xl font-medium text-ink-000 md:text-4xl">
          Lab roadmap
        </h2>
        <div className="mt-8 flex min-h-[280px] items-center justify-center rounded-4xl border border-white/8 bg-ink-900 md:min-h-[360px]">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-300">Soon</p>
        </div>
      </Container>
    </section>
  );
}
