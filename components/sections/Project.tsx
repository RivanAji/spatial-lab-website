"use client";

// Projects use a horizontal scroll row with square cards, year filtering, and hover feedback.
// Cards remain non-links until detail pages exist; missing years and images stay unset rather than fabricated.
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { assetPath } from "@/lib/asset-path";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { YearFilterMenu } from "@/components/ui/YearFilterMenu";
import { projects } from "@/lib/content/projects";
import type { Project as ProjectItem } from "@/lib/content/types";

export function Project() {
  const [activeYear, setActiveYear] = useState<string>("all");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Build stable year options from all projects; undated entries remain undated.
  const years = useMemo(
    () =>
      Array.from(new Set(projects.map((p) => p.year).filter((y): y is number => y != null))).sort(
        (a, b) => b - a,
      ),
    [],
  );

  // Sort newest first and keep undated projects last.
  const filtered = useMemo(
    () =>
      projects
        .filter((p) => activeYear === "all" || String(p.year) === activeYear)
        .sort((a, b) => (b.year ?? -Infinity) - (a.year ?? -Infinity)),
    [activeYear],
  );

  function updateScrollButtons() {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollPrev(el.scrollLeft > 4);
    setCanScrollNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: 0 });
    updateScrollButtons();
  }, [activeYear]);

  function scrollByPage(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: "smooth" });
  }

  return (
    <section id="project" aria-label="Project" className="scroll-mt-24 py-8 md:py-10">
      <Container>
        <h2 className="font-display text-xl font-semibold tracking-tight text-ink-000 md:text-2xl">
          Project
        </h2>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <YearFilterMenu years={years} activeYear={activeYear} onChange={setActiveYear} />

          {filtered.length > 0 && (
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Scroll projects left"
                disabled={!canScrollPrev}
                onClick={() => scrollByPage(-1)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-500 md:h-8 md:w-8 text-ink-100 transition-colors hover:border-ink-000 hover:text-ink-000 disabled:opacity-30 disabled:hover:border-ink-500 disabled:hover:text-ink-100"
              >
                <CaretLeft size={13} weight="bold" />
              </button>
              <button
                type="button"
                aria-label="Scroll projects right"
                disabled={!canScrollNext}
                onClick={() => scrollByPage(1)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-500 md:h-8 md:w-8 text-ink-100 transition-colors hover:border-ink-000 hover:text-ink-000 disabled:opacity-30 disabled:hover:border-ink-500 disabled:hover:text-ink-100"
              >
                <CaretRight size={13} weight="bold" />
              </button>
            </div>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-6 flex flex-col items-start gap-4 border border-ink-500 p-10">
            <p className="font-body text-ink-100">No projects from this year yet.</p>
            <Button variant="secondary" onClick={() => setActiveYear("all")}>
              Reset filter
            </Button>
          </div>
        ) : (
          <div
            ref={scrollerRef}
            onScroll={updateScrollButtons}
            style={{
              maskImage: "linear-gradient(to right, transparent, black 3%, black 97%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 3%, black 97%, transparent)",
            }}
            // Vertical padding keeps the hover lift and shadow visible inside horizontal overflow.
            className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pt-2 pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {filtered.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

function ProjectCard({ project }: { project: ProjectItem }) {
  return (
    <div
      className="group w-56 flex-shrink-0 snap-start rounded-4xl border border-white/8 bg-ink-900 p-1.5 transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_20px_40px_-16px_rgba(0,0,0,0.6),0_8px_16px_-8px_rgba(0,0,0,0.4)] sm:w-64"
    >
      {/* Square frame matching the site's other cards; missing cover images remain empty. */}
      <div className="relative aspect-square overflow-hidden rounded-[1.6rem] bg-ink-800">
        {project.coverImage && (
          <Image
          src={assetPath(project.coverImage)}
            alt=""
            fill
            sizes="256px"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.06]"
          />
        )}
      </div>
      <div className="flex flex-col gap-1 px-1.5 pb-1 pt-3">
        {/* Show the verified year and developer instead of a synthetic project index. */}
        <div className="flex items-baseline gap-1.5">
          {project.year && (
            <span className="shrink-0 font-mono text-[10px] text-ink-300">{project.year}</span>
          )}
          {project.developer && (
            <span className="line-clamp-1 font-body text-[10px] text-ink-300">
              {project.developer}
            </span>
          )}
        </div>
        <h3 className="line-clamp-2 font-display text-sm font-semibold leading-snug text-ink-000">
          {project.name}
        </h3>
      </div>
    </div>
  );
}
