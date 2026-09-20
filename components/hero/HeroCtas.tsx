"use client";

// LayoutGroup keeps the CTA row stable while ContactButton expands to reveal the address.

import { ArrowDown } from "@phosphor-icons/react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { ContactButton } from "./ContactButton";

const EASE = [0.22, 1, 0.36, 1] as const;

export function HeroCtas(): ReactNode {
  const reducedMotion = useReducedMotion();

  return (
    <LayoutGroup>
      <motion.div
        layout
        transition={{ layout: { duration: 0.55, ease: EASE } }}
        className="mt-2 flex flex-wrap items-center gap-3"
      >
        <ContactButton />

        <motion.div layout transition={{ layout: { duration: 0.55, ease: EASE } }}>
          <a
            href="#research"
            className="group inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-white/8 bg-ink-900 px-5 font-body text-sm font-medium text-ink-100 shadow-sm transition-colors hover:bg-white/4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-000"
          >
            Explore Research
            {/* Signals that this control scrolls to a real section; reduced motion disables the loop. */}
            <motion.span
              className="inline-flex"
              animate={reducedMotion ? { y: 0 } : { y: [0, 4, 0] }}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : { duration: 1.4, repeat: Infinity, ease: "easeInOut" }
              }
            >
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </motion.span>
          </a>
        </motion.div>
      </motion.div>
    </LayoutGroup>
  );
}
