import { Container } from "@/components/ui/Container";
import { HeroCanvas } from "./HeroCanvas";
import { HeroCtas } from "./HeroCtas";

// Content is fixed by the brief (section 3.4) and PRD 7.2 — not placeholder
// copy, the actual launch copy. Headline/subtext/CTA row is the disciplined
// three-element stack (PRD 6.6), full stop.
//
// Compact pass (2026-09-19, site owner's request): the team-cards teaser
// that used to sit inside this section ("TeamsTeaser", added earlier the
// same day) moved out into its own component,
// components/sections/PublicationsShowcase.tsx, immediately below this one
// — those cards are now the team filter for a publications slider, not a
// hero decoration, so they belong to that section's state, not this one's.
//
// Shrunk again the same day, second pass: the site owner asked for the
// headline, subtext and map visual to all read smaller still, so that on
// first load the hero, the publications team-card row, and some of what's
// below it are all visible together without a full scroll. Type scale
// stepped down one notch each (h1, subtext), the map's container shrunk
// from max-w-105 (420px) to max-w-64/72 (256/288px, it's a square so
// height follows width automatically — see HeroCanvas.tsx's
// aspect-square), and top/bottom padding tightened further on top of the
// first pass's reduction.
//
// Visual container: the ASCII map sits in a square card (rounded-4xl,
// soft border, inset padding, gentle shadow) matching the reference
// this whole redesign follows, https://github.com/DavidHDev/rbp-portfolio
// (its own hero visual uses the same frame). The WebGL flow shader
// ("HeroBackdrop") that used to render here directly moved up to
// app/page.tsx (2026-09-19, second pass) so it can be sized against
// this section's AND PublicationsShowcase's combined height instead of
// just this one — see HeroBackdrop.tsx's own comment for why. Nav is
// `fixed` and out of document flow (components/layout/Header.tsx), so
// this section carries its own top clearance instead of relying on a
// document-flow header bar.
export function Hero() {
  return (
    <section className="pb-6 pt-20 md:pb-8 md:pt-24">
      <Container>
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-6">
          <div className="flex flex-col gap-4">
            {/* Title case, not the all-caps treatment used elsewhere in
                the hero (mono coordinates, nav) — changed 2026-09-19 at
                the site owner's request, moving away from the uppercase
                mockup styling in the brief (section 3.4/19). Written in
                title case directly rather than relying on CSS
                `capitalize` (inconsistent across browsers around
                punctuation like "&"), so what's in the markup is what
                renders. */}
            <h1 className="font-display text-2xl font-semibold leading-[1.1] tracking-tight text-ink-000 sm:text-3xl lg:text-[2.25rem]">
              Transportation &amp;
              <br />
              Spatial Analysis Laboratory
            </h1>
            <p className="max-w-[38ch] font-body text-sm leading-relaxed text-ink-300 sm:text-base">
              Exploring cities through space, mobility, data and intelligent
              systems.
            </p>
            <HeroCtas />
          </div>

          {/* Being second in source order, this sits below the headline
              on mobile (PRD 7.2 mobile behaviour) with no order-*
              override needed. justify-end on desktop mirrors the
              reference's own hero (photo card pinned to the column's
              far edge, not stretched to fill it). */}
          <div className="flex justify-center md:justify-end">
            <div className="w-full max-w-64 rounded-4xl border border-white/8 bg-ink-900 p-1.5 shadow-sm sm:max-w-72">
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
