"use client";

// Added 2026-09-20 (site owner's request), replacing "About" in the
// nav outright: "project ini taruh aja dibawahnya gallery card
// research, kontennya menyusul tapi kasih space dan link ke menu bar
// aja dulu" — a real section, sitting directly below the publications
// gallery (app/page.tsx), so the nav's `#project` anchor lands
// somewhere real instead of a blank scroll target.
//
// Cards added the same day, second request: "buatkan kartu project
// seperti [rbp-portfolio.vercel.app]... tapi ukurannya kecil dan
// lebih ke menyamping, nanti bisa di swipe ke kanan dan ke kiri" — the
// reference's own project section is a big 2-column grid (large 16:9
// screenshots, a headline sentence, a description paragraph, a meta
// line); this is a deliberately smaller, single-row variant of that
// same card anatomy (index + name below a landscape image slot)
// rather than a copy of its exact layout, since the site owner asked
// for something smaller and horizontally swipeable instead. A plain
// scrollable row (real wheel/touch/drag scrolling, not a button-only
// carousel) plus the same small prev/next buttons PublicationsShowcase
// already uses, for the same reason that section has them: some
// visitors reach for a click before a swipe.
//
// Cards are NOT links: there's no project detail page yet (PRD 6.6 /
// this project's "no dead navigation" rule) — a card that looked
// clickable but went nowhere would be worse than one that plainly
// isn't yet. Cover images are the same honest-empty-slot convention
// PublicationCard already uses (lib/content/projects.ts) — the site
// owner's own words: "gambarnya kosongan dulu aja".
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { Container } from "@/components/ui/Container";
import { projects } from "@/lib/content/projects";
import type { Project as ProjectItem } from "@/lib/content/types";

export function Project() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  function updateScrollButtons() {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollPrev(el.scrollLeft > 4);
    setCanScrollNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }

  useEffect(() => {
    updateScrollButtons();
  }, []);

  function scrollByPage(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: "smooth" });
  }

  return (
    <section id="project" aria-label="Project" className="scroll-mt-24 py-8 md:py-10">
      <Container>
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-xl font-semibold tracking-tight text-ink-000 md:text-2xl">
            Project
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Scroll projects left"
              disabled={!canScrollPrev}
              onClick={() => scrollByPage(-1)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-500 text-ink-100 transition-colors hover:border-ink-000 hover:text-ink-000 disabled:opacity-30 disabled:hover:border-ink-500 disabled:hover:text-ink-100"
            >
              <CaretLeft size={13} weight="bold" />
            </button>
            <button
              type="button"
              aria-label="Scroll projects right"
              disabled={!canScrollNext}
              onClick={() => scrollByPage(1)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-500 text-ink-100 transition-colors hover:border-ink-000 hover:text-ink-000 disabled:opacity-30 disabled:hover:border-ink-500 disabled:hover:text-ink-100"
            >
              <CaretRight size={13} weight="bold" />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          onScroll={updateScrollButtons}
          style={{
            maskImage: "linear-gradient(to right, transparent, black 3%, black 97%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 3%, black 97%, transparent)",
          }}
          className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function ProjectCard({ project, index }: { project: ProjectItem; index: number }) {
  return (
    <div className="flex w-56 flex-shrink-0 snap-start flex-col gap-2 sm:w-64">
      {/* Honest empty slot when no coverImage is set — same convention
          as PublicationCard (components/sections/PublicationsShowcase.
          tsx). aspect-video (16:9), wider/shorter than PublicationCard's
          own 3:2 — "lebih ke menyamping" was the specific ask here. */}
      <div className="relative aspect-video overflow-hidden rounded-panel border border-ink-500 bg-ink-800">
        {project.coverImage && (
          <Image
            src={project.coverImage}
            alt=""
            fill
            sizes="256px"
            className="object-cover"
          />
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-[10px] text-ink-300">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="font-display text-sm font-semibold text-ink-000">{project.name}</h3>
      </div>
    </div>
  );
}
