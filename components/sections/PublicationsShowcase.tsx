"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { assetPath } from "@/lib/asset-path";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { teams } from "@/lib/content/teams";
import { publications } from "@/lib/content/publications";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { YearFilterMenu } from "@/components/ui/YearFilterMenu";
import { cn } from "@/lib/cn";

const EASE = [0.22, 1, 0.36, 1] as const;

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
  const loopRoute = "M35 28 L104 28 L104 68 L35 68 Z";
  const spurRoute = "M35 8 L35 82";

  return (
    <svg viewBox="0 0 140 90" fill="none" className="h-full w-full">
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
      <defs>
        <linearGradient id="ds-scan-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.9" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>

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
          <rect x={layer.x} y={layer.y} width="40" height="30" rx="2" fill="currentColor" opacity={0.45} />
          <rect x={layer.x} y={layer.y} width="40" height="30" rx="2" stroke="currentColor" strokeWidth="1.2" />
          {i === 0 && (
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
            <path
              d={`M${layer.x} ${layer.y + 10}h40M${layer.x} ${layer.y + 20}h40M${layer.x + 13} ${layer.y}v30M${layer.x + 27} ${layer.y}v30`}
              stroke="currentColor"
              strokeWidth="0.6"
            />
          )}
          {i === 2 && (
            <path
              d={`M${layer.x} ${layer.y + 30}L${layer.x + 40} ${layer.y}M${layer.x} ${layer.y + 20}L${layer.x + 30} ${layer.y}M${layer.x} ${layer.y + 10}L${layer.x + 20} ${layer.y}`}
              stroke="currentColor"
              strokeWidth="0.6"
            />
          )}
        </motion.g>
      ))}

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
      <motion.g
        initial={{ opacity: 0, scale: 0.6 }}
        animate={playing ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
        style={{ transformOrigin: "16px 14px" }}
        transition={{ duration: 0.35, delay: 0.05, ease: EASE }}
      >
        <circle cx="16" cy="14" r="4.2" fill="currentColor" />
        {/* Precomputed rays keep server and client SVG values identical. */}
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
      <circle
        r="2"
        fill="currentColor"
        opacity={playing ? undefined : 0}
        className={playing ? "motion-safe:animate-travel-path" : undefined}
        style={{ offsetPath: `path("${resolvedPath}")`, animationDuration: "1.8s", animationDelay: "0.9s" }}
      />

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
  const [activeYear, setActiveYear] = useState<string>("all");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const reducedMotion = useReducedMotion();
  const autoDrift = !reducedMotion;
  const interactingRef = useRef(false);
  const pauseUntilRef = useRef(0);

  const years = useMemo(
    () => Array.from(new Set(publications.map((p) => p.year))).sort((a, b) => b - a),
    [],
  );

  const filtered = useMemo(
    () =>
      publications
        .filter((p) => activeYear === "all" || String(p.year) === activeYear)
        .sort((a, b) => b.year - a.year),
    [activeYear],
  );

  function updateScrollButtons() {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollPrev(el.scrollLeft > 4);
    setCanScrollNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }

  // Batch geometry reads before writes to avoid layout thrashing.
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
      const t = Math.min(distance / halfWidth, 1);
      const scale = 1.08 - t * 0.22;
      const opacity = 1 - t * 0.55;
      card.style.transform = `scale(${scale.toFixed(3)})`;
      card.style.opacity = opacity.toFixed(3);
    }
  }

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: 0 });
    updateScrollButtons();
    requestAnimationFrame(updateCoverflow);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeYear]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => updateCoverflow());
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  // A measured rAF loop preserves native scrolling and avoids duplicated cards.
  useEffect(() => {
    if (!autoDrift) return;
    const el = scrollerRef.current;
    if (!el) return;

    const SPEED_PX_PER_SEC = 26;
    let raf = 0;
    let last = performance.now();
    // Keep sub-pixel position outside scrollLeft because browsers may round writes.
    let pos = el.scrollLeft;
    let direction: 1 | -1 = 1;

    function tick(now: number) {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(now - last, 100);
      last = now;

      const max = el!.scrollWidth - el!.clientWidth;
      if (max <= 4) return;

      const paused = interactingRef.current || now < pauseUntilRef.current;
      if (paused) {
        pos = el!.scrollLeft;
        return;
      }

      pos += (direction * SPEED_PX_PER_SEC * dt) / 1000;
      if (pos >= max) {
        pos = max;
        direction = -1;
      } else if (pos <= 0) {
        pos = 0;
        direction = 1;
      }
      el!.scrollLeft = pos;
      updateCoverflow();
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoDrift, filtered.length]);

  function scrollByPage(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    pauseUntilRef.current = performance.now() + 700;
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: "smooth" });
  }

  return (
    <section id="research" aria-label="Publications" className="scroll-mt-24 pb-8 pt-2 md:pb-10 md:pt-4">
      <Container>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {teams.map((team, index) => (
            <TeamFilterCard key={team.slug} team={team} Illustration={ILLUSTRATIONS[index]} />
          ))}
        </div>

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
            <p className="font-body text-ink-100">No publications match this year yet.</p>
            <Button variant="secondary" onClick={() => setActiveYear("all")}>
              Reset filter
            </Button>
          </div>
        ) : (
          <div className="mt-8 rounded-4xl border border-white/8 bg-ink-900 p-4 md:p-6">
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
              {filtered.map((pub) => (
                <PublicationCard key={pub.slug} publication={pub} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}

function PublicationCard({ publication }: { publication: (typeof publications)[number] }) {
  const href = publication.url ?? (publication.doi ? `https://doi.org/${publication.doi}` : undefined);
  const className =
    "group flex w-36 flex-shrink-0 flex-col gap-2 [will-change:transform,opacity] sm:w-40 lg:w-[190px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-000";
  const content = (
    <>
      <div className="rounded-4xl border border-white/8 bg-ink-900 p-1.5 transition-colors group-hover:border-white/20">
        <div className="relative aspect-square overflow-hidden rounded-[1.4rem] bg-ink-800">
          {publication.coverImage && (
            <Image
          src={assetPath(publication.coverImage)}
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
    </>
  );

  if (!href) {
    return (
      <article data-coverflow-card="" className={className}>
        {content}
      </article>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-coverflow-card=""
      className={className}
    >
      {content}
    </a>
  );
}

function TeamFilterCard({
  team,
  Illustration,
}: {
  team: (typeof teams)[number];
  Illustration: (props: { playing: boolean }) => ReactNode;
}): ReactNode {
  const [hovered, setHovered] = useState(false);
  const reducedMotion = useReducedMotion();
  const glowRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  const revealed = hovered;
  const playing = revealed && !reducedMotion;

  function handlePointerMove(e: React.MouseEvent<HTMLAnchorElement>) {
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
    <Link
      href={`/research/${team.slug}/`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      onMouseMove={handlePointerMove}
      onFocus={() => setHovered(true)}
      onBlur={handleLeave}
      className={cn(
        "relative block h-28 w-full cursor-pointer overflow-hidden rounded-4xl border border-white/8 bg-ink-900 text-left transition-[border-color] duration-300 hover:border-ink-000 hover:bg-white/4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-000",
      )}
    >
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
    </Link>
  );
}
