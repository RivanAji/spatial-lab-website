"use client";

/*
 * Adapted from components/contact/contact-button.tsx,
 * github.com/DavidHDev/rbp-portfolio — the hover-to-reveal-email,
 * click-to-copy interaction and its motion timing are kept the same;
 * icons swapped from lucide-react (Mail/Copy/Check) to this project's
 * existing icon family, Phosphor (PRD 3.C — one icon library per
 * project, and Phosphor was already the established choice before this
 * component existed, so adding lucide-react just for this one button
 * would violate that rather than serve it).
 */

import { AnimatePresence, motion } from "motion/react";
import { EnvelopeSimple, Copy, Check } from "@phosphor-icons/react";
import { useState } from "react";
import type { ReactNode } from "react";

// TODO: placeholder pending the real address. Siti Nurlaela (Head of
// Laboratory, lib/content/people.ts) doesn't have a verified email on
// file yet (PRD 3.5) — asked the site owner for it rather than
// guessing at an @its.ac.id pattern, which risks sending someone to a
// real inbox that isn't hers.
const EMAIL = "siti.nurlaela@its.ac.id";
const EASE = [0.22, 1, 0.36, 1] as const;

export function ContactButton(): ReactNode {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = EMAIL;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      } catch {
        // Clipboard unavailable in this environment; the button still
        // announces the address via aria-label below.
      }
      document.body.removeChild(ta);
    }
  };

  return (
    <motion.button
      type="button"
      layout
      onClick={handleCopy}
      onHoverStart={() => setOpen(true)}
      onHoverEnd={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      aria-label={
        copied ? "Email copied" : open ? `Copy ${EMAIL}` : "Show email"
      }
      transition={{ layout: { duration: 0.55, ease: EASE } }}
      style={{ borderRadius: 12 }}
      // Monochrome pivot (2026-09-19), matching the reference's own
      // bg-foreground/text-background primary button exactly now
      // instead of the brand blue this used until this point.
      className="relative inline-flex h-11 cursor-pointer items-center justify-center bg-ink-000 px-5 font-body text-sm font-medium text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-000"
    >
      <motion.span layout="position" className="relative inline-flex items-center">
        <AnimatePresence initial={false} mode="popLayout">
          {open ? (
            <motion.span
              key="email"
              layout="position"
              initial={{ opacity: 0, filter: "blur(8px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(8px)" }}
              transition={{ duration: 0.35, ease: EASE }}
              className="inline-flex items-center gap-2 whitespace-nowrap"
            >
              <span className="relative inline-flex h-4 w-4 shrink-0 items-center justify-center">
                <AnimatePresence initial={false} mode="wait">
                  {copied ? (
                    <motion.span
                      key="check"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ duration: 0.2, ease: EASE }}
                      className="inline-flex"
                    >
                      <Check className="h-4 w-4" aria-hidden="true" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ duration: 0.2, ease: EASE }}
                      className="inline-flex"
                    >
                      <Copy className="h-4 w-4" aria-hidden="true" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
              <span className="tabular-nums">{EMAIL}</span>
            </motion.span>
          ) : (
            <motion.span
              key="contact"
              layout="position"
              initial={{ opacity: 0, filter: "blur(8px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(8px)" }}
              transition={{ duration: 0.35, ease: EASE }}
              className="inline-flex items-center gap-2 whitespace-nowrap"
            >
              <EnvelopeSimple className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Contact</span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>
    </motion.button>
  );
}
