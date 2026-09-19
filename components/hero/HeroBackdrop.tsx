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
// "still part of the hero" visually. A fixed guessed height on this
// component (tried at 56rem, then 64rem) can never track that
// correctly since the combined height of Hero + Publications changes
// with content and viewport. Fixed instead by making this component
// `absolute inset-0` and having app/page.tsx render it as a child of
// one shared `relative` wrapper around BOTH <Hero /> and
// <PublicationsShowcase />, so it fills exactly that wrapper's real
// rendered height automatically — no magic number to keep re-guessing.
//
// fadeRy: pushed up twice while chasing the height problem above (0.6
// default -> 1 -> 1.4), which was solving the wrong half of it and
// overshot badly — a wide, tall glow instead of the reference's actual
// look. Checked directly against a fresh screenshot of
// rbp-portfolio.vercel.app (the site owner's own comparison, 2026-09-19,
// third revision): the reference's glow is a compact, bright patch
// centred at the top of the screen, fading to solid background well
// before the midpoint, not a glow that fills the frame. That is what
// the shader's own default fade shape (fadeRy 0.6, fadeCy 0, unset
// here) already draws — the container-height fix above was the actual
// bug; the fade shape itself never needed to change from its default.
// Reverted to the default rather than re-tuning a new guessed value.
export function HeroBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 opacity-50 md:opacity-100">
        <ShaderFlow brightness={3} iterations={10} flowSpeed={[0, 0.1]} />
      </div>
    </div>
  );
}
