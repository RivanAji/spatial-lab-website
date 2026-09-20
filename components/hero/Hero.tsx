import { Container } from "@/components/ui/Container";
import { HeroCanvas } from "./HeroCanvas";
import { HeroCtas } from "./HeroCtas";
import { GRID_COLS, GRID_ROWS } from "@/data/asia-grid";

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
// stepped down one notch each (h1, subtext).
//
// Top/bottom padding loosened twice, fourth and fifth passes: after
// seeing it rendered, the site owner asked for more breathing room
// above and below this section specifically — it had ended up
// reading as cramped against the fixed nav above and the publication
// cards directly below, and said so again after the first increase
// still wasn't enough (pt-20/pb-6 -> pt-24/pb-10 -> pt-28/pb-14, md
// pt-24/pb-8 -> pt-28/pb-14 -> pt-32/pb-20). The type-scale and
// map-size reductions from the compact pass above stay as they were,
// this only touches the section's own vertical padding.
//
// Visual container no longer forces a square (2026-09-19, third pass):
// the map's real aspect ratio (GRID_COLS x GRID_ROWS, currently
// 96x63 — see scripts/build-map-grid.mjs) isn't 1:1, and squeezing it
// into a square card was letterboxing it (empty bands top and bottom)
// once HeroCanvas.tsx started respecting that real ratio instead of
// distorting the map to fill a square. Rather than crop the map or
// force the distortion back, the card's HEIGHT now matches this
// column's actual sibling — the headline/subtext/CTA stack — via
// `md:items-stretch` on the grid row and `md:h-full` here, with the
// card's WIDTH derived from that height through the same GRID_COLS/
// GRID_ROWS ratio (an inline `aspectRatio`, not a hand-typed class, so
// it can't drift out of sync with the grid again the way the old
// hard-coded max-w-64/72 values eventually would have). Below `md`,
// where there's no sibling height to match, it falls back to sizing by
// width instead (`w-full` with height following from the same ratio),
// which is the same self-contained behaviour the square card had.
//
// Visual container: the ASCII map sits in a card (rounded-4xl, soft
// border, inset padding, gentle shadow) matching the reference this
// whole redesign follows, https://github.com/DavidHDev/rbp-portfolio
// (its own hero visual uses the same frame, square only because that
// reference has no real geographic data to respect the shape of). The
// WebGL flow shader ("HeroBackdrop") that used to render here directly
// moved up to app/page.tsx (2026-09-19) so it can be sized against this
// section's AND PublicationsShowcase's combined height instead of just
// this one — see HeroBackdrop.tsx's own comment for why. Nav is `fixed`
// and out of document flow (components/layout/Header.tsx), so this
// section carries its own top clearance instead of relying on a
// document-flow header bar.
export function Hero() {
  return (
    <section className="pb-14 pt-28 md:pb-20 md:pt-32">
      <Container>
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:items-stretch md:gap-6">
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
            {/* Sized down again 2026-09-20 (site owner's font-size audit) —
                text-sm/base still read heavier than the rest of the page's
                secondary text after the footer/Team pass. */}
            <p className="max-w-[38ch] font-body text-xs leading-relaxed text-ink-300 sm:text-sm">
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
            <div
              className="w-full max-w-64 rounded-4xl border border-white/8 bg-ink-900 p-1.5 shadow-sm sm:max-w-72 md:h-full md:w-auto md:max-w-none"
              style={{ aspectRatio: `${GRID_COLS} / ${GRID_ROWS}` }}
            >
              <div className="h-full w-full overflow-hidden rounded-[1.6rem]">
                <HeroCanvas />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
