import { Container } from "@/components/ui/Container";

// Added 2026-09-20 (site owner's request), replacing "About" in the
// nav outright: "project ini taruh aja dibawahnya gallery card
// research, kontennya menyusul tapi kasih space dan link ke menu bar
// aja dulu" — a real section, sitting directly below the publications
// gallery (app/page.tsx), so the nav's `#project` anchor lands
// somewhere real instead of a blank scroll target. Just the heading
// and the section's own vertical rhythm for now; the actual content
// is a follow-up, not invented here ahead of it (PRD 6.6).
//
// Heading roughly halved (site owner's font-size audit, same day:
// "Title Project terlalu besar... diperkecil setengahnya") from
// text-3xl/4xl (30/36px) to text-xl/2xl (20/24px) — Roadmap.tsx and
// Team.tsx use the exact same size now, for the same reason, so the
// three section headings this page has read as one consistent tier
// instead of each carrying its own scale. Section padding also cut
// from py-16/20 to py-8/10 (site owner: spacing to the sections
// either side of this one "terlalu jauh, kurangi aja").
export function Project() {
  return (
    <section id="project" aria-label="Project" className="scroll-mt-24 py-8 md:py-10">
      <Container>
        <h2 className="font-display text-xl font-semibold tracking-tight text-ink-000 md:text-2xl">
          Project
        </h2>
      </Container>
    </section>
  );
}
