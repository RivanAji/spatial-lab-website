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
export function HeroBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[56rem] overflow-hidden"
    >
      <div className="absolute inset-0 opacity-50 md:opacity-100">
        <ShaderFlow brightness={3} iterations={10} flowSpeed={[0, 0.1]} />
      </div>
    </div>
  );
}
