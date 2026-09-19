"use client";

/*
 * Three-card teaser directly under the hero, per the site owner's
 * request (2026-09-19) for a "curve style" card row that reveals a
 * supporting illustration and description on hover rather than showing
 * everything at rest — CollectUI's hover-state reference
 * (collectui.com/designs/hover-state-ui-design-inspiration) was pointed
 * to as the interaction quality bar, not a literal layout to copy (that
 * example is an app-mockup grid; there's nothing in it that maps
 * one-to-one onto three research teams).
 *
 * Headings updated to each team's full name (lib/content/teams.ts
 * `name`, not the short `displayName` used on the fuller Research Teams
 * section below) per direct request. Illustrations are animated, not
 * static, one per team's actual subject: a road network with travelling
 * nodes, a layered vector map with a branching decision-tree motif, and
 * a branching decision path paired with a climate wave. These are
 * hand-drawn SVGs in the site's own dot/line technical vocabulary (the
 * same grammar as the hero's ASCII map), not generic stock icons — the
 * case this project's own rule for hand-rolled decorative SVGs asks for
 * (PRD 6.6 / anti-slop: acceptable only when the brief explicitly calls
 * for illustration and it stays a simple geometric mark).
 *
 * This is a teaser, not a replacement for the fuller Research Teams
 * section further down the page (components/sections/ResearchTeams.tsx,
 * which shows each team's real coordinator and publication count) — the
 * two serve different jobs: this one is glanceable and sits right at
 * the fold, the section below is the actual browsing/navigation surface
 * with real data.
 */

import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { teams } from "@/lib/content/teams";

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

export function TeamsTeaser(): ReactNode {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {teams.map((team, index) => (
        <TeaserCard key={team.slug} team={team} Illustration={ILLUSTRATIONS[index]} />
      ))}
    </div>
  );
}

function TeaserCard({
  team,
  Illustration,
}: {
  team: (typeof teams)[number];
  Illustration: (props: { playing: boolean }) => ReactNode;
}): ReactNode {
  const [hovered, setHovered] = useState(false);
  const reducedMotion = useReducedMotion();
  // A hover-gated reveal is unreachable on a touch device — there is no
  // hover, so the illustration and tagline would just never appear,
  // leaving the card's flex-justify-between layout with a permanently
  // empty middle (caught on a real mobile viewport: the card rendered as
  // a near-blank rounded box with the number and title pushed to its
  // bottom edge). On a device without a fine hover pointer, this treats
  // the card as always "revealed" instead of chasing an interaction that
  // can't happen there.
  //
  // Defaults to false (content revealed) rather than true: the failure
  // mode of guessing wrong matters more one way than the other — a
  // desktop visitor might see a brief extra flash of the reveal before
  // the real matchMedia check settles a frame later, but a touch visitor
  // defaulting the other way would see the broken empty-card state this
  // fix exists for, even if only for that first frame.
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setCanHover(mq.matches);
    const onChange = () => setCanHover(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const revealed = hovered || !canHover;
  // The looped travelling-pulse animations inside the illustrations are
  // skipped outright under reduced motion (PRD 6.6) — everything else in
  // them (lines/nodes appearing) is a one-shot reveal, not a loop, so it
  // stays but without the infinite parts.
  const playing = revealed && !reducedMotion;

  return (
    <Link
      href={`/research/${team.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="group relative flex h-56 flex-col justify-between overflow-hidden rounded-3xl border border-white/8 bg-ink-900 p-6 transition-colors duration-300 hover:border-white/16 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-000"
    >
      {/* Illustration: hidden until hover on devices that can hover, not
          just faded — it isn't decoration sitting under the text at
          rest, it's the reveal. Always shown on touch (see `revealed`
          above). */}
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
    </Link>
  );
}
