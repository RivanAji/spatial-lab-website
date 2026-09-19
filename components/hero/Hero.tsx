import { Container } from "@/components/ui/Container";
import { HeroCanvas } from "./HeroCanvas";
import { HeroBackdrop } from "./HeroBackdrop";
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
// Removing that block is also most of why the hero is shorter now: this
// section went back to exactly what PRD 7.2 specified (headline, subtext,
// CTA row, one visual), with tighter top/bottom padding on top of that so
// the section below sits closer to the fold instead of requiring a full
// scroll to reach.
//
// Visual container: the ASCII map sits in a square card (rounded-4xl,
// soft border, inset padding, gentle shadow) matching the reference
// this whole redesign follows, https://github.com/DavidHDev/rbp-portfolio
// (its own hero visual uses the same frame). HeroBackdrop is that
// reference's WebGL flow shader, scoped to this section. Nav is `fixed`
// and out of document flow (components/layout/Header.tsx), so this
// section carries its own top clearance instead of relying on a
// document-flow header bar.
export function Hero() {
  return (
    <section className="relative overflow-hidden pb-10 pt-24 md:pb-14 md:pt-28">
      <HeroBackdrop />
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-8">
          <div className="flex flex-col gap-7">
            {/* Title case, not the all-caps treatment used elsewhere in
                the hero (mono coordinates, nav) — changed 2026-09-19 at
                the site owner's request, moving away from the uppercase
                mockup styling in the brief (section 3.4/19). Written in
                title case directly rather than relying on CSS
                `capitalize` (inconsistent across browsers around
                punctuation like "&"), so what's in the markup is what
                renders. */}
            <h1 className="font-display text-3xl font-semibold leading-[1.1] tracking-tight text-ink-000 sm:text-4xl lg:text-[2.75rem]">
              Transportation &amp;
              <br />
              Spatial Analysis Laboratory
            </h1>
            <p className="max-w-[38ch] font-body text-lg leading-relaxed text-ink-300">
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
