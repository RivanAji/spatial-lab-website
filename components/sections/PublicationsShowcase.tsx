"use client";

/*
 * Publications showcase, directly under the hero (site owner's request,
 * 2026-09-19): shrinking the hero (Hero.tsx) freed the space for this to
 * sit right at the fold instead of requiring a scroll to reach, which was
 * the actual point of that change, not just a cosmetic resize.
 *
 * Two things merged into one interactive unit here:
 *
 * 1. The team cards that used to live inside Hero.tsx as "TeamsTeaser" —
 *    moved here wholesale (illustrations included) and repurposed from
 *    navigation links into filter buttons: clicking "Sustainable Urban
 *    Transportation" filters the slider below to that team, clicking it
 *    again (or "All teams") clears the filter. The separate Research
 *    Teams section (components/sections/ResearchTeams.tsx) that used to
 *    be the only place linking to a team's own page was removed the same
 *    day (site owner's direct request) once this section's cards made it
 *    redundant — there is currently no homepage link to a team's `/
 *    research/[slug]` page any more, which is a known follow-on gap, not
 *    an oversight.
 * 2. A new horizontal, snap-scrolling publication slider (site owner's
 *    reference: collectui.com/designs/image-slider-ui-design-inspiration,
 *    the cover-flow and caption-under-image examples) with its own year
 *    filter row above it.
 *
 * Cover images: the underlying publication data (lib/content/publications.
 * ts) has never carried real cover images — ResearchArchive.tsx shipped
 * text-only on purpose because no real images existed, and PRD 6.6 bans
 * stock photography standing in for real output. That's still true here.
 * `coverImage` is a new optional field (lib/content/types.ts) the site
 * owner will fill in by hand per publication; until then each card's
 * image slot renders as a plain, undecorated panel — an honest empty
 * slot, not a fake cover.
 */

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { teams } from "@/lib/content/teams";
import { publications } from "@/lib/content/publications";
import type { TeamSlug } from "@/lib/content/types";
import { Container } from "@/components/ui/Container";
import { FilterChip } from "@/components/ui/FilterChip";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const EASE = [0.22, 1, 0.36, 1] as const;

// ---- Illustration 1: Sustainable Urban Transportation ----
// A road network: edges draw themselves in, nodes pop in staggered
// after, then a small pulse loops along the network while the card
// stays revealed — a literal diagram of a transport network, not a
// generic route icon.
function TransportIllustration({ playing }: { playing: boolean }) {
  const nodes: [number, number][] = [
    [8, 52],
    [38, 20],
    [68, 52],
    [98, 24],
    [53, 36],
  ];
  const edges: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [1, 4],
    [4, 2],
  ];
  const path = "M8 52 L38 20 L53 36 L68 52 L98 24";

  return (
    <svg viewBox="0 0 120 72" fill="none" className="h-full w-full">
      {edges.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={nodes[a][0]}
          y1={nodes[a][1]}
          x2={nodes[b][0]}
          y2={nodes[b][1]}
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0.3 }}
          animate={playing ? { pathLength: 1, opacity: 0.55 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
        />
      ))}
      {nodes.map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r={i === 1 ? 3.2 : 2.4}
          fill="currentColor"
          initial={{ scale: 0, opacity: 0 }}
          animate={playing ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.3 + i * 0.07, ease: EASE }}
        />
      ))}
      {/* Plain CSS animation, not Motion — see the --animate-travel-path
          comment in globals.css for why. offset-path is the one part
          that has to stay a per-element inline style (each illustration
          traces a different path); the 0%->100% sweep itself is shared. */}
      <circle
        r="2"
        fill="currentColor"
        opacity={playing ? undefined : 0}
        className={playing ? "motion-safe:animate-travel-path" : undefined}
        style={{ offsetPath: `path("${path}")`, animationDelay: "0.9s" }}
      />
    </svg>
  );
}

