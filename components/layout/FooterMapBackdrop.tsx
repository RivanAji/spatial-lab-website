"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ASIA_GRID, GRID_COLS, GRID_ROWS } from "@/data/asia-grid";

// Footer background (2026-09-20, site owner's request): "tambahkan
// backgroundnya dengan animasi peta... peta jaringan yang lengkap
// dengan effect ASCIInya" — replaces the flat "TSAL" watermark text
// that used to sit behind the footer. Same ASCII character-grid map
// and the same generated data (data/asia-grid.ts) HeroCanvas.tsx
// draws, but a plain decorative pass, not a second copy of that
// component: no click-to-replay, no Surabaya locator pin, no pointer
// parallax — none of those make sense on a background layer nobody is
// meant to interact with, and HeroCanvas's own accessible name
// ("Stylised map... Activate to replay") would be actively wrong
// here, since there's nothing to activate. A real interactive
// component duplicated for decoration would also mean two focusable
// map buttons on one page for one real destination.
//
// Fit is "cover", not HeroCanvas's "contain": the hero's card shows
// the map's true, undistorted aspect ratio because getting that shape
// right was the whole point there; here the map is texture behind
// footer text; letterboxing it would just leave two empty bars in a
// background that's supposed to fill the section. cellSize picks the
// LARGER of the two axis-fits (Math.max, not HeroCanvas's Math.min),
// so the grid overflows and crops at the footer's edges instead.

const NOISE_CHARS = [".", "·", ":"] as const;
const ASIA_CHARS = [".", ":", "+"] as const;
const INDONESIA_CHARS = ["+", "*", "#"] as const;

type CellDraw = {
  x: number;
  y: number;
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
        if (Math.random() > 0.16) continue;
        out.push({
          x: col,
          y: row,
          char: NOISE_CHARS[Math.floor(Math.random() * NOISE_CHARS.length)],
          baseAlpha: 0.04 + Math.random() * 0.04,
          isIndonesia: false,
        });
      } else if (cls === 1) {
        out.push({
          x: col,
          y: row,
          char: ASIA_CHARS[Math.floor(Math.random() * ASIA_CHARS.length)],
          baseAlpha: 0.1 + Math.random() * 0.05,
          isIndonesia: false,
        });
      } else {
        out.push({
          x: col,
          y: row,
          char: INDONESIA_CHARS[Math.floor(Math.random() * INDONESIA_CHARS.length)],
          baseAlpha: 0.22 + Math.random() * 0.08,
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

export function FooterMapBackdrop() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cellsRef = useRef<CellDraw[] | undefined>(undefined);
  const reduced = usePrefersReducedMotion();

  if (!cellsRef.current) cellsRef.current = buildCells();
  const resolveSeed = useMemo(() => cellsRef.current!.map(() => Math.random()), []);

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

      const cellW = rect.width / GRID_COLS;
      const cellH = rect.height / GRID_ROWS;
      cellSize = Math.max(cellW, cellH);
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
        let alpha = resolved ? cell.baseAlpha : 0.03;

        if (scanRow !== null) {
          const distance = Math.abs(cell.y - scanRow);
          if (distance < 2.5) alpha = Math.min(0.6, alpha + (1 - distance / 2.5) * 0.2);
        }

        const px = offsetX + cell.x * cellSize + cellSize / 2;
        const py = offsetY + cell.y * cellSize + cellSize / 2;

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
      visible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    if (reduced) {
      draw(1, null);
    } else {
      let start = 0;
      let idleStart = 0;
      let lastFrame = 0;
      const RESOLVE_MS = 1800;

      function tick(t: number) {
        if (cancelled) return;
        raf = requestAnimationFrame(tick);
        if (!visible) return;
        if (t - lastFrame < 33) return; // ~30fps cap, texture not UI
        lastFrame = t;

        if (start === 0) start = t;
        const elapsed = t - start;

        if (elapsed < RESOLVE_MS) {
          draw(elapsed / RESOLVE_MS, null);
          return;
        }

        if (idleStart === 0) idleStart = t;
        const idleElapsed = t - idleStart;
        const scanPeriod = 9000;
        const scanRow = ((idleElapsed % scanPeriod) / scanPeriod) * GRID_ROWS;
        draw(1, scanRow);
      }
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [reduced, resolveSeed]);

  return (
    <div ref={wrapRef} aria-hidden="true" className="pointer-events-none absolute inset-0">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
