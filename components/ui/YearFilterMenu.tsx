"use client";

// Shared dropdown keeps year filters compact when a chip row would wrap above a horizontal slider.
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CalendarBlank, CaretDown } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

const EASE = [0.22, 1, 0.36, 1] as const;

export function YearFilterMenu({
  years,
  activeYear,
  onChange,
}: {
  years: number[];
  activeYear: string;
  onChange: (year: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const label = activeYear === "all" ? "All years" : activeYear;

  function select(year: string) {
    onChange(year);
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1.5 rounded-full border py-2.5 pl-3 pr-2.5 font-mono md:py-1.5 text-[11px] uppercase tracking-[0.08em] transition-colors duration-150",
          open || activeYear !== "all"
            ? "border-ink-000 text-ink-000"
            : "border-ink-500 text-ink-300 hover:border-ink-300 hover:text-ink-100",
        )}
      >
        <CalendarBlank size={12} weight="bold" aria-hidden="true" />
        {label}
        <CaretDown
          size={10}
          weight="bold"
          aria-hidden="true"
          className={cn("transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            aria-label="Filter by year"
            initial={reducedMotion ? false : { opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: reducedMotion ? 0 : 0.16, ease: EASE }}
            className="absolute left-0 top-[calc(100%+8px)] z-20 w-60 rounded-2xl border border-white/8 bg-ink-800 p-2 shadow-[0_16px_48px_rgba(0,0,0,0.45)]"
            style={{ transformOrigin: "top left" }}
          >
            <button
              type="button"
              role="option"
              aria-selected={activeYear === "all"}
              onClick={() => select("all")}
              className={cn(
                "w-full rounded-xl px-3 py-2.5 text-left font-mono md:py-1.5 text-[10px] uppercase tracking-[0.06em] transition-colors",
                activeYear === "all"
                  ? "bg-white/10 text-ink-000"
                  : "text-ink-300 hover:bg-white/5 hover:text-ink-100",
              )}
            >
              All years
            </button>
            <div className="mt-1 grid grid-cols-3 gap-1">
              {years.map((year) => (
                <button
                  key={year}
                  type="button"
                  role="option"
                  aria-selected={activeYear === String(year)}
                  onClick={() => select(String(year))}
                  className={cn(
                    "rounded-lg px-2 py-2.5 text-center font-mono md:py-1.5 text-[10px] transition-colors",
                    activeYear === String(year)
                      ? "bg-white/10 text-ink-000"
                      : "text-ink-300 hover:bg-white/5 hover:text-ink-100",
                  )}
                >
                  {year}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
