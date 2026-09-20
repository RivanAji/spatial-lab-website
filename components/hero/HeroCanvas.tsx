"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ASIA_GRID, GRID_COLS, GRID_ROWS, SURABAYA_CELL, SURABAYA_COORDS } from "@/data/asia-grid";

const NOISE_CHARS = [".", "0", "1", ":"] as const;
const ASIA_CHARS = [".", "0", "1", ":", "+"] as const;
const INDONESIA_CHARS = ["0", "1", "+", "*", "#"] as const;
const PARTICLE_CHARS = [".", "0", "1", ":", "+", "*"] as const;

type CellDraw = {
  x: number; // column
  y: number; // row
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
        if (Math.random() > 0.07) continue;
        out.push({
          x: col,
          y: row,
          char: NOISE_CHARS[Math.floor(Math.random() * NOISE_CHARS.length)],
          baseAlpha: 0.025 + Math.random() * 0.025,
          isIndonesia: false,
          phase: Math.random() * NOISE_CHARS.length,
          mutationMs: 2200 + Math.random() * 3200,
        });
      } else if (cls === 1) {
        if (Math.random() > 0.48) continue;
        out.push({
          x: col,
          y: row,
          char: ASIA_CHARS[Math.floor(Math.random() * ASIA_CHARS.length)],
          baseAlpha: 0.2 + Math.random() * 0.12,
          isIndonesia: false,
          phase: Math.random() * ASIA_CHARS.length,
          mutationMs: 1800 + Math.random() * 2800,
        });
      } else {
        if (Math.random() > 0.64) continue;
        out.push({
          x: col,
          y: row,
          char: INDONESIA_CHARS[Math.floor(Math.random() * INDONESIA_CHARS.length)],
          baseAlpha: 0.4 + Math.random() * 0.16,
          isIndonesia: true,
          phase: Math.random() * INDONESIA_CHARS.length,
          mutationMs: 1500 + Math.random() * 2200,
        });
      }
    }
  }
  return out;
}

type Particle = {
  char: string;
  xFrac: number;
  yFrac: number;
};

