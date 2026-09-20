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

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { teams } from "@/lib/content/teams";
import { publications } from "@/lib/content/publications";
import type { TeamSlug } from "@/lib/content/types";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { YearFilterMenu } from "@/components/ui/YearFilterMenu";
import { cn } from "@/lib/cn";

const EASE = [0.22, 1, 0.36, 1] as const;

// ---- Illustration 1: Sustainable Urban Transportation ----
// Rebuilt a third time (site owner: the stroke-only version was "cuma
// titik dan garis" — just dots and lines, not substantial). Roads are
// now filled asphalt bands (a wide low-opacity fill strip) with a
// dashed centre line on top, not a bare stroke; buildings are solid
// filled blocks with a window-dot grid on the two largest, not empty
// outlines; vehicles are bigger and fully opaque with a lighter
// "windshield" stripe. Still plain <rect>/<circle>/<g> elements for
// anything on an offset-path, not motion.* — Motion doesn't animate
// offsetDistance (see globals.css's --animate-travel-path comment).
function TransportIllustration({ playing }: { playing: boolean }) {
  const roads: { d: string; band: string }[] = [
    { d: "M8 28 L132 28", band: "M8 26h124v4h-124z" },
    { d: "M8 68 L132 68", band: "M8 66h124v4h-124z" },
    { d: "M35 8 L35 82", band: "M33 8h4v74h-4z" },
    { d: "M104 8 L104 82", band: "M102 8h4v74h-4z" },
  ];
  const intersections: [number, number][] = [
    [35, 28],
    [104, 28],
    [35, 68],
    [104, 68],
  ];
  const buildings: [number, number, number, number][] = [
    [14, 12, 14, 11],
    [50, 12, 11, 9],
    [112, 12, 14, 11],
    [14, 73, 14, 9],
    [112, 73, 14, 9],
  ];
  // Fixed (site owner caught it): this used to run along x=8 and x=132,
  // the canvas edges where the horizontal roads happen to end — but
  // there's no vertical road drawn there, only at x=35 and x=104. The
  // loop now traces exactly the rectangle between the four intersection
  // points above, which are real road segments the whole way round.
  const loopRoute = "M35 28 L104 28 L104 68 L35 68 Z";
  const spurRoute = "M35 8 L35 82";

  return (
    <svg viewBox="0 0 140 90" fill="none" className="h-full w-full">
      {/* Asphalt bands, filled, under everything else — this is what
          gives the roads actual mass instead of reading as bare lines. */}
      {roads.map((r, i) => (
        <motion.path
          key={i}
          d={r.band}
          fill="currentColor"
          initial={{ opacity: 0 }}
          animate={{ opacity: playing ? 0.1 : 0 }}
          transition={{ duration: 0.4, delay: 0.1 + i * 0.08, ease: EASE }}
        />
      ))}

      {buildings.map(([x, y, w, h], i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: playing ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 0.04 * i, ease: EASE }}
        >
          <rect x={x} y={y} width={w} height={h} rx={1.2} fill="currentColor" opacity={0.22} />
          <rect
            x={x}
            y={y}
            width={w}
            height={h}
            rx={1.2}
            stroke="currentColor"
            strokeWidth="0.6"
            opacity={0.5}
          />
          {w > 12 &&
            [0, 1].flatMap((row) =>
              [0, 1].map((col) => (
                <rect
                  key={`${row}-${col}`}
                  x={x + 3 + col * (w - 8)}
                  y={y + 3 + row * (h - 7)}
                  width="2"
                  height="2.2"
                  fill="currentColor"
                  opacity={0.5}
                />
              )),
            )}
        </motion.g>
      ))}

      {/* Dashed centre lines, drawn over the asphalt bands. */}
      {roads.map((r, i) => (
        <motion.path
          key={i}
          d={r.d}
          stroke="currentColor"
          strokeWidth="0.8"
          strokeDasharray="3 2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={playing ? { pathLength: 1, opacity: 0.6 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease: EASE }}
        />
      ))}

      {intersections.map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r={2.8}
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
        width="4.2"
        height="2.6"
        x="-2.1"
        y="-1.3"
        rx="0.9"
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
      <g
        opacity={playing ? undefined : 0}
        className={playing ? "motion-safe:animate-travel-path" : undefined}
        style={{
          offsetPath: `path("${loopRoute}")`,
          offsetRotate: "auto",
          animationDuration: "3.8s",
          animationDelay: "0.9s",
        }}
      >
        <rect width="5.4" height="3" x="-2.7" y="-1.5" rx="1" fill="currentColor" />
        <rect width="2.4" height="1.4" x="-1.2" y="-0.7" rx="0.4" fill="var(--color-ink-900)" />
      </g>

      {/* Vehicle 2: the vertical spur, a shorter, quicker route, plus its
          own trail. */}
      <rect
        width="3.4"
        height="2"
        x="-1.7"
        y="-1"
        rx="0.7"
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
      <g
        opacity={playing ? 0.85 : 0}
        className={playing ? "motion-safe:animate-travel-path" : undefined}
        style={{
          offsetPath: `path("${spurRoute}")`,
          offsetRotate: "auto",
          animationDuration: "2.3s",
          animationDelay: "1.15s",
        }}
      >
        <rect width="4.4" height="2.6" x="-2.2" y="-1.3" rx="0.9" fill="currentColor" />
        <rect width="1.9" height="1.2" x="-0.95" y="-0.6" rx="0.35" fill="var(--color-ink-900)" />
      </g>
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
          {/* Filled panel first, so the layer reads as a solid translucent
              plate stacked on the others, not an empty wireframe box —
              the pattern on top is the layer's data, the fill is its
              mass. */}
          <rect x={layer.x} y={layer.y} width="40" height="30" rx="2" fill="currentColor" opacity={0.45} />
          <rect x={layer.x} y={layer.y} width="40" height="30" rx="2" stroke="currentColor" strokeWidth="1.2" />
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
      {/* The resolved leaf (a1) renders as a filled square badge, not
          another circle — a distinct shape reading as "the answer",
          not just one more dot in the same family. */}
      {[tree.root, tree.a, tree.b, tree.a1, tree.a2].map(([x, y], i) =>
        i === 3 ? (
          <motion.rect
            key={i}
            x={x - 3}
            y={y - 3}
            width={6}
            height={6}
            rx={1.4}
            fill="currentColor"
            initial={{ scale: 0 }}
            animate={{ scale: playing ? 1 : 0 }}
            style={{ transformOrigin: `${x}px ${y}px` }}
            transition={{ duration: 0.3, delay: 0.45 + i * 0.08, ease: EASE }}
          />
        ) : (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r={i === 0 ? 2.6 : 2}
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
      {/* A small filled sun disc anchors "climate" as a literal, legible
          mark rather than leaving the whole scene abstract (branches,
          bars, a wave) — sits in the otherwise-empty top-left corner, so
          it doesn't compete with the branch/bar reveal below it. */}
      <motion.g
        initial={{ opacity: 0, scale: 0.6 }}
        animate={playing ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
        style={{ transformOrigin: "16px 14px" }}
        transition={{ duration: 0.35, delay: 0.05, ease: EASE }}
      >
        <circle cx="16" cy="14" r="4.2" fill="currentColor" />
        {/* Six rays at 60-degree intervals, pre-computed rather than
            calling Math.sin/cos at render time — a trig result can land
            on a different float bit between the server and client
            (Node's V8 vs. the browser's), which is a real hydration
            mismatch caught in dev, not a hypothetical one. */}
        {[
          [22.5, 14, 25, 14],
          [19.25, 19.63, 20.5, 21.79],
          [12.75, 19.63, 11.5, 21.79],
          [9.5, 14, 7, 14],
          [12.75, 8.37, 11.5, 6.21],
          [19.25, 8.37, 20.5, 6.21],
        ].map(([x1, y1, x2, y2], i) => {
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.6"
            />
          );
        })}
      </motion.g>

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

      {/* Climate wave: a filled area under the line, not a bare stroke,
          so it reads as a small area chart rather than a squiggle — the
          line on top still carries the drawn-in reveal and the drift
          loop; the fill just rides along with it (same x drift, no
          separate pathLength draw-in, since a filled shape doesn't
          "draw in" the way a stroke does). */}
      <motion.path
        d="M4 84 Q 16 78, 28 84 T 52 84 T 76 84 L76 90 L4 90 Z"
        fill="currentColor"
        initial={{ opacity: 0, x: 0 }}
        animate={
          playing ? { opacity: 0.12, x: [0, -24, 0] } : { opacity: 0, x: 0 }
        }
        transition={{
          opacity: { duration: 0.4, delay: 0.5 },
          x: { duration: 6, delay: 1, repeat: Infinity, ease: "linear" },
        }}
      />
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
  const reducedMotion = useReducedMotion();
  // Added 2026-09-20 (site owner: "di bagian research card, hapus yang
  // duplikat, karena ada 2 yang duplikat itu") — the loop below used to
  // render `filtered` twice unconditionally whenever motion wasn't
  // reduced, regardless of whether there was enough content to actually
  // need a wrap-around copy. A team/year filter that narrows the list
  // down to a couple of publications doesn't overflow the frame, so the
  // auto-drift effect's own hasOverflow check already correctly never
  // moved it — but the doubled DOM was still there, sitting still,
  // reading exactly like two identical cards side by side. `canLoop`
  // gates the doubling itself on an actual overflow measurement (below),
  // not just on whether motion is allowed.
  const [canLoop, setCanLoop] = useState(false);

  // Auto-scroll marquee (2026-09-19, site owner's request): the gallery
  // now drifts continuously right-to-left on its own, and pauses the
  // instant a pointer or keyboard focus reaches it — but never stops
  // being a real scroll container, so wheel/trackpad/touch scrolling
  // and the prev/next buttons keep working exactly as before whether
  // it's paused or not. `loop` gates the whole thing off under
  // prefers-reduced-motion, matching every other looping animation in
  // this project (HeroCanvas's idle scan, the team cards' travel-path
  // markers): under reduced motion this is a perfectly ordinary
  // scrollable row that never moves on its own, full stop.
  const loop = !reducedMotion;
  const interactingRef = useRef(false);
  const pauseUntilRef = useRef(0);

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
    const hasOverflow = el.scrollWidth > el.clientWidth + 4;
    if (loop) {
      // Looping means there's no real "start" or "end" to disable
      // against — both directions always have more to scroll to, as
      // long as there's anything to scroll at all.
      setCanScrollPrev(hasOverflow);
      setCanScrollNext(hasOverflow);
    } else {
      setCanScrollPrev(el.scrollLeft > 4);
      setCanScrollNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
    }
  }

  // Coverflow depth (site owner's reference: collectui.com's cover-flow
  // sliders — a centred item reading larger and brighter, everything
  // else receding toward the frame's edges, "ga kaku" than a flat row).
  // Pure function of scroll position, so it's driven by BOTH the
  // auto-drift's rAF tick and the scroller's native `scroll` event —
  // whichever is moving the row at a given moment, the cards stay in
  // sync with it. Direct DOM writes, not React state (Motion's own
  // guidance: a per-frame value like this belongs in a ref/DOM
  // mutation, not a re-render — twenty-plus cards re-rendering on every
  // scroll tick would be the actual performance bug). Reads are
  // batched before writes (one getBoundingClientRect pass, then one
  // style pass) so this can't trigger the layout-thrashing a naive
  // read/write/read/write loop would.
  //
  // Gated off entirely under reduced motion: scroll-linked scaling is
  // still a vestibular trigger for some users even though the user's
  // own scroll drives it, not an autonomous loop — this project gates
  // all non-essential motion the same way regardless of that
  // distinction (HeroCanvas's idle scan, the marquee drift above), so
  // reduced motion here means a flat, static row, full stop.
  function updateCoverflow() {
    const el = scrollerRef.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>("[data-coverflow-card]");
    if (reducedMotion) {
      cards.forEach((card) => {
        card.style.transform = "";
        card.style.opacity = "";
      });
      return;
    }

    const containerRect = el.getBoundingClientRect();
    const centerX = containerRect.left + containerRect.width / 2;
    const halfWidth = containerRect.width / 2 || 1;

    const reads: { card: HTMLElement; distance: number }[] = [];
    cards.forEach((card) => {
      const r = card.getBoundingClientRect();
      reads.push({ card, distance: Math.abs(r.left + r.width / 2 - centerX) });
    });

    for (const { card, distance } of reads) {
      const t = Math.min(distance / halfWidth, 1); // 0 at centre, 1 at the frame's edge
      const scale = 1.08 - t * 0.22;
      const opacity = 1 - t * 0.55;
      card.style.transform = `scale(${scale.toFixed(3)})`;
      card.style.opacity = opacity.toFixed(3);
    }
  }

  // Two-step, both useLayoutEffect (not useEffect) so neither is ever
  // visible as a flash of wrongly-doubled content before the browser
  // paints: reset canLoop to false the instant the filter changes (so
  // the very next render is a single, undoubled copy), then measure
  // that single copy's real overflow and only then decide whether a
  // second copy is actually needed. See canLoop's own declaration
  // above for the bug this fixes.
  useLayoutEffect(() => {
    setCanLoop(false);
  }, [activeTeam, activeYear]);

  useLayoutEffect(() => {
    if (canLoop) return;
    const el = scrollerRef.current;
    if (!el) return;
    if (el.scrollWidth > el.clientWidth + 4) setCanLoop(true);
  }, [filtered, canLoop]);

  useEffect(() => {
    // Filter changes can shrink the slider's scrollWidth out from under an
    // old scroll position (e.g. it was scrolled right, then a filter drops
    // it back to a handful of cards) — re-measure rather than trust stale
    // button state.
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: 0 });
    updateScrollButtons();
    // Cards for the new filter haven't painted at their final layout
    // position the instant this effect runs — one rAF later, they have.
    requestAnimationFrame(updateCoverflow);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTeam, activeYear, canLoop]);

  // Re-run on resize too (a wider/narrower frame moves the centre point
  // and every card's distance from it, independent of any scrolling).
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => updateCoverflow());
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  // The continuous drift itself. Runs its own rAF loop rather than a CSS
  // animation because the content is a real, natively-scrollable list
  // (wheel/touch/keyboard all need to keep working on it), and because
  // the loop point (see below) depends on a measured DOM width that
  // changes with the active filter.
  //
  // Looping technique: filtered is rendered TWICE back-to-back (see the
  // JSX below) whenever `loop` is on, so the track is exactly two
  // identical copies of the same content. Once scrollLeft passes the
  // first copy's width (scrollWidth / 2, since both copies are pixel-
  // identical), subtracting that same width lands on the visually
  // identical point in the second copy — a seamless wrap with no jump,
  // rather than snapping back to 0 (which would visibly skip past
  // whatever's scrolled out of view). This only touches scrollLeft
  // during the auto-increment itself, never fighting a manual scroll,
  // touch drag, or the prev/next buttons' own smooth-scroll animation —
  // see the pause handling below for how those stay uninterrupted.
  useEffect(() => {
    if (!loop) return;
    const el = scrollerRef.current;
    if (!el) return;

    const SPEED_PX_PER_SEC = 26;
    let raf = 0;
    let last = performance.now();
    // The authoritative position lives here, not in el.scrollLeft's own
    // getter: at 26px/s, a 60Hz frame only advances ~0.4px, and most
    // browsers round scrollLeft writes to the nearest integer pixel —
    // reading that rounded value back as the basis for the NEXT frame's
    // addition (the first version of this effect did exactly that)
    // throws away the sub-pixel remainder every single frame, so the
    // rounded value never crosses the next whole pixel and the row
    // never visibly moves at all. Accumulating in a plain JS float
    // instead, and only ever writing (never reading back) el.scrollLeft
    // from it, keeps that remainder alive across frames the way a
    // canvas or WebGL animation loop would.
    let pos = el.scrollLeft;

    function tick(now: number) {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(now - last, 100); // clamp a backgrounded-tab gap
      last = now;

      const hasOverflow = el!.scrollWidth > el!.clientWidth + 4;
      if (!hasOverflow) return;

      const paused = interactingRef.current || now < pauseUntilRef.current;
      if (paused) {
        // Resync to wherever manual scrolling / a button's own
        // smooth-scroll left the row, so resuming continues from
        // there instead of jumping back to the last auto-scrolled
        // position.
        pos = el!.scrollLeft;
        return;
      }

      pos += (SPEED_PX_PER_SEC * dt) / 1000;
      const half = el!.scrollWidth / 2;
      if (pos >= half) pos -= half;
      el!.scrollLeft = pos;
      updateCoverflow();
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [loop, filtered.length]);

  function scrollByPage(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    // A brief cooldown so the auto-drift doesn't fight this smooth
    // scroll while it's animating — the arrow buttons sit outside the
    // hover-tracked row itself, so without this the rAF loop above
    // would keep nudging scrollLeft on top of the button's own
    // animation for as long as the pointer stayed over the button.
    pauseUntilRef.current = performance.now() + 700;
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
    <section id="research" aria-label="Publications" className="scroll-mt-24 pb-8 pt-2 md:pb-10 md:pt-4">
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

        {/* Year filter: a single compact dropdown widget, not a row of
            year chips (site owner's request, 2026-09-19 — the old row
            was up to a dozen buttons wide and wrapped onto its own
            lines). Stays up here next to the prev/next controls rather
            than moving to a page rail: it's a control FOR the gallery
            directly below it, and a full-width horizontal marquee has
            no natural left/right edge to dock a sidebar against
            (especially on mobile, where a rail would either vanish or
            eat a third of the screen). See YearFilterMenu below. */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <YearFilterMenu years={years} activeYear={activeYear} onChange={setActiveYear} />

          {filtered.length > 0 && (
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Scroll publications left"
                disabled={!canScrollPrev}
                onClick={() => scrollByPage(-1)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-500 text-ink-100 transition-colors hover:border-ink-000 hover:text-ink-000 disabled:opacity-30 disabled:hover:border-ink-500 disabled:hover:text-ink-100"
              >
                <CaretLeft size={13} weight="bold" />
              </button>
              <button
                type="button"
                aria-label="Scroll publications right"
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
          // The "frame" (site owner's reference: the collectui.com
          // cover-flow examples, praised specifically for not looking
          // "kaku" against a flat row) — a rounded, bordered panel the
          // slider sits inside, echoing the same double-bezel treatment
          // the hero's map card already uses (Hero.tsx), rather than
          // the gallery floating directly on the page background. The
          // edge fade (mask-image on the scroller, not this frame) is
          // what actually sells "not kaku": cards dissolve into the
          // frame's own background as they near either edge instead of
          // being guillotined by a hard clip.
          <div className="mt-8 rounded-4xl border border-white/8 bg-ink-900 p-4 md:p-6">
            {/* No scroll-snap any more (had been snap-x snap-mandatory):
                mandatory snap actively fights a continuously-incrementing
                scrollLeft, which is what the auto-drift above needs to do
                every frame — every browser tested pulled the track back
                toward the nearest snap point mid-drift, reading as
                stutter, not smooth motion. Pause handlers below cover the
                "kalau kursor diarahkan kesana animasinya berhenti, tapi
                bisa discroll tetep" ask: hover/focus/touch pause the
                auto-increment (interactingRef), while native wheel/touch/
                keyboard scrolling is untouched either way, since this stays
                an ordinary overflow-x-auto container throughout. */}
            <div
              ref={scrollerRef}
              onScroll={() => {
                updateScrollButtons();
                updateCoverflow();
              }}
              onMouseEnter={() => {
                interactingRef.current = true;
              }}
              onMouseLeave={() => {
                interactingRef.current = false;
              }}
              onFocus={() => {
                interactingRef.current = true;
              }}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  interactingRef.current = false;
                }
              }}
              onPointerDown={() => {
                interactingRef.current = true;
              }}
              onPointerUp={() => {
                interactingRef.current = false;
                pauseUntilRef.current = performance.now() + 600;
              }}
              onPointerCancel={() => {
                interactingRef.current = false;
                pauseUntilRef.current = performance.now() + 600;
              }}
              style={{
                maskImage:
                  "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
              }}
              className="flex items-center gap-5 overflow-x-auto py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {/* Rendered twice only once canLoop confirms the single
                  copy actually overflows the frame (see canLoop's own
                  comment above) — the second copy is purely a visual
                  continuation for the wrap-around, not real additional
                  content, so it's hidden from assistive tech and pulled
                  out of tab order (PublicationCard's hiddenDuplicate
                  prop) rather than doubling every publication's link in
                  the page's a11y tree. */}
              {(loop && canLoop ? [0, 1] : [0]).flatMap((copy) =>
                filtered.map((pub) => (
                  <PublicationCard
                    key={`${pub.slug}-${copy}`}
                    publication={pub}
                    hiddenDuplicate={copy === 1}
                  />
                )),
              )}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}

// Rebuilt as a compact, image-forward card (2026-09-19, site owner's
// direct request, replacing the "title above / image / meta below"
// stack): the title now sits IN FRONT of the image as an overlaid
// caption instead of its own block above the card, on a gradient +
// backdrop-blur scrim so it stays legible over whatever the cover
// photo is doing underneath (the scrim is the "boundary agak blur" the
// site owner asked for — a real, functional legibility aid over
// variable imagery, not decoration; see antislop-ui's dose-cap note on
// glass — this is the one deliberate use on the page, sized to a thin
// caption strip, not a full panel). One-line title (line-clamp-1, not
// the old 2-line clamp) — the site owner's other complaint was that
// full titles ran long across two lines and crowded the card; anything
// past one line now ends in the browser's own ellipsis instead.
//
// Height is ~80% of the old image box (aspect-[4/3] -> aspect-[3/2] at
// a narrower width — see the width note below), which is also most of
// the card's total height reduction: there's no separate title block
// above it any more, and the meta line below is a single small row.
//
// Width is fixed, not responsive-fluid. It no longer hits the "six
// cards exactly fill a 1280px laptop viewport" width this had before
// (site owner, 2026-09-20: "cardnya bisa agak dilebarin sedikit ga?
// biar bentuknya persegi, biar tidak terlalu persegi panjang" — widened
// so the card reads as roughly square instead of a narrow column, same
// request that changed the image below from aspect-[3/2] to
// aspect-square). Below `lg` the row still scrolls (see
// PublicationsShowcase's marquee) regardless of exactly how many cards
// fit at once, which was always true here, six-exactly was never load-
// bearing.
function PublicationCard({
  publication,
  hiddenDuplicate = false,
}: {
  publication: (typeof publications)[number];
  hiddenDuplicate?: boolean;
}) {
  return (
    <Link
      href={`/publications/${publication.slug}`}
      aria-hidden={hiddenDuplicate || undefined}
      tabIndex={hiddenDuplicate ? -1 : undefined}
      // The coverflow scale/opacity in PublicationsShowcase writes
      // directly to this element's style every scroll tick (see
      // updateCoverflow) — a ref array would work too, but a data
      // attribute lets that function find "every card currently in the
      // DOM" with one querySelectorAll, including the duplicated loop
      // copy, without PublicationCard having to forward a ref prop
      // through two render paths for the same component.
      data-coverflow-card=""
      className="group flex w-36 flex-shrink-0 flex-col gap-2 [will-change:transform,opacity] sm:w-40 lg:w-[190px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-000"
    >
      {/* Double-bezel frame (rounded-4xl outer, concentric
          rounded-[1.6rem] inner), the same recipe as Hero's map card,
          this section's own gallery frame, and Project.tsx's cards —
          site owner, 2026-09-20: "cornernya coba disesuaikan dengan
          grand design website", replacing this card's old standalone
          rounded-panel (4px) corner that didn't relate to any of those.
          Honest empty slot when no coverImage is set — see this file's
          top comment and lib/content/types.ts. Never a stock photo
          standing in for a real one (the three dummy exceptions are
          flagged at their source in lib/content/publications.ts). */}
      <div className="rounded-4xl border border-white/8 bg-ink-900 p-1.5 transition-colors group-hover:border-white/20">
        <div className="relative aspect-square overflow-hidden rounded-[1.4rem] bg-ink-800">
          {publication.coverImage && (
            <Image
              src={publication.coverImage}
              alt=""
              fill
              sizes="190px"
              className="object-cover"
            />
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-900 via-ink-900/75 to-transparent px-2 pb-1.5 pt-5 backdrop-blur-[1.5px]">
            <h3 className="line-clamp-1 font-display text-[11px] font-semibold leading-snug text-ink-000">
              {publication.title}
            </h3>
          </div>
        </div>
      </div>

      <div className="flex items-baseline gap-1.5">
        <p className="shrink-0 font-mono text-[10px] text-ink-300">{publication.year}</p>
        <p className="line-clamp-1 font-body text-[10px] text-ink-300">{publication.authors}</p>
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

  const revealed = active || hovered;
  const playing = revealed && !reducedMotion;

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
      className={cn(
        // rounded-4xl, not the smaller rounded-xl this had — matches
        // the gallery frame directly below it (site owner's font/
        // shape-consistency pass, 2026-09-20: "kelengkungan yang
        // linear dengan kelengkungan boundary/kotak yang lain") rather
        // than sitting on its own smaller radius one section apart
        // from a bigger one.
        "relative h-28 w-full overflow-hidden rounded-4xl border bg-ink-900 text-left transition-[border-color] duration-300 hover:bg-white/4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-000",
        active ? "border-ink-000" : "border-white/8",
      )}
    >
      {/* Crossfade, not a flip (site owner's call, after weighing it
          against the flip): the card was already fixed-height so
          nothing below it moves either way, and a plain opacity
          crossfade gets there with far less to go wrong than a 3D
          rotation — no perspective, no backface-visibility, no
          competing transitions on the same face mid-turn, all of which
          had already needed a fix once each. It's also the more honest
          match for "hovernya seperti Explore Research": that control
          has no rotation at all, just a plain, fast state change. */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-center gap-1 p-3"
        initial={false}
        animate={{ opacity: revealed ? 0 : 1 }}
        transition={{ duration: reducedMotion ? 0 : 0.25, ease: EASE }}
      >
        <p className="font-mono text-[10px] text-ink-300">
          {String(team.number).padStart(2, "0")}
        </p>
        <h3 className="font-display text-sm font-semibold leading-snug text-ink-000 sm:text-base">
          {team.name}
        </h3>
      </motion.div>

      <motion.div
        className="absolute inset-0 flex flex-col justify-center p-3"
        initial={false}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.25, ease: EASE }}
      >
        <div className="grid grid-cols-[1fr_auto] items-center gap-2">
          {/* text-[11px] -> text-xs (site owner, 2026-09-20: the
              flipped-card tagline "terlalu kecil... pastikan
              ukurannya konsisten dengan font kecil yang lain") —
              matches the small-text tier the footer/Team passes the
              same day settled on (address, contact, department line,
              Team's own role text are all text-xs now), instead of
              this being the one small label left on its own size. */}
          <p className="line-clamp-3 font-body text-xs leading-snug text-ink-300">
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
      </motion.div>

      <div
        ref={glowRef}
        aria-hidden="true"
        className="card-spotlight pointer-events-none rounded-4xl"
        style={{ opacity: hovered ? 1 : 0 }}
      />
    </button>
  );
}