// ---- Illustration 2: Spatial Data Science & AI for Urban Analytics ----
// Two offset "map layers" (rects with a light grid) fade and slide into
// alignment — GIS layer stacking — behind a small decision-tree graph
// (a root splitting into branches, one branch resolving as "chosen")
// standing in for an algorithm evaluating a split, which is the actual
// subject (machine learning / decision-tree style methods), not a
// literal neural-net cliché.
function DataScienceIllustration({ playing }: { playing: boolean }) {
  const tree = {
    root: [66, 14] as [number, number],
    a: [46, 34] as [number, number],
    b: [90, 34] as [number, number],
    a1: [34, 54] as [number, number],
    a2: [56, 54] as [number, number],
  };

  return (
    <svg viewBox="0 0 120 72" fill="none" className="h-full w-full">
      {/* map layers */}
      <motion.g
        initial={{ opacity: 0, x: -6, y: 6 }}
        animate={playing ? { opacity: 0.25, x: 0, y: 0 } : { opacity: 0, x: -6, y: 6 }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <rect x="4" y="26" width="44" height="34" rx="2" stroke="currentColor" strokeWidth="1" />
        <path d="M4 38h44M4 50h44M18 26v34M32 26v34" stroke="currentColor" strokeWidth="0.6" />
      </motion.g>
      <motion.g
        initial={{ opacity: 0, x: 6, y: -6 }}
        animate={playing ? { opacity: 0.4, x: 0, y: 0 } : { opacity: 0, x: 6, y: -6 }}
        transition={{ duration: 0.45, delay: 0.1, ease: EASE }}
      >
        <rect x="10" y="20" width="44" height="34" rx="2" stroke="currentColor" strokeWidth="1" />
        <path d="M10 32h44M10 44h44M24 20v34M38 20v34" stroke="currentColor" strokeWidth="0.6" />
      </motion.g>

      {/* decision-tree motif */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: playing ? 1 : 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
      >
        <motion.line
          x1={tree.root[0]} y1={tree.root[1]} x2={tree.a[0]} y2={tree.a[1]}
          stroke="currentColor" strokeWidth="1.2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: playing ? 1 : 0 }}
          transition={{ duration: 0.3, delay: 0.35, ease: EASE }}
        />
        <motion.line
          x1={tree.root[0]} y1={tree.root[1]} x2={tree.b[0]} y2={tree.b[1]}
          stroke="currentColor" strokeWidth="1.2" opacity="0.35"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: playing ? 1 : 0 }}
          transition={{ duration: 0.3, delay: 0.35, ease: EASE }}
        />
        <motion.line
          x1={tree.a[0]} y1={tree.a[1]} x2={tree.a1[0]} y2={tree.a1[1]}
          stroke="currentColor" strokeWidth="1.2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: playing ? 1 : 0 }}
          transition={{ duration: 0.3, delay: 0.55, ease: EASE }}
        />
        <motion.line
          x1={tree.a[0]} y1={tree.a[1]} x2={tree.a2[0]} y2={tree.a2[1]}
          stroke="currentColor" strokeWidth="1.2" opacity="0.35"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: playing ? 1 : 0 }}
          transition={{ duration: 0.3, delay: 0.55, ease: EASE }}
        />
        {[tree.root, tree.a, tree.b, tree.a1, tree.a2].map(([x, y], i) => (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r={i === 0 ? 2.6 : 2}
            fill="currentColor"
            initial={{ scale: 0 }}
            animate={{ scale: playing ? 1 : 0 }}
            transition={{ duration: 0.25, delay: 0.3 + i * 0.1, ease: EASE }}
          />
        ))}
      </motion.g>
    </svg>
  );
}

