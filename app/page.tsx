import { Hero } from "@/components/hero/Hero";
import { PublicationsShowcase } from "@/components/sections/PublicationsShowcase";
import { ResearchArchive } from "@/components/sections/ResearchArchive";
import { Hairline } from "@/components/ui/Hairline";
import { Container } from "@/components/ui/Container";

// Homepage. Four sections at launch: Hero, Publications showcase, Research
// Archive, Footer (the last lives in the root layout). Publications
// showcase added 2026-09-19 directly under the hero, no hairline between
// them, so it reads as one continuous unit with the now-compact hero
// rather than a separate page section — that's what makes it reachable
// without a full scroll, which was the point of shrinking the hero in the
// first place.
//
// The separate Research Teams section (asymmetric trio panel, PRD 7.3)
// was removed the same day per the site owner's direct request — its job
// (team identity, coordinator, publication count) had become redundant
// once the Publications showcase's own team cards carried the same
// information as an interactive filter. `#research`, the "Explore
// Research" hero CTA's scroll target (HeroCtas.tsx), moved onto the
// Publications showcase section since that's what a visitor following
// that link actually wants to land on now.
//
// Lab Roadmap is deferred to Phase 9 (PRD 7.9) — the old ITS roadmap is
// out of scope and there's no real replacement content yet, so the
// section doesn't ship rather than shipping with invented milestones.
export default function Home() {
  return (
    <main>
      <Hero />
      <PublicationsShowcase />
      <Container>
        <Hairline />
      </Container>
      <ResearchArchive />
    </main>
  );
}
