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
 * This is a teaser, not a replacement for the fuller Research Teams
 * section further down the page (components/sections/ResearchTeams.tsx,
 * which shows each team's real coordinator and publication count) — the
 * two serve different jobs: this one is glanceable and sits right at
 * the fold, the section below is the actual browsing/navigation surface
 * with real data. Names and taglines here are the same real content
 * from lib/content/teams.ts, not new copy.
 *
 * Illustrations are small, hand-drawn line-art SVGs in the site's own
 * dot/grid/line technical vocabulary (the same visual grammar as the
 * hero's ASCII map), not generic stock-style icons — each one is a
 * simple, literal diagram of what the team actually studies (a transit
 * network, a data/node graph, a branching decision scenario), which is
 * the case this project's own rule for hand-rolled decorative SVGs asks
 * for (PRD 6.6 / anti-slop: acceptable only when the brief explicitly
 * calls for illustration and it stays a single, simple geometric mark).
 */

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { teams } from "@/lib/content/teams";

const EASE = [0.22, 1, 0.36, 1] as const;

function TransportIllustration() {
  return (
    <svg viewBox="0 0 120 72" fill="none" className="h-full w-full">
      <path
        d="M8 52 L38 20 L68 52 L98 24"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />
      <circle cx="8" cy="52" r="3" fill="currentColor" />
      <circle cx="38" cy="20" r="3" fill="currentColor" />
      <circle cx="68" cy="52" r="3" fill="currentColor" />
      <circle cx="98" cy="24" r="3" fill="currentColor" />
      <circle cx="53" cy="36" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="83" cy="38" r="2" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

function DataScienceIllustration() {
  const nodes = [
    [14, 14],
    [58, 8],
    [100, 20],
    [30, 44],
    [76, 48],
    [16, 62],
    [92, 60],
  ];
  const edges: [number, number][] = [
    [0, 3],
    [1, 3],
    [1, 4],
    [2, 4],
    [3, 5],
    [4, 6],
    [1, 2],
  ];
  return (
    <svg viewBox="0 0 120 72" fill="none" className="h-full w-full">
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a][0]}
          y1={nodes[a][1]}
          x2={nodes[b][0]}
          y2={nodes[b][1]}
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.4"
        />
      ))}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 1 ? 3.2 : 2.4} fill="currentColor" />
      ))}
    </svg>
  );
}

function ClimateIllustration() {
  return (
    <svg viewBox="0 0 120 72" fill="none" className="h-full w-full">
      <path d="M10 60 L46 60" stroke="currentColor" strokeWidth="1.4" opacity="0.55" />
      <path d="M46 60 L80 30" stroke="currentColor" strokeWidth="1.4" opacity="0.55" />
      <path d="M46 60 L86 54" stroke="currentColor" strokeWidth="1.4" opacity="0.35" />
      <path d="M46 60 L88 68" stroke="currentColor" strokeWidth="1.4" opacity="0.35" />
      <circle cx="10" cy="60" r="2.6" fill="currentColor" />
      <circle cx="46" cy="60" r="3" fill="currentColor" />
      <circle cx="80" cy="30" r="2.6" fill="currentColor" />
      <circle cx="86" cy="54" r="2" fill="currentColor" opacity="0.7" />
      <circle cx="88" cy="68" r="2" fill="currentColor" opacity="0.7" />
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
  Illustration: () => ReactNode;
}): ReactNode {
  const [hovered, setHovered] = useState(false);
  // A hover-gated reveal is unreachable on a touch device — there is no
  // hover, so the illustration and tagline would just never appear,
  // leaving the card's flex-justify-between layout with a permanently
  // empty middle (caught on a real mobile viewport: the card rendered as
  // a near-blank rounded box with the number and title pushed to its
  // bottom edge). On a device without a fine hover pointer, this treats
  // the card as always "revealed" instead of chasing an interaction that
  // can't happen there.
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

  return (
    <Link
      href={`/research/${team.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="focus-ring group relative flex h-56 flex-col justify-between overflow-hidden rounded-3xl border border-white/8 bg-ink-900 p-6 transition-colors duration-300 hover:border-white/16 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
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
        <Illustration />
      </motion.div>

      <div />

      <div className="relative z-10 flex flex-col gap-2">
        <p className="font-mono text-xs text-ink-300">
          {String(team.number).padStart(2, "0")}
        </p>
        <h3 className="font-display text-lg font-semibold leading-snug text-ink-000">
          {team.displayName}
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
