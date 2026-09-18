import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { HeroCanvas } from "./HeroCanvas";

// Content is fixed by the brief (section 3.4) and PRD 7.2 — not placeholder
// copy, the actual launch copy. Exactly three text elements in the stack
// (headline, subtext, CTA): no eyebrow, no trust strip, no tagline under
// the CTA (PRD 6.6 / hero stack discipline).
export function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-10 md:pb-24 md:pt-16 lg:pt-20">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,50%)_minmax(0,1fr)] lg:gap-16">
          <div className="flex flex-col gap-7">
            {/* Uppercase tracked display type, matching the brief's own
                mockups (section 3.4/19) and the mono/technical-annotation
                language used elsewhere in the hero. Size and column width
                (44% of the container, set on the grid above) were tuned
                together against the real rendered width, not assumed —
                "Transportation Laboratory" is the line that decides this. */}
            <h1 className="font-display text-3xl font-semibold uppercase leading-[1.1] tracking-tight text-ink-000 sm:text-4xl lg:text-[2.5rem]">
              Spatial Analysis &amp;
              <br />
              Transportation Laboratory
            </h1>
            <p className="max-w-[38ch] font-body text-lg leading-relaxed text-ink-300">
              Exploring cities through space, mobility, data and intelligent
              systems.
            </p>
            <div>
              <Button href="/research">Explore Research</Button>
            </div>
          </div>

          {/* Grid places this in the right column on desktop and, being
              second in source order, below the headline on mobile (PRD 7.2
              mobile behaviour) — no order-* override needed either way. */}
          <div>
            <HeroCanvas />
          </div>
        </div>
      </Container>
    </section>
  );
}
