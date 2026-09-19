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
// Rebuilt substantially (site owner's request, 2026-09-19: the original
// 5-node graph "tampak biasa sekali" / read as too plain). Now a small
// street grid with static low-opacity building blocks for urban
// texture, real intersections, and two independent vehicle glyphs
// (not one dot) running their own routes at different speeds — one the
// full outer loop, one a shorter spur — each oriented to the direction
// of travel via `offset-rotate: auto`. Still plain <rect>/<circle>
// elements for the travelling glyphs, not motion.*, driven by the CSS
// --animate-travel-path keyframes (globals.css) — Motion doesn't
// animate offsetDistance (see that file's comment); everything else
// here that ISN'T on an offset-path still safely uses Motion.
function TransportIllustration({ playing }: { playing: boolean }) {
  const roads = ["M8 28 L132 28", "M8 68 L132 68", "M35 8 L35 82", "M104 8 L104 82"];
  const intersections: [number, number][] = [
    [35, 28],
    [104, 28],
    [35, 68],
    [104, 68],
  ];
  const buildings: [number, number, number, number][] = [
    [14, 12, 12, 10],
    [50, 12, 10, 8],
    [112, 12, 12, 10],
    [14, 74, 12, 8],
    [50, 76, 10, 6],
    [112, 74, 12, 8],
  ];
  const loopRoute = "M8 28 L132 28 L132 68 L8 68 Z";
  const spurRoute = "M35 8 L35 82";

  return (
    <svg viewBox="0 0 140 90" fill="none" className="h-full w-full">
      {buildings.map(([x, y, w, h], i) => (
        <motion.rect
          key={i}
          x={x}
          y={y}
          width={w}
          height={h}
          rx={1}
          stroke="currentColor"
          strokeWidth="0.6"
          initial={{ opacity: 0 }}
          animate={{ opacity: playing ? 0.18 : 0 }}
          transition={{ duration: 0.4, delay: 0.04 * i, ease: EASE }}
        />
      ))}

      {roads.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0.3 }}
          animate={playing ? { pathLength: 1, opacity: 0.55 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease: EASE }}
        />
      ))}

      {intersections.map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r={2.4}
          fill="currentColor"
          initial={{ scale: 0, opacity: 0 }}
          animate={playing ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.65 + i * 0.06, ease: EASE }}
        />
      ))}

      {/* Vehicle 1 and its comet trail: a second, dimmer copy on the same
          route with a slightly later animation-delay, so at any instant
          it renders where the lead vehicle was a beat earlier — reads as
          a fading trail, not a second car. Plain elements, not
          motion.* — see the file-top note on why the travelling glyphs
          stay off Motion's animate prop. */}
      <rect
        width="3.6"
        height="2.2"
        x="-1.8"
        y="-1.1"
        rx="0.7"
        fill="currentColor"
        opacity={playing ? 0.3 : 0}
        className={playing ? "motion-safe:animate-travel-path" : undefined}
        style={{
          offsetPath: `path("${loopRoute}")`,
          offsetRotate: "auto",
          animationDuration: "3.8s",
          animationDelay: "1.02s",
        }}
      />
      <rect
        width="4.4"
        height="2.6"
        x="-2.2"
        y="-1.3"
        rx="0.8"
        fill="currentColor"
        opacity={playing ? undefined : 0}
        className={playing ? "motion-safe:animate-travel-path" : undefined}
        style={{
          offsetPath: `path("${loopRoute}")`,
          offsetRotate: "auto",
          animationDuration: "3.8s",
          animationDelay: "0.9s",
        }}
      />

      {/* Vehicle 2: the vertical spur, a shorter, quicker route, plus its
          own trail. */}
      <rect
        width="3"
        height="1.8"
        x="-1.5"
        y="-0.9"
        rx="0.6"
        fill="currentColor"
        opacity={playing ? 0.28 : 0}
        className={playing ? "motion-safe:animate-travel-path" : undefined}
        style={{
          offsetPath: `path("${spurRoute}")`,
          offsetRotate: "auto",
          animationDuration: "2.3s",
          animationDelay: "1.28s",
        }}
      />
      <rect
        width="3.6"
        height="2.2"
        x="-1.8"
        y="-1.1"
        rx="0.7"
        fill="currentColor"
        opacity={playing ? 0.75 : 0}
        className={playing ? "motion-safe:animate-travel-path" : undefined}
        style={{
          offsetPath: `path("${spurRoute}")`,
          offsetRotate: "auto",
          animationDuration: "2.3s",
          animationDelay: "1.15s",
        }}
      />
    </svg>
  );
}

