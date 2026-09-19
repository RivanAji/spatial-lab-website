"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ASIA_GRID, GRID_COLS, GRID_ROWS, SURABAYA_CELL, SURABAYA_COORDS } from "@/data/asia-grid";

// Approved motion for the hero only (PRD 6.5): resolve from noise, idle
// pulse, slow scan line, subtle pointer parallax. Nothing here runs when
// `prefers-reduced-motion` is set, or while the hero is scrolled out of
// view, or while the tab is hidden.

const NOISE_CHARS = [".", "·", ":"] as const;
const ASIA_CHARS = [".", ":", "+"] as const;
const INDONESIA_CHARS = ["+", "*", "#"] as const;

type CellDraw = {
  x: number; // column
  y: number; // row
  char: string;
  baseAlpha: number;
  isIndonesia: boolean;
};

function buildCells(): CellDraw[] {
  const out: CellDraw[] = [];
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      const cls = ASIA_GRID[row * GRID_COLS + col];
      if (cls === 0) {
        // Ambient background texture: sparse, not a full grid of dots.
        if (Math.random() > 0.16) continue;
        out.push({
          x: col,
          y: row,
          char: NOISE_CHARS[Math.floor(Math.random() * NOISE_CHARS.length)],
          baseAlpha: 0.05 + Math.random() * 0.05,
          isIndonesia: false,
        });
      } else if (cls === 1) {
        out.push({
          x: col,
          y: row,
          char: ASIA_CHARS[Math.floor(Math.random() * ASIA_CHARS.length)],
          baseAlpha: 0.22 + Math.random() * 0.1,
          isIndonesia: false,
        });
      } else {
        // Indonesia: heavier glyph weight, brighter neutral (PRD 3.2 —
        // brighter than the rest of Asia, but neutral, not accent-coloured;
        // accent is reserved for the locator and the CTA, PRD 29.4).
        out.push({
          x: col,
          y: row,
          char: INDONESIA_CHARS[Math.floor(Math.random() * INDONESIA_CHARS.length)],
          baseAlpha: 0.55 + Math.random() * 0.15,
          isIndonesia: true,
        });
      }
    }
  }
  return out;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export function HeroCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const cellsRef = useRef<CellDraw[] | undefined>(undefined);
  const reduced = usePrefersReducedMotion();

  // Stable across re-renders, but each cell's noise character/threshold is
  // randomised per mount — this is decorative texture, not content, so it
  // doesn't need to be deterministic or survive re-mounts.
  if (!cellsRef.current) cellsRef.current = buildCells();
  const resolveSeed = useMemo(
    () => cellsRef.current!.map(() => Math.random()),
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cellSize = 0;
    let offsetX = 0;
    let offsetY = 0;
    let dpr = 1;

    function resize() {
      const rect = wrap!.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(rect.width * dpr);
      canvas!.height = Math.round(rect.height * dpr);
      canvas!.style.width = `${rect.width}px`;
      canvas!.style.height = `${rect.height}px`;

      // Fit the grid's fixed aspect ratio inside the panel and letterbox
      // rather than stretching it — the grid was rasterised at a specific
      // aspect (PRD 21.2 / scripts/build-map-grid.mjs) and squashing it
      // would distort the outline it was built from.
      const cellW = rect.width / GRID_COLS;
      const cellH = rect.height / GRID_ROWS;
      cellSize = Math.min(cellW, cellH);
      offsetX = (rect.width - cellSize * GRID_COLS) / 2;
      offsetY = (rect.height - cellSize * GRID_ROWS) / 2;
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const fontSize = () => Math.max(cellSize * 0.92, 6);

    function draw(progress: number, scanRow: number | null) {
      ctx!.save();
      ctx!.scale(dpr, dpr);
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx!.textBaseline = "middle";
      ctx!.textAlign = "center";
      ctx!.font = `${fontSize()}px var(--font-mono, monospace)`;

      const cells = cellsRef.current!;
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const resolved = resolveSeed[i] <= progress;
        const char = resolved ? cell.char : NOISE_CHARS[i % NOISE_CHARS.length];
        let alpha = resolved ? cell.baseAlpha : 0.06;

        if (scanRow !== null) {
          const distance = Math.abs(cell.y - scanRow);
          if (distance < 2.5) alpha = Math.min(1, alpha + (1 - distance / 2.5) * 0.35);
        }

        const px = offsetX + cell.x * cellSize + cellSize / 2;
        const py = offsetY + cell.y * cellSize + cellSize / 2;

        // Indonesia renders in near-white (brighter neutral); everything
        // else in a dimmer neutral. Accent blue never appears in the grid
        // itself — only the locator overlay uses it (PRD 29.4).
        ctx!.fillStyle = cell.isIndonesia
          ? `rgba(232, 235, 239, ${alpha})`
          : `rgba(232, 235, 239, ${alpha * 0.85})`;
        ctx!.fillText(char, px, py);
      }
      ctx!.restore();
    }

    let raf = 0;
    let cancelled = false;
    let visible = true;

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(wrap);

    const onVisibilityChange = () => {
      if (document.hidden) visible = false;
      else visible = true;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    if (reduced) {
      draw(1, null);
    } else {
      let start = 0;
      const RESOLVE_MS = 1600;
      let idleStart = 0;
      let lastFrame = 0;

      function tick(t: number) {
        if (cancelled) return;
        raf = requestAnimationFrame(tick);
        if (!visible) return;
        if (t - lastFrame < 33) return; // cap ~30fps, this is texture, not UI
        lastFrame = t;

        if (start === 0) start = t;
        const elapsed = t - start;

        if (elapsed < RESOLVE_MS) {
          draw(elapsed / RESOLVE_MS, null);
          return;
        }

        if (idleStart === 0) idleStart = t;
        const idleElapsed = t - idleStart;
        const scanPeriod = 7000;
        const scanRow = ((idleElapsed % scanPeriod) / scanPeriod) * GRID_ROWS;
        draw(1, scanRow);
      }
      raf = requestAnimationFrame(tick);
    }

    // Pointer parallax on the whole composition, not the canvas alone
    // (PRD 3.3 / 6.5) — small, capped range, skipped on touch devices.
    //
    // A plain CSS transition handles this two-value tween on its own; it
    // doesn't need GSAP's sequencing or scrubbing. Reaching for the library
    // here anyway would pull in its ~30KB gzip chunk (measured while
    // building this) for something five lines of vanilla JS already does,
    // which is exactly the kind of dependency weight PRD 8.4's hero JS
    // budget exists to catch. GSAP stays reserved for the resolve/scan
    // choreography's future scroll-driven work in later phases.
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let onMove: ((e: PointerEvent) => void) | null = null;

    if (!reduced && canHover && parallaxRef.current) {
      parallaxRef.current.style.transition = "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)";
      onMove = (e: PointerEvent) => {
        const rect = wrap!.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        if (parallaxRef.current) {
          parallaxRef.current.style.transform = `translate3d(${nx * 10}px, ${ny * 8}px, 0)`;
        }
      };
      wrap.addEventListener("pointermove", onMove);
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (onMove) wrap.removeEventListener("pointermove", onMove);
    };
  }, [reduced, resolveSeed]);

  const locatorLeftPct = ((SURABAYA_CELL.col + 0.5) / GRID_COLS) * 100;
  const locatorTopPct = ((SURABAYA_CELL.row + 0.5) / GRID_ROWS) * 100;

  return (
    <div
      role="img"
      aria-label="Stylised map of Asia rendered as a character grid, with Indonesia highlighted and Surabaya marked as the laboratory's location, at 07 degrees 15 minutes south, 112 degrees 45 minutes east."
      className="relative aspect-square w-full select-none"
    >
      <div ref={wrapRef} className="absolute inset-0" aria-hidden="true">
        <div ref={parallaxRef} className="absolute inset-0">
          <canvas ref={canvasRef} className="absolute inset-0" />

          <div
            className="absolute flex flex-col items-center"
            style={{ left: `${locatorLeftPct}%`, top: `${locatorTopPct}%` }}
          >
            <div className="relative -translate-x-1/2 -translate-y-1/2">
              <span
                className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink-000 motion-safe:animate-locator-pulse"
                style={{ animationDelay: "1.6s" }}
              />
              <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink-000" />
              <span className="absolute left-1/2 top-1/2 h-4 w-px -translate-x-1/2 -translate-y-1/2 bg-white/60" />
              <span className="absolute left-1/2 top-1/2 h-px w-4 -translate-x-1/2 -translate-y-1/2 bg-white/60" />
            </div>
            <div className="mt-3 whitespace-nowrap text-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-000">
                Surabaya
              </p>
              <p className="font-mono text-[10px] tracking-wide text-ink-300">
                {SURABAYA_COORDS}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
