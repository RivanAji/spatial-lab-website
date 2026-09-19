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
// fadeRy (2026-09-19, site owner's request): the shader's own fade-to-
// background shape (shader-flow.tsx's uFadeShape, anchored at the top
// of this container) was dissolving the flowing texture to solid
// background well before this container's bottom edge — by default
// around 60% down a container this tall. That reads fine when the
// container roughly matches the hero's own height, but after the two
// compaction passes on Hero.tsx the publications team-card row now
// starts much sooner, so the fade was visibly ending partway through
// that row instead of clearing it first — the "flag kepotong" the site
// owner flagged. Raising fadeRy from the shader's own default (0.6)
// stretches the visible texture further down before it dissolves, and
// the taller container gives it the room to do that; both together
// carry the effect through the team-card row instead of cutting across
// it.
export function HeroBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[64rem] overflow-hidden"
    >
      <div className="absolute inset-0 opacity-50 md:opacity-100">
        <ShaderFlow brightness={3} iterations={10} flowSpeed={[0, 0.1]} fadeRy={1} />
      </div>
    </div>
  );
}
