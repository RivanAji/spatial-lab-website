import { ShaderFlow } from "@/components/shaders/shader-flow";

// Mounting, sizing and opacity match components/layout/page-backdrop.tsx
// from github.com/DavidHDev/rbp-portfolio (brightness=3, iterations=10,
// flowSpeed=[0, 0.1], default colours/fade) — scoped to the hero only
// here rather than the whole page, per the site owner's request ("the
// hero's animated background"). The default `grayscale` filter on
// ShaderFlow's own className (unset here, so it applies) is what makes
// this read as a monochrome flowing surface rather than the shader's
// underlying colour values — that's the "black flag" look: an organic,
// domain-warped fabric-like texture fading to the page background,
// not a colour effect.
//
// Sizing (revised 2026-09-19, second time the same day): the site
// owner's actual mental model is that the hero doesn't end where
// Hero.tsx's own <section> ends — the publications team-card row and
// slider below it (components/sections/PublicationsShowcase.tsx) are
// "still part of the hero" visually, referencing how
// rbp-portfolio.vercel.app's own flag background fills essentially the
// whole first screen, not just the headline area. A fixed guessed
// height on this component (tried at 56rem, then 64rem) can never
// track that correctly since the combined height of Hero + Publications
// changes with content and viewport. Fixed instead by making this
// component `absolute inset-0` and having app/page.tsx render it as a
// child of one shared `relative` wrapper around BOTH <Hero /> and
// <PublicationsShowcase />, so it fills exactly that wrapper's real
// rendered height automatically — no magic number to keep re-guessing.
//
// fadeRy pushed further too (1 -> 1.4): with the container now sized to
// the true combined height instead of an underestimate, the earlier
// value was still fading out before reaching the bottom of that taller
// area. 1.4 keeps the flowing texture visible through essentially the
// whole wrapper, matching the reference's own near-full-screen
// coverage, fading only in the last stretch rather than partway down.
export function HeroBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 opacity-50 md:opacity-100">
        <ShaderFlow brightness={3} iterations={10} flowSpeed={[0, 0.1]} fadeRy={1.4} />
      </div>
    </div>
  );
}
