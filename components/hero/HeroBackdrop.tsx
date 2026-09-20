import { ShaderFlow } from "@/components/shaders/shader-flow";

// The shared wrapper sizes this backdrop to Hero and Publications together; avoid fixed heights.
// Keep the horizontal fade narrow so the monochrome glow stays inside wide desktop frames.
export function HeroBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 opacity-50 md:opacity-100">
        <ShaderFlow brightness={3} iterations={10} flowSpeed={[0, 0.1]} fadeRx={0.65} />
      </div>
    </div>
  );
}