// ---- Illustration 2: Spatial Data Science & AI for Urban Analytics ----
// Rebuilt: three stacked GIS layers now (not two), each with a visually
// distinct pattern — points, a road grid, a zoning hatch — so they read
// as different DATA layers rather than one rect repeated. A scan bar
// sweeps down across the stack on a slow loop once revealed, standing
// in for a classification pass. The decision tree deepened to a full
// root -> branch -> leaf structure with the resolved root-to-leaf path
// drawn heavier and carrying its own travelling marker, the two
// unresolved branches left dim — a clearer "the model is evaluating and
// choosing a path" read than the original's single fork.
function DataScienceIllustration({ playing }: { playing: boolean }) {
  const layers = [
    { x: 6, y: 34, opacity: 0.35, delay: 0.05 },
    { x: 12, y: 28, opacity: 0.45, delay: 0.15 },
    { x: 18, y: 22, opacity: 0.6, delay: 0.25 },
  ];
  const tree = {
    root: [96, 10] as [number, number],
    a: [78, 30] as [number, number],
    b: [116, 30] as [number, number],
    a1: [64, 52] as [number, number],
    a2: [88, 52] as [number, number],
  };
  const resolvedPath = `M${tree.root[0]} ${tree.root[1]} L${tree.a[0]} ${tree.a[1]} L${tree.a1[0]} ${tree.a1[1]}`;

  return (
    <svg viewBox="0 0 140 90" fill="none" className="h-full w-full">
      {/* Monochrome beam gradient for the scan bar below — fading top and
          bottom edges read as a beam of light, not a flat grey rectangle.
          Still strictly white/transparent (PRD 6.2's single-neutral-
          emphasis rule), no colour. */}
      <defs>
        <linearGradient id="ds-scan-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.9" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Three GIS layers, each a distinct pattern so they read as
          different data, not one rect duplicated. */}
      {layers.map((layer, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0, x: -5 + i * 2, y: 5 - i * 2 }}
          animate={
            playing
              ? { opacity: layer.opacity, x: 0, y: 0 }
              : { opacity: 0, x: -5 + i * 2, y: 5 - i * 2 }
          }
          transition={{ duration: 0.45, delay: layer.delay, ease: EASE }}
        >
          <rect x={layer.x} y={layer.y} width="40" height="30" rx="2" stroke="currentColor" strokeWidth="1" />
          {i === 0 && (
            // points layer
            <g fill="currentColor">
              {[0, 1, 2].flatMap((row) =>
                [0, 1, 2].map((col) => (
                  <circle
                    key={`${row}-${col}`}
                    cx={layer.x + 8 + col * 12}
                    cy={layer.y + 8 + row * 10}
                    r="1"
                  />
                )),
              )}
            </g>
          )}
          {i === 1 && (
            // road grid layer
            <path
              d={`M${layer.x} ${layer.y + 10}h40M${layer.x} ${layer.y + 20}h40M${layer.x + 13} ${layer.y}v30M${layer.x + 27} ${layer.y}v30`}
              stroke="currentColor"
              strokeWidth="0.6"
            />
          )}
          {i === 2 && (
            // zoning hatch layer
            <path
              d={`M${layer.x} ${layer.y + 30}L${layer.x + 40} ${layer.y}M${layer.x} ${layer.y + 20}L${layer.x + 30} ${layer.y}M${layer.x} ${layer.y + 10}L${layer.x + 20} ${layer.y}`}
              stroke="currentColor"
              strokeWidth="0.6"
            />
          )}
        </motion.g>
      ))}

      {/* Classification scan sweeping the stack, looping while revealed —
          drawn with the beam gradient above instead of a flat fill. */}
      <motion.rect
        x="4"
        width="46"
        height="5"
        fill="url(#ds-scan-beam)"
        initial={{ y: 18, opacity: 0 }}
        animate={
          playing
            ? { y: [18, 58, 18], opacity: [0, 1, 1, 0] }
            : { y: 18, opacity: 0 }
        }
        transition={{ duration: 3.2, delay: 0.9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Decision tree: root -> two branches -> resolved leaf. */}
      <motion.line
        x1={tree.root[0]} y1={tree.root[1]} x2={tree.b[0]} y2={tree.b[1]}
        stroke="currentColor" strokeWidth="1" opacity="0.3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: playing ? 1 : 0 }}
        transition={{ duration: 0.3, delay: 0.4, ease: EASE }}
      />
      <motion.line
        x1={tree.a[0]} y1={tree.a[1]} x2={tree.a2[0]} y2={tree.a2[1]}
        stroke="currentColor" strokeWidth="1" opacity="0.3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: playing ? 1 : 0 }}
        transition={{ duration: 0.3, delay: 0.55, ease: EASE }}
      />
      <motion.path
        d={resolvedPath}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: playing ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.4, ease: EASE }}
      />
      {[tree.root, tree.a, tree.b, tree.a1, tree.a2].map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r={i === 0 ? 2.6 : i === 3 ? 2.4 : 2}
          fill="currentColor"
          opacity={i === 2 || i === 4 ? 0.4 : 1}
          initial={{ scale: 0 }}
          animate={{ scale: playing ? 1 : 0 }}
          transition={{ duration: 0.25, delay: 0.45 + i * 0.08, ease: EASE }}
        />
      ))}
      {/* Root node pulse, looping while revealed — same idle-pulse
          language as the hero locator (HeroCanvas.tsx), animating `r`
          directly rather than a `scale` transform, which sidesteps any
          SVG transform-origin fuss for a circle that isn't centred on
          the viewport. Reads as "the model is live", not decoration. */}
      <motion.circle
        cx={tree.root[0]}
        cy={tree.root[1]}
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
        initial={{ r: 2.6, opacity: 0 }}
        animate={
          playing
            ? { r: [2.6, 7], opacity: [0.55, 0] }
            : { r: 2.6, opacity: 0 }
        }
        transition={{ duration: 1.8, repeat: playing ? Infinity : 0, ease: "easeOut", delay: 1.1 }}
      />
      {/* Marker riding the resolved root-to-leaf path. */}
      <circle
        r="1.8"
        fill="currentColor"
        opacity={playing ? undefined : 0}
        className={playing ? "motion-safe:animate-travel-path" : undefined}
        style={{ offsetPath: `path("${resolvedPath}")`, animationDuration: "2s", animationDelay: "1.2s" }}
      />
    </svg>
  );
}

