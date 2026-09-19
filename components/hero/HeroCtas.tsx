"use client";

/*
 * Structure adapted from components/hero/hero-ctas.tsx,
 * github.com/DavidHDev/rbp-portfolio: a LayoutGroup so the two buttons
 * reflow smoothly around ContactButton's own width change (Contact ->
 * showing the email) rather than jumping. "View My Work" becomes
 * "Explore Research", and — per the site owner's request — it's a
 * same-page smooth-scroll to the Research Teams section below instead
 * of a route link, since the destination already exists further down
 * this page.
 */

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
          {/* h-11, matching ContactButton's own fixed height exactly
              (site owner: the two buttons read as uneven heights side
              by side) — this one had no fixed height, just vertical
              padding, so its rendered height drifted a few pixels off
              ContactButton's depending on line-height rounding. */}
          <a
            href="#research"
            className="group inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-white/8 bg-ink-900 px-5 font-body text-sm font-medium text-ink-100 shadow-sm transition-colors hover:bg-white/4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-000"
          >
            Explore Research
            {/* Idle bob (site owner's request): a real "scroll to the
                next section" affordance, not decoration for its own
                sake, on a control that genuinely does scroll somewhere
                real — same justification PRD 6.5 already grants the
                hero locator's own idle pulse. Static under reduced
                motion rather than looping. */}
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