// ---- Illustration 3: Decision Support & Climate Change ----
// A branching decision path (one option resolves as "selected" via a
// travelling marker) drawn above a slowly oscillating wave line —
// standing in for climate variability / scenario data — rather than a
// literal weather icon.
function ClimateIllustration({ playing }: { playing: boolean }) {
  const path = "M10 26 L46 26 L80 10";
  const branch = "M46 26 L84 42";

  return (
    <svg viewBox="0 0 120 72" fill="none" className="h-full w-full">
      <motion.path
        d={path}
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0.6 }}
        animate={{ pathLength: playing ? 1 : 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      />
      <motion.path
        d={branch}
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: playing ? 1 : 0 }}
        transition={{ duration: 0.4, delay: 0.15, ease: EASE }}
      />
      {[
        [10, 26],
        [46, 26],
        [80, 10],
        [84, 42],
      ].map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r={i === 1 ? 2.6 : 2}
          fill="currentColor"
          initial={{ scale: 0 }}
          animate={{ scale: playing ? 1 : 0 }}
          transition={{ duration: 0.25, delay: 0.25 + i * 0.08, ease: EASE }}
        />
      ))}
      {/* Plain CSS animation — see globals.css --animate-travel-path. */}
      <circle
        r="2"
        fill="currentColor"
        opacity={playing ? undefined : 0}
        className={playing ? "motion-safe:animate-travel-path" : undefined}
        style={{ offsetPath: `path("${path}")`, animationDuration: "1.8s", animationDelay: "0.7s" }}
      />

      {/* climate wave */}
      <motion.path
        d="M4 62 Q 16 54, 28 62 T 52 62 T 76 62 T 100 62 T 116 62"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.4"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={
          playing
            ? { pathLength: 1, opacity: 0.4, x: [0, -24, 0] }
            : { pathLength: 0, opacity: 0, x: 0 }
        }
        transition={{
          pathLength: { duration: 0.6, delay: 0.4, ease: EASE },
          opacity: { duration: 0.4, delay: 0.4 },
          x: { duration: 6, delay: 1, repeat: Infinity, ease: "linear" },
        }}
      />
    </svg>
  );
}

const ILLUSTRATIONS = [TransportIllustration, DataScienceIllustration, ClimateIllustration];