// ---- Illustration 3: Decision Support & Climate Change ----
// Rebuilt: the branching path now genuinely branches three ways (low /
// mid / high scenario), with the mid path resolved and carrying a
// travelling marker while the other two stay dim — three real options
// being weighed, not one fork. Added a small rising bar group
// (staggered heights, standing in for variable climate data alongside
// the wave line rather than the wave carrying that idea alone).
function ClimateIllustration({ playing }: { playing: boolean }) {
  const root: [number, number] = [8, 45];
  const branches: { end: [number, number]; resolved?: boolean }[] = [
    { end: [72, 16] },
    { end: [72, 45], resolved: true },
    { end: [72, 74] },
  ];
  const resolvedPath = `M${root[0]} ${root[1]} L72 45`;
  const bars = [
    { x: 92, h: 18, delay: 0.5 },
    { x: 102, h: 30, delay: 0.58 },
    { x: 112, h: 12, delay: 0.66 },
    { x: 122, h: 24, delay: 0.74 },
    { x: 132, h: 20, delay: 0.82 },
  ];
  const baseline = 78;

  return (
    <svg viewBox="0 0 140 90" fill="none" className="h-full w-full">
      {branches.map((b, i) => (
        <motion.line
          key={i}
          x1={root[0]}
          y1={root[1]}
          x2={b.end[0]}
          y2={b.end[1]}
          stroke="currentColor"
          strokeWidth={b.resolved ? 1.6 : 1}
          strokeLinecap="round"
          opacity={b.resolved ? undefined : 0.3}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: playing ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.15 + i * 0.1, ease: EASE }}
        />
      ))}
      <motion.circle
        cx={root[0]}
        cy={root[1]}
        r="2.8"
        fill="currentColor"
        initial={{ scale: 0 }}
        animate={{ scale: playing ? 1 : 0 }}
        transition={{ duration: 0.25, delay: 0.1, ease: EASE }}
      />
      {/* Root pulse, looping while revealed — same technique and
          justification as DataScienceIllustration's root pulse above:
          "a decision is live here", animating `r` directly rather than
          a scale transform. */}
      <motion.circle
        cx={root[0]}
        cy={root[1]}
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
        initial={{ r: 2.8, opacity: 0 }}
        animate={
          playing ? { r: [2.8, 7.5], opacity: [0.5, 0] } : { r: 2.8, opacity: 0 }
        }
        transition={{ duration: 1.8, repeat: playing ? Infinity : 0, ease: "easeOut", delay: 0.6 }}
      />
      {branches.map((b, i) => (
        <motion.circle
          key={i}
          cx={b.end[0]}
          cy={b.end[1]}
          r={b.resolved ? 2.6 : 1.8}
          fill="currentColor"
          opacity={b.resolved ? 1 : 0.35}
          initial={{ scale: 0 }}
          animate={{ scale: playing ? 1 : 0 }}
          transition={{ duration: 0.25, delay: 0.45 + i * 0.08, ease: EASE }}
        />
      ))}
      {/* Marker riding the resolved (mid-scenario) branch. */}
      <circle
        r="2"
        fill="currentColor"
        opacity={playing ? undefined : 0}
        className={playing ? "motion-safe:animate-travel-path" : undefined}
        style={{ offsetPath: `path("${resolvedPath}")`, animationDuration: "1.8s", animationDelay: "0.9s" }}
      />

      {/* Variable climate data, rising bars — each then breathes gently
          in opacity once risen (own per-property transition, so only
          opacity repeats; height/y animate to their target once and
          hold, they'd look broken resetting to zero and re-rising on
          every loop). */}
      {bars.map((bar, i) => (
        <motion.rect
          key={i}
          x={bar.x}
          width="6"
          rx="1"
          fill="currentColor"
          initial={{ y: baseline, height: 0, opacity: 0.55 }}
          animate={
            playing
              ? { y: baseline - bar.h, height: bar.h, opacity: [0.4, 0.7, 0.4] }
              : { y: baseline, height: 0, opacity: 0.55 }
          }
          transition={{
            y: { duration: 0.45, delay: bar.delay, ease: EASE },
            height: { duration: 0.45, delay: bar.delay, ease: EASE },
            opacity: playing
              ? { duration: 1.6 + i * 0.15, delay: bar.delay + 0.45, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.3 },
          }}
        />
      ))}

      {/* Climate wave, slow ambient drift once revealed. */}
      <motion.path
        d="M4 84 Q 16 78, 28 84 T 52 84 T 76 84"
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
        {/* Full container width, not the cards' own natural width
            (site owner's request, 2026-09-19): a fixed-width flex row
            left dead space on the right at any container wider than
            three small cards, breaking the left/right edges every
            other row in this section already lines up to. Grid columns
            stretch to fill, matching that. Cards are fixed-height (see
            TeamFilterCard) so the default row-stretch has nothing to
            visibly do here. */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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

// Rebuilt a fifth time the same day, back to a flip (site owner's
// direct correction to the previous pass): the height-animated reveal
// changed the card's own box size on hover, which pushed the year
// filter row and slider below it up and down as the visitor moved the
// mouse across the three cards — "jadi pas hover ada flipnya, malah
// aneh" (having it push things around on hover was the actual "aneh"
// complaint, not the flip itself). A flip never changes the element's
// own box, so nothing below it ever moves; only the two faces inside a
// fixed-size box rotate. Back to the same 3D-flip technique used two
// passes ago (perspective, preserve-3d, backface-hidden faces, a
// rotateY + small scale-dip on Motion), just with the back face laid
// out as the two-column tagline/illustration split from the interim
// pass instead of that version's stacked layout, and a fixed height
// (h-40) generous enough for that row to actually fit — the tiny
// flip's old h-[88px] was sized for a stacked layout, not a side-by-
// side one.
//
// Cursor parallax and the spotlight border (kept, both unaffected by
// which layout the back face uses): the illustration tracks the
// pointer with a small damped offset via a ref mutation, and the
// spotlight ring tracks it around the card's outline — see
// globals.css's .card-spotlight comment for the mask-composite
// technique this second one uses.
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
  const glowRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  const flipped = active || hovered;
  const playing = flipped && !reducedMotion;

  function handlePointerMove(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    glowRef.current?.style.setProperty("--mx", `${px}px`);
    glowRef.current?.style.setProperty("--my", `${py}px`);

    if (parallaxRef.current && !reducedMotion) {
      const nx = px / rect.width - 0.5;
      const ny = py / rect.height - 0.5;
      parallaxRef.current.style.transform = `translate3d(${nx * 10}px, ${ny * 8}px, 0)`;
    }
  }

  function handleLeave() {
    setHovered(false);
    if (parallaxRef.current) parallaxRef.current.style.transform = "translate3d(0,0,0)";
  }

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      onMouseMove={handlePointerMove}
      onFocus={() => setHovered(true)}
      onBlur={handleLeave}
      style={{ perspective: 1800 }}
      className="relative h-28 w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-000"
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0, scale: reducedMotion ? 1 : [1, 0.97, 1] }}
        transition={{ duration: reducedMotion ? 0 : 0.45, ease: EASE }}
      >
        {/* Front */}
        <div
          style={{ backfaceVisibility: "hidden" }}
          className={cn(
            "absolute inset-0 flex flex-col justify-center gap-1 overflow-hidden rounded-xl border bg-ink-900 p-3 transition-colors duration-300",
            active ? "border-ink-000" : "border-white/8",
          )}
        >
          <p className="font-mono text-[10px] text-ink-300">
            {String(team.number).padStart(2, "0")}
          </p>
          <h3 className="font-display text-sm font-semibold leading-snug text-ink-000 sm:text-base">
            {team.name}
          </h3>
        </div>

        {/* Back */}
        <div
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          className={cn(
            "absolute inset-0 flex flex-col justify-center overflow-hidden rounded-xl border bg-ink-900 p-3 transition-colors duration-300",
            active ? "border-ink-000" : "border-white/8",
          )}
        >
          <div className="grid grid-cols-[1fr_auto] items-center gap-2">
            <p className="line-clamp-3 font-body text-[11px] leading-snug text-ink-300">
              {team.tagline}
            </p>
            <div
              ref={parallaxRef}
              aria-hidden="true"
              className="h-16 w-24 shrink-0 text-ink-100 transition-transform duration-200 ease-out"
            >
              <Illustration playing={playing} />
            </div>
          </div>
        </div>
      </motion.div>

      <div
        ref={glowRef}
        aria-hidden="true"
        className="card-spotlight pointer-events-none rounded-xl"
        style={{ opacity: hovered ? 1 : 0 }}
      />
    </button>
  );
}
