import { Container } from "@/components/ui/Container";

// Added 2026-09-20 (site owner's request), replacing "About" in the
// nav outright: "project ini taruh aja dibawahnya gallery card
// research, kontennya menyusul tapi kasih space dan link ke menu bar
// aja dulu" — a real section, sitting directly below the publications
// gallery (app/page.tsx), so the nav's `#project` anchor lands
// somewhere real instead of a blank scroll target. Just the heading
// and the section's own vertical rhythm for now; the actual content
// is a follow-up, not invented here ahead of it (PRD 6.6).
export function Project() {
  return (
    <section id="project" aria-label="Project" className="scroll-mt-24 py-16 md:py-20">
      <Container>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-000 md:text-4xl">
          Project
        </h2>
      </Container>
    </section>
  );
}
