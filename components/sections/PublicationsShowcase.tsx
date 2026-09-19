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
 *    again (or "All teams") clears the filter. Visiting a team's own page
 *    is still possible from the fuller Research Teams section further
 *    down (components/sections/ResearchTeams.tsx, "Explore Team ->"),
 *    which is unaffected by this change.
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
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
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
    <section id="publications" className="pb-16 pt-2 md:pb-20 md:pt-4">
      <Container>
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="font-display text-2xl font-semibold text-ink-000 md:text-3xl">
            Publications
          </h2>
          <button
            type="button"
            onClick={() => setActiveTeam("all")}
            disabled={activeTeam === "all"}
            className="font-mono text-xs uppercase tracking-[0.08em] text-ink-300 underline decoration-white/25 underline-offset-4 transition-colors hover:text-ink-000 disabled:pointer-events-none disabled:text-ink-500 disabled:no-underline"
          >
            All teams
          </button>
        </div>
        <p className="mt-3 max-w-[52ch] font-body text-sm text-ink-300">
          Select a research team to filter, or browse everything below.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
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

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
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

function PublicationCard({ publication }: { publication: (typeof publications)[number] }) {
  const team = teams.find((t) => t.slug === publication.team);
  return (
    <Link
      href={`/publications/${publication.slug}`}
      className="group flex w-72 flex-shrink-0 snap-start flex-col gap-4 sm:w-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-000"
    >
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
      <div className="flex flex-col gap-1.5">
        <p className="font-mono text-xs text-ink-300">
          {publication.year} · {team?.displayName}
        </p>
        <h3 className="font-display text-base font-semibold leading-snug text-ink-000">
          {publication.title}
        </h3>
        <p className="font-body text-sm text-ink-300">{publication.authors}</p>
      </div>
    </Link>
  );
}

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
  // A hover-gated reveal is unreachable on a touch device — there is no
  // hover, so the illustration and tagline would just never appear,
  // leaving the card's layout with a permanently empty middle. On a
  // device without a fine hover pointer, this treats the card as always
  // "revealed" instead of chasing an interaction that can't happen there.
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setCanHover(mq.matches);
    const onChange = () => setCanHover(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Selecting a card as the active filter keeps it revealed even after
  // the pointer leaves — that persistence is the selection feedback,
  // distinct from the border highlight below.
  const revealed = active || hovered || !canHover;
  const playing = revealed && !reducedMotion;

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className={cn(
        "group relative flex h-56 flex-col justify-between overflow-hidden rounded-3xl border bg-ink-900 p-6 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-000",
        active ? "border-ink-000" : "border-white/8 hover:border-white/16",
      )}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-6 h-24 text-ink-100"
        initial={false}
        animate={{ opacity: revealed ? 0.9 : 0, y: revealed ? 0 : 8 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <Illustration playing={playing} />
      </motion.div>

      <div />

      <div className="relative z-10 flex flex-col gap-2">
        <p className="font-mono text-xs text-ink-300">
          {String(team.number).padStart(2, "0")}
        </p>
        <h3 className="font-display text-lg font-semibold leading-snug text-ink-000">
          {team.name}
        </h3>

        <AnimatePresence initial={false}>
          {revealed && (
            <motion.p
              key="tagline"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="overflow-hidden font-body text-sm leading-relaxed text-ink-300"
            >
              {team.tagline}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </button>
  );
}
