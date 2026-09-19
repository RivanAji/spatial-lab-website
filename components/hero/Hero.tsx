import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { HeroCanvas } from "./HeroCanvas";

// Content is fixed by the brief (section 3.4) and PRD 7.2 — not placeholder
// copy, the actual launch copy. Exactly three text elements in the stack
// (headline, subtext, CTA): no eyebrow, no trust strip, no tagline under
// the CTA (PRD 6.6 / hero stack discipline).
//
// Visual container updated 2026-09-19: the ASCII map now sits in a square
// card (rounded-4xl, soft border, inset padding, gentle shadow) rather
// than an uncontained wide composition — the exact recipe read off
// https://rbp-portfolio.vercel.app's own hero visual (a canvas, framed
// the same way), which this redesign follows. Nav is now `fixed` and out
// of document flow (components/layout/Header.tsx), so this section carries
// its own top clearance instead of relying on a document-flow header bar.
export function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-28 md:pb-24 md:pt-32">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-8">
          <div className="flex flex-col gap-7">
            {/* Uppercase tracked display type, matching the brief's own
                mockups (section 3.4/19) and the mono/technical-annotation
                language used elsewhere in the hero. Size and column width
                were tuned together against the real rendered width, not
                assumed — "Transportation Laboratory" is the line that
                decides this. */}
            <h1 className="font-display text-3xl font-semibold uppercase leading-[1.1] tracking-tight text-ink-000 sm:text-4xl lg:text-[2.75rem]">
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

          {/* Being second in source order, this sits below the headline
              on mobile (PRD 7.2 mobile behaviour) with no order-*
              override needed. justify-end on desktop mirrors the
              reference's own hero (photo card pinned to the column's
              far edge, not stretched to fill it). */}
          <div className="flex justify-center md:justify-end">
            <div className="w-full max-w-105 rounded-4xl border border-white/8 bg-ink-900 p-1.5 shadow-sm">
              <div className="overflow-hidden rounded-[1.6rem]">
                <HeroCanvas />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
