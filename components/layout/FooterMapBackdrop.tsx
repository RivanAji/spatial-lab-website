"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ASIA_GRID, GRID_COLS, GRID_ROWS, SURABAYA_CELL } from "@/data/asia-grid";

const NOISE_CHARS = [".", "0", "1", ":"] as const;
const ASIA_CHARS = [".", "0", "1", ":", "+"] as const;
const INDONESIA_CHARS = ["0", "1", "+", "*", "#"] as const;

type CellDraw = {
  x: number;
  y: number;
  char: string;
  baseAlpha: number;
  isIndonesia: boolean;
  phase: number;
  mutationMs: number;
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
          phase: Math.random() * NOISE_CHARS.length,
          mutationMs: 3800 + Math.random() * 5000,
        });
      } else if (cls === 1) {
        out.push({
          x: col,
          y: row,
          char: ASIA_CHARS[Math.floor(Math.random() * ASIA_CHARS.length)],
          baseAlpha: 0.07 + Math.random() * 0.04,
          isIndonesia: false,
          phase: Math.random() * ASIA_CHARS.length,
          mutationMs: 3200 + Math.random() * 4200,
        });
      } else {
        out.push({
          x: col,
          y: row,
          char: INDONESIA_CHARS[Math.floor(Math.random() * INDONESIA_CHARS.length)],
          baseAlpha: 0.13 + Math.random() * 0.05,
          isIndonesia: true,
          phase: Math.random() * INDONESIA_CHARS.length,
          mutationMs: 2600 + Math.random() * 3200,
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
    let panelWidth = 0;
    let pointerX = -1000;
    let pointerY = -1000;
    let pointerActive = false;

    function resize() {
      const rect = wrap!.getBoundingClientRect();
      panelWidth = rect.width;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(rect.width * dpr);
      canvas!.height = Math.round(rect.height * dpr);
      canvas!.style.width = `${rect.width}px`;
      canvas!.style.height = `${rect.height}px`;

      const cellW = rect.width / GRID_COLS;
      const cellH = rect.height / GRID_ROWS;
      cellSize = Math.max(cellW, cellH);
      offsetX = (rect.width - cellSize * GRID_COLS) / 2;

      // Anchor the cover crop on Surabaya so Indonesia stays visible.
      const idealOffsetY = rect.height / 2 - (SURABAYA_CELL.row + 0.5) * cellSize;
      const minOffsetY = rect.height - cellSize * GRID_ROWS;
      offsetY = Math.min(0, Math.max(minOffsetY, idealOffsetY));
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const fontSize = () => Math.max(cellSize * 0.58, 3.5);

    function draw(progress: number, scanRow: number | null, time: number) {
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
        const alphabet = cell.isIndonesia ? INDONESIA_CHARS : ASIA_CHARS;
        const mutationCycle = time / cell.mutationMs + cell.phase;
        const mutationIndex = Math.floor(mutationCycle) % alphabet.length;
        const nextMutationIndex = (mutationIndex + 1) % alphabet.length;
        const mutationProgress = mutationCycle - Math.floor(mutationCycle);
        const mutationBlend = Math.max(0, Math.min(1, (mutationProgress - 0.76) / 0.24));
        const char = resolved ? alphabet[mutationIndex] : NOISE_CHARS[i % NOISE_CHARS.length];
        let alpha = resolved ? cell.baseAlpha : 0.03;

        if (scanRow !== null) {
          const distance = Math.abs(cell.y - scanRow);
          if (distance < 2.5) alpha = Math.min(0.6, alpha + (1 - distance / 2.5) * 0.2);
        }

        const px = offsetX + cell.x * cellSize + cellSize / 2;
        const py = offsetY + cell.y * cellSize + cellSize / 2;

        if (pointerActive) {
          const distance = Math.hypot(px - pointerX, py - pointerY);
          const hoverRadius = Math.max(90, panelWidth * 0.16);
          const proximity = Math.max(0, 1 - distance / hoverRadius);
          alpha = Math.min(0.78, alpha + proximity * proximity * 0.62);
        }

        const visibleAlpha = cell.isIndonesia ? alpha : alpha * 0.85;
        if (resolved && mutationBlend > 0) {
          ctx!.fillStyle = `rgba(232, 235, 239, ${visibleAlpha * (1 - mutationBlend)})`;
          ctx!.fillText(char, px, py);
          ctx!.fillStyle = `rgba(232, 235, 239, ${visibleAlpha * mutationBlend})`;
          ctx!.fillText(alphabet[nextMutationIndex], px, py);
        } else {
          ctx!.fillStyle = `rgba(232, 235, 239, ${visibleAlpha})`;
          ctx!.fillText(char, px, py);
        }
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
      draw(1, null, 0);
    } else {
      let start = 0;
      let idleStart = 0;
      let lastFrame = 0;
      const RESOLVE_MS = 3000;

      function tick(t: number) {
        if (cancelled) return;
        raf = requestAnimationFrame(tick);
        if (!visible) return;
        if (t - lastFrame < 33) return; // ~30fps cap, texture not UI
        lastFrame = t;

        if (start === 0) start = t;
        const elapsed = t - start;

        if (elapsed < RESOLVE_MS) {
          draw(elapsed / RESOLVE_MS, null, t);
          return;
        }

        if (idleStart === 0) idleStart = t;
        const idleElapsed = t - idleStart;
        const scanPeriod = 18000;
        const scanRow = ((idleElapsed % scanPeriod) / scanPeriod) * GRID_ROWS;
        draw(1, scanRow, t);
      }
      raf = requestAnimationFrame(tick);
    }

    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const onPointerMove = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      pointerX = event.clientX - rect.left;
      pointerY = event.clientY - rect.top;
      pointerActive =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
    };
    if (!reduced && canHover) window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (!reduced && canHover) window.removeEventListener("pointermove", onPointerMove);
    };
  }, [reduced, resolveSeed]);

  return (
    <div ref={wrapRef} aria-hidden="true" className="pointer-events-none absolute inset-0">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
