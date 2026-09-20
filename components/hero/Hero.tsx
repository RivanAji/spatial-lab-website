import { Container } from "@/components/ui/Container";
import { HeroCanvas } from "./HeroCanvas";
import { HeroCtas } from "./HeroCtas";
import { GRID_COLS, GRID_ROWS } from "@/data/asia-grid";

export function Hero() {
  return (
    <section className="pb-14 pt-28 md:pb-20 md:pt-32">
      <Container>
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:items-stretch md:gap-6">
          <div className="flex flex-col gap-4">
            <h1 className="font-display text-2xl font-semibold leading-[1.1] tracking-tight text-ink-000 sm:text-3xl lg:text-[2.25rem]">
              Transportation &amp;
              <br />
              Spatial Analysis Laboratory
            </h1>
            <p className="max-w-[38ch] font-body text-xs leading-relaxed text-ink-300 sm:text-sm">
              Exploring cities through space, mobility, data and intelligent
              systems.
            </p>
            <HeroCtas />
          </div>

          <div className="flex justify-center md:justify-end">
            <div
              className="w-full rounded-4xl border border-white/8 bg-ink-900 p-1.5 shadow-sm md:w-2/3"
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