function buildParticles(): Particle[] {
  const count = 40;
  const out: Particle[] = [];
  for (let i = 0; i < count; i++) {
    out.push({
      char: PARTICLE_CHARS[Math.floor(Math.random() * PARTICLE_CHARS.length)],
      xFrac: 0.05 + Math.random() * 0.9,
      yFrac: 0.05 + Math.random() * 0.9,
    });
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
  const locatorRef = useRef<HTMLDivElement>(null);
  const cellsRef = useRef<CellDraw[] | undefined>(undefined);
  const particlesRef = useRef<Particle[] | undefined>(undefined);
  const reduced = usePrefersReducedMotion();

  if (!cellsRef.current) cellsRef.current = buildCells();
  if (!particlesRef.current) particlesRef.current = buildParticles();
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
    let panelWidth = 0;
    let panelHeight = 0;
    let pointerX = -1000;
    let pointerY = -1000;
    let pointerActive = false;
    let monoFont = "ui-monospace, monospace";

    function resize() {
      const rect = wrap!.getBoundingClientRect();
      panelWidth = rect.width;
      panelHeight = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const resolvedMonoFont = getComputedStyle(document.documentElement)
        .getPropertyValue("--mono-font")
        .trim();
      monoFont = resolvedMonoFont
        ? `${resolvedMonoFont}, ui-monospace, monospace`
        : "ui-monospace, monospace";
      canvas!.width = Math.round(rect.width * dpr);
      canvas!.height = Math.round(rect.height * dpr);
      canvas!.style.width = `${rect.width}px`;
      canvas!.style.height = `${rect.height}px`;

      // Preserve the rasterised grid ratio instead of distorting coastlines.
      const cellW = rect.width / GRID_COLS;
      const cellH = rect.height / GRID_ROWS;
      cellSize = Math.min(cellW, cellH);
      offsetX = (rect.width - cellSize * GRID_COLS) / 2;
      offsetY = (rect.height - cellSize * GRID_ROWS) / 2;

      // Keep locator in the same letterboxed pixel space as the canvas.
      if (locatorRef.current) {
        const lx = offsetX + (SURABAYA_CELL.col + 0.5) * cellSize;
        const ly = offsetY + (SURABAYA_CELL.row + 0.5) * cellSize;
        locatorRef.current.style.left = `${lx}px`;
        locatorRef.current.style.top = `${ly}px`;
      }
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    window.addEventListener("resize", resize);

    const fontSize = () => Math.max(cellSize * 0.55, 2.75);

    function draw(progress: number, time: number) {
      ctx!.save();
      ctx!.scale(dpr, dpr);
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx!.textBaseline = "middle";
      ctx!.textAlign = "center";
      ctx!.font = `${fontSize()}px ${monoFont}`;

      const cells = cellsRef.current!;
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const resolved = resolveSeed[i] <= progress;
        const alphabet = cell.isIndonesia ? INDONESIA_CHARS : ASIA_CHARS;
        const mutationCycle = time / cell.mutationMs + cell.phase;
        const mutationIndex = Math.floor(mutationCycle) % alphabet.length;
        const nextMutationIndex = (mutationIndex + 1) % alphabet.length;
        const mutationProgress = mutationCycle - Math.floor(mutationCycle);
        const mutationBlend = Math.max(0, Math.min(1, (mutationProgress - 0.72) / 0.28));
        const char = resolved ? alphabet[mutationIndex] : NOISE_CHARS[i % NOISE_CHARS.length];
        let alpha = resolved ? cell.baseAlpha : 0.06;

        const px = offsetX + cell.x * cellSize + cellSize / 2;
        const py = offsetY + cell.y * cellSize + cellSize / 2;

        if (pointerActive) {
          const distance = Math.hypot(px - pointerX, py - pointerY);
          const hoverRadius = Math.max(70, panelWidth * 0.24);
          const proximity = Math.max(0, 1 - distance / hoverRadius);
          alpha = Math.min(0.72, alpha + proximity * proximity * 0.5);
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

      // Resolve particles disappear before the geographic form is complete.
      if (progress < 1) {
        const particleProgress = Math.min(progress / 0.7, 1);
        const alpha = (1 - particleProgress) * 0.5;
        if (alpha > 0.01) {
          ctx!.save();
          ctx!.textAlign = "center";
          ctx!.textBaseline = "middle";
          ctx!.font = `${Math.max(cellSize * 0.6, 3.25)}px ${monoFont}`;
          ctx!.fillStyle = `rgba(232, 235, 239, ${alpha})`;
          for (const particle of particlesRef.current!) {
            ctx!.fillText(particle.char, particle.xFrac * panelWidth, particle.yFrac * panelHeight);
          }
          ctx!.restore();
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
      if (document.hidden) visible = false;
      else visible = true;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    let start = 0;
    const RESOLVE_MS = 2200;
    let onClick: (() => void) | null = null;

    if (reduced) {
      draw(1, 0);
    } else {
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
          draw(elapsed / RESOLVE_MS, t);
          return;
        }

        draw(1, t);
      }
      raf = requestAnimationFrame(tick);

      // Rebuild particles only; rebuilding cells would desynchronise resolveSeed.
      onClick = () => {
        particlesRef.current = buildParticles();
        start = 0;
      };
      wrap.addEventListener("click", onClick);
    }

    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let onMove: ((e: PointerEvent) => void) | null = null;
    let onLeave: (() => void) | null = null;

    if (!reduced && canHover && parallaxRef.current) {
      parallaxRef.current.style.transition = "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)";
      onMove = (e: PointerEvent) => {
        const rect = wrap!.getBoundingClientRect();
        pointerX = e.clientX - rect.left;
        pointerY = e.clientY - rect.top;
        pointerActive = true;
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        if (parallaxRef.current) {
          parallaxRef.current.style.transform = `translate3d(${nx * 10}px, ${ny * 8}px, 0)`;
        }
      };
      onLeave = () => {
        pointerActive = false;
        if (parallaxRef.current) parallaxRef.current.style.transform = "translate3d(0,0,0)";
      };
      wrap.addEventListener("pointermove", onMove);
      wrap.addEventListener("pointerleave", onLeave);
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (onMove) wrap.removeEventListener("pointermove", onMove);
      if (onLeave) wrap.removeEventListener("pointerleave", onLeave);
      if (onClick) wrap.removeEventListener("click", onClick);
    };
  }, [reduced, resolveSeed]);

  return (
    <button
      type="button"
      aria-label="Stylised map of Asia rendered as a character grid, with Indonesia highlighted and Surabaya marked as the laboratory's location, at 07 degrees 15 minutes south, 112 degrees 45 minutes east. Activate to replay the resolve animation."
      className="relative h-full w-full cursor-pointer select-none appearance-none border-0 bg-transparent p-0 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink-000"
    >
      <div ref={wrapRef} className="absolute inset-0" aria-hidden="true">
        <div ref={parallaxRef} className="absolute inset-0">
          <canvas ref={canvasRef} className="absolute inset-0" />

          <div ref={locatorRef} className="absolute" style={{ left: "50%", top: "50%" }}>
            <span className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2">
              <span
                className="absolute inset-0 rounded-full border border-ink-000 motion-safe:animate-locator-pulse"
                style={{ animationDelay: "1.6s" }}
              />
            </span>
            <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink-000" />
            <span className="absolute left-1/2 top-1/2 h-4 w-px -translate-x-1/2 -translate-y-1/2 bg-white/60" />
            <span className="absolute left-1/2 top-1/2 h-px w-4 -translate-x-1/2 -translate-y-1/2 bg-white/60" />
            <div
              className="absolute left-1/2 top-1/2 whitespace-nowrap text-center"
              style={{ transform: "translate(-50%, 14px)" }}
            >
              <p className="font-mono text-[10px] tracking-wide text-ink-300">
                {SURABAYA_COORDS}
              </p>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
