import { Hero } from "@/components/hero/Hero";
import { ResearchTeams } from "@/components/sections/ResearchTeams";
import { ResearchArchive } from "@/components/sections/ResearchArchive";
import { Hairline } from "@/components/ui/Hairline";
import { Container } from "@/components/ui/Container";

// Homepage. Four sections at launch: Hero, Research Teams, Research
// Archive, Footer (the last lives in the root layout). Lab Roadmap is
// deferred to Phase 9 (PRD 7.9) — the old ITS roadmap is out of scope and
// there's no real replacement content yet, so the section doesn't ship
// rather than shipping with invented milestones.
export default function Home() {
  return (
    <main>
      <Hero />
      <Container>
        <Hairline />
      </Container>
      <ResearchTeams />
      <Container>
        <Hairline />
      </Container>
      <ResearchArchive />
    </main>
  );
}
