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
// same card anatomy (index + name below an image slot) rather than a
// copy of its exact layout, since the site owner asked for something
// smaller and horizontally swipeable instead. A plain scrollable row
// (real wheel/touch/drag scrolling, not a button-only carousel) plus
// the same small prev/next buttons PublicationsShowcase already uses,
// for the same reason that section has them: some visitors reach for
// a click before a swipe.
//
// Reworked the same day, third request: "howernya kurang kerasa, ga
// seperti di referensi... kartunya pas kotak 1:1 aspek rationya,
// dengan sudut kelengkungan yang relevan dengan kelengkungan frame
// yang lain... tambahi filter tahunnya dong, kyk yang research tadi"
// plus the fuller 10-project list (lib/content/projects.ts). Three
// changes from the first pass:
// 1. The image slot is now square (aspect-square, not aspect-video)
//    and sits inside the same double-bezel frame recipe as Hero's map
//    card and the gallery frame below (rounded-4xl outer, p-1.5,
//    concentric rounded-[1.6rem] inner) instead of a bare bordered box
//    — "sudut kelengkungan yang relevan" was specifically about this
//    inconsistency.
// 2. A real hover effect, matching what the reference site's own
//    project cards actually do (confirmed by reading its live
//    stylesheet, not guessed): the whole card lifts (-translate-y),
//    its border brightens, a soft shadow appears, and the image scales
//    up slightly underneath — clipped by the frame so it never spills
//    past the rounded corners.
// 3. A year filter, reusing the exact YearFilterMenu widget the
//    Research/Publications section already built (components/ui/
//    YearFilterMenu.tsx, extracted from PublicationsShowcase.tsx this
//    same pass) rather than inventing a second one.
//
// Cards are still NOT links: there's no project detail page yet (PRD
// 6.6 / this project's "no dead navigation" rule) — a card that looked
// clickable but went nowhere would be worse than one that plainly
// isn't yet, so the hover effect signals "this card responds to you",
// not "click me". Cover images are the same honest-empty-slot
// convention PublicationCard already uses — most of these ten don't
// have one yet, and that's fine.
//
// Fourth request, same day: "hilangkan nomor didepan tahun pada menu
// project, cukup tahun dan juga nama pengembang" — the plain index
// number (01, 02...) that used to sit next to the year is gone; a new
// `developer` field (lib/content/types.ts, lib/content/projects.ts)
// takes its place, naming who on the team actually built or ran each
// project. An eleventh project ("AI Larasati") arrived in the same
// message with no year or description yet — left unset rather than
// guessed, same as the two studies that already had no year.
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
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

  // Same computed-from-everything, sorted-descending pattern
  // PublicationsShowcase uses for its own year filter: a year button
  // never shifts or disappears just because the scroller is at a
  // different position, and undated projects (#5/#6 in the list) simply
  // don't add a year rather than being forced into a fake one.
  const years = useMemo(
    () =>
      Array.from(new Set(projects.map((p) => p.year).filter((y): y is number => y != null))).sort(
        (a, b) => b - a,
      ),
    [],
  );

  const filtered = useMemo(
    () => projects.filter((p) => activeYear === "all" || String(p.year) === activeYear),
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
            // pt-2/pb-8, not the plain pb-2 this had: `overflow-x-auto`
            // with no explicit overflow-y forces overflow-y to compute
            // as `auto` too (CSS's own overflow rule), which was
            // clipping the hover lift (-translate-y-1) and its shadow
            // against this container's own edges — site owner, 2026-
            // 09-20: "itu bagian card project kalo pas hover atasnya
            // ketutupan/kepotong". This padding gives both room instead
            // of removing the overflow rule the horizontal scroll
            // itself depends on.
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
      {/* Square (1:1), not the previous aspect-video — the site owner's
          own words: "kartunya pas kotak 1:1 aspek rationya". Concentric
          inner radius against the outer rounded-4xl, the same
          double-bezel recipe as Hero's map card and the gallery frame
          below (PublicationsShowcase.tsx), instead of its own
          unrelated radius. Honest empty slot when no coverImage is
          set, same convention as PublicationCard. */}
      <div className="relative aspect-square overflow-hidden rounded-[1.6rem] bg-ink-800">
        {project.coverImage && (
          <Image
            src={project.coverImage}
            alt=""
            fill
            sizes="256px"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.06]"
          />
        )}
      </div>
      <div className="flex flex-col gap-1 px-1.5 pb-1 pt-3">
        {/* Year + developer, replacing the old plain index number
            (site owner, 2026-09-20: "hilangkan nomor didepan tahun
            pada menu project, cukup tahun dan juga nama pengembang")
            — same year/meta pairing PublicationCard already uses
            below its own image (PublicationsShowcase.tsx). */}
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
