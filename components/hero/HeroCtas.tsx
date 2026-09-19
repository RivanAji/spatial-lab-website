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
import { LayoutGroup, motion } from "motion/react";
import type { ReactNode } from "react";

import { ContactButton } from "./ContactButton";

const EASE = [0.22, 1, 0.36, 1] as const;

export function HeroCtas(): ReactNode {
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
            className="group inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/8 bg-ink-900 px-5 py-2.5 font-body text-sm font-medium text-ink-100 shadow-sm transition-colors hover:bg-white/4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-000"
          >
            Explore Research
            <ArrowDown
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
              aria-hidden="true"
            />
          </a>
        </motion.div>
      </motion.div>
    </LayoutGroup>
  );
}