export function PublicationsShowcase(): ReactNode {
  const [activeTeam, setActiveTeam] = useState<TeamSlug | "all">("all");
  const [activeYear, setActiveYear] = useState<string>("all");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Years are computed from every publication, not the filtered subset —
  // matching ResearchArchive.tsx's own year-filter behaviour, so a year
  // button never shifts position or disappears just because a team filter
  // is also active.
  const years = useMemo(
    () => Array.from(new Set(publications.map((p) => p.year))).sort((a, b) => b - a),
    [],
  );

  const filtered = useMemo(
    () =>
      publications
        .filter((p) => activeTeam === "all" || p.team === activeTeam)
        .filter((p) => activeYear === "all" || String(p.year) === activeYear)
        .sort((a, b) => b.year - a.year),
    [activeTeam, activeYear],
  );

  function updateScrollButtons() {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollPrev(el.scrollLeft > 4);
    setCanScrollNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }

  useEffect(() => {
    // Filter changes can shrink the slider's scrollWidth out from under an
    // old scroll position (e.g. it was scrolled right, then a filter drops
    // it back to a handful of cards) — re-measure rather than trust stale
    // button state.
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: 0 });
    updateScrollButtons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTeam, activeYear]);

  function scrollByPage(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: "smooth" });
  }

  return (
    // id="research", not "publications": this is the "Explore Research"
    // hero CTA's scroll target (HeroCtas.tsx, href="#research") since the
    // Research Teams section that anchor used to point to is gone.
    // scroll-mt-24 keeps the section from landing directly under the
    // fixed nav pill (components/layout/Header.tsx), same reasoning that
    // section used.
    //
    // No visible heading (site owner's request, 2026-09-19 — removed the
    // "Publications" h2, the "All teams" text button, and the description
    // line that used to sit here, to save vertical space). aria-label
    // keeps the section a named landmark for assistive tech even with no
    // visible heading; "All teams" as a reset control isn't missing
    // functionality, since clicking an already-active team card toggles
    // it off (TeamFilterCard's onSelect below).
    <section id="research" aria-label="Publications" className="scroll-mt-24 pb-16 pt-2 md:pb-20 md:pt-4">
      <Container>
        <div className="flex flex-wrap gap-3">
          {teams.map((team, index) => (
            <TeamFilterCard
              key={team.slug}
              team={team}
              Illustration={ILLUSTRATIONS[index]}
              active={activeTeam === team.slug}
              onSelect={() =>
                setActiveTeam((current) => (current === team.slug ? "all" : team.slug))
              }
            />
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <FilterChip active={activeYear === "all"} onClick={() => setActiveYear("all")}>
              All years
            </FilterChip>
            {years.map((year) => (
              <FilterChip
                key={year}
                active={activeYear === String(year)}
                onClick={() => setActiveYear(String(year))}
              >
                {year}
              </FilterChip>
            ))}
          </div>

          {filtered.length > 0 && (
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Scroll publications left"
                disabled={!canScrollPrev}
                onClick={() => scrollByPage(-1)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-500 text-ink-100 transition-colors hover:border-ink-000 hover:text-ink-000 disabled:opacity-30 disabled:hover:border-ink-500 disabled:hover:text-ink-100"
              >
                <CaretLeft size={16} weight="bold" />
              </button>
              <button
                type="button"
                aria-label="Scroll publications right"
                disabled={!canScrollNext}
                onClick={() => scrollByPage(1)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-500 text-ink-100 transition-colors hover:border-ink-000 hover:text-ink-000 disabled:opacity-30 disabled:hover:border-ink-500 disabled:hover:text-ink-100"
              >
                <CaretRight size={16} weight="bold" />
              </button>
            </div>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-8 flex flex-col items-start gap-4 border border-ink-500 p-10">
            <p className="font-body text-ink-100">
              No publications match this combination of team and year yet.
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                setActiveTeam("all");
                setActiveYear("all");
              }}
            >
              Reset filters
            </Button>
          </div>
        ) : (
          <div
            ref={scrollerRef}
            onScroll={updateScrollButtons}
            className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {filtered.map((pub) => (
              <PublicationCard key={pub.slug} publication={pub} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

// Title above the image, truncated with an ellipsis at 2 lines (CSS
// line-clamp, not a manual word-slice — so it always breaks cleanly at
// a word boundary regardless of title length), year and author small
// below. No team label (site owner's request, 2026-09-19: "gaperlu ada
// keterangan ini masuk decision support and climate... bikin terlalu
// padat") — a card in a team-filtered slider naming its own team on
// every card was redundant with the filter that put it there, and it
// was the single densest line on the card.
function PublicationCard({ publication }: { publication: (typeof publications)[number] }) {
  return (
    <Link
      href={`/publications/${publication.slug}`}
      className="group flex w-72 flex-shrink-0 snap-start flex-col gap-3 sm:w-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-000"
    >
      <h3 className="line-clamp-2 font-display text-sm font-semibold leading-snug text-ink-000">
        {publication.title}
      </h3>

      {/* Honest empty slot when no coverImage is set — see this file's
          top comment and lib/content/types.ts. Never a stock photo
          standing in for a real one. */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-panel border border-ink-500 bg-ink-800 transition-colors group-hover:border-ink-300">
        {publication.coverImage && (
          <Image
            src={publication.coverImage}
            alt=""
            fill
            sizes="(min-width: 640px) 320px, 288px"
            className="object-cover"
          />
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <p className="font-mono text-xs text-ink-300">{publication.year}</p>
        <p className="font-body text-xs text-ink-300">{publication.authors}</p>
      </div>
    </Link>
  );
}

// Flip card (site owner's request, 2026-09-19, replacing the earlier
// fade-reveal version): front face is the number and team name only,
// back face is the illustration and tagline. A standard 3D-flip CSS
// technique (perspective on the outer element, preserve-3d on the
// rotating layer, backface-visibility: hidden on each face, the back
// face pre-rotated 180deg so it lands right-side-up when the layer
// hits 180) driven by Motion's `rotateY`, which — unlike offsetDistance
// (see globals.css's --animate-travel-path comment) — Motion animates
// natively without issue.
//
// Refined a second time the same day: the site owner's exact words were
// "animasinya masih terlihat AI Slop" (still reads as AI slop) even
// with the flip itself working. Three concrete craft fixes, not a
// change of concept (the flip stays; that was an explicit direction
// this same day):
// - `perspective` raised from 1000 to 1800: a shallow perspective value
//   exaggerates the fisheye distortion on the card's edges mid-rotation,
//   which is exactly the "cheap CSS-tutorial flip-card" tell. A larger
//   value flattens that distortion, closer to how a real object turning
//   at a distance would actually look.
// - `scale` now dips slightly (1 -> 0.94 -> 1) alongside the rotation
//   instead of rotateY alone — a flat rotation with no other motion
//   reads as a mechanical hinge; a small lift-and-settle reads as a
//   card actually being turned. This is the same physical-motion
//   principle behind the hero canvas's pointer parallax and the travel-
//   path markers elsewhere in this file, applied here instead of left
//   as the one un-crafted motion moment in the section.
// - Faster, at 0.4s: a slow rotation on an element this small (now
//   roughly half its previous height, see below) reads as sluggish,
//   which is its own kind of over-animated-for-no-reason tell (core
//   antislop R-19 — motion must have a purpose, and "make a small card
//   feel weighty" isn't one).
//
// Height halved (site owner: "tingginya aja yang dikurangi 50%, jadi
// lebih tipis") — width stays, since the site owner separately
// confirmed the width was already right. Front-face content re-laid
// out for the flatter shape (tight stack, not spread top/bottom — there
// isn't room to spread across ~90px any more) and the back face's
// illustration shrunk and its tagline clamped to 3 lines so nothing
// overflows a face this short.
//
// Radius: both faces share one value (rounded-xl, 12px) rather than the
// previous rounded-2xl (16px) — at half the height a 16px radius reads
// disproportionately large relative to the card's own corners, which is
// its own small inconsistency; 12px is the value that still reads soft
// (matching the rest of this section) without looking oversized on a
// card this flat.
function TeamFilterCard({
  team,
  Illustration,
  active,
  onSelect,
}: {
  team: (typeof teams)[number];
  Illustration: (props: { playing: boolean }) => ReactNode;
  active: boolean;
  onSelect: () => void;
}): ReactNode {
  const [hovered, setHovered] = useState(false);
  const reducedMotion = useReducedMotion();

  // Tapping is the whole interaction on touch (no hover to chase), and
  // the front face already carries real content (number + name), so
  // there's no empty-card state to guard against here the way the old
  // fade-reveal version had to.
  const flipped = active || hovered;
  const playing = flipped && !reducedMotion;

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      style={{ perspective: 1800 }}
      className="h-[88px] w-40 shrink-0 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-000 sm:h-24 sm:w-44"
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0, scale: reducedMotion ? 1 : [1, 0.94, 1] }}
        transition={{ duration: reducedMotion ? 0 : 0.4, ease: EASE }}
      >
        {/* Front */}
        <div
          style={{ backfaceVisibility: "hidden" }}
          className={cn(
            "absolute inset-0 flex flex-col justify-center gap-1 overflow-hidden rounded-xl border bg-ink-900 p-3 transition-colors duration-300",
            active ? "border-ink-000" : "border-white/8",
          )}
        >
          <p className="font-mono text-[9px] text-ink-300">
            {String(team.number).padStart(2, "0")}
          </p>
          <h3 className="line-clamp-3 font-display text-xs font-semibold leading-snug text-ink-000">
            {team.name}
          </h3>
        </div>

        {/* Back */}
        <div
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          className={cn(
            "absolute inset-0 flex flex-col justify-center gap-1 overflow-hidden rounded-xl border bg-ink-900 p-3 transition-colors duration-300",
            active ? "border-ink-000" : "border-white/8",
          )}
        >
          <div aria-hidden="true" className="h-6 w-full text-ink-100">
            <Illustration playing={playing} />
          </div>
          <p className="line-clamp-3 font-body text-[10px] leading-snug text-ink-300">
            {team.tagline}
          </p>
        </div>
      </motion.div>
    </button>
  );
}
