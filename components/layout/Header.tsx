"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { List, X } from "@phosphor-icons/react";
import { Container } from "@/components/ui/Container";
import { AnimatedTopDock } from "./animated-top-dock/AnimatedTopDock";
import logo from "@/public/brand/logo.png";

// Nav per the site owner's direction (2026-09-19): Research, Roadmap,
// People, About. Note Roadmap has no real content yet (PRD 7.9 defers
// building that section to Phase 9) — the link is live because that's
// what was asked for, but /roadmap is a Phase 6+ page like the other
// three, not yet built.
const NAV_ITEMS = [
  { label: "Research", href: "/research" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "People", href: "/people" },
  { label: "About", href: "/about" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    // Sticky, not fixed: stays in normal flow (no manual top-padding
    // compensation needed on every page) but pins to the viewport top
    // past its own position. Solid ink-900 background — the same value
    // as the page ground, so it reads as "the page keeps its header
    // visible," not as a floating glass panel over the content.
    //
    // AnimatedTopDock (>= md) is absolutely positioned and centred by
    // its own CSS, which needs this header to be its positioning
    // context — sticky already establishes one, same as relative would.
    <header className="sticky top-0 z-50 h-16 border-b border-ink-600 bg-ink-900 md:h-[72px]">
      {/* Desktop / tablet: the dock capsule carries both the logo (as
          its first item, per the authored "sable" structure) and the
          four nav links, centred in the bar. Mobile below has its own
          plain logo + hamburger row instead — the capsule's fixed pill
          widths were never going to fit four 96px items plus a logo in
          375px, and the dock's own controller already disables the
          hover/proximity spring under 600px anyway. */}
      <div className="hidden h-full md:block">
        <AnimatedTopDock />
      </div>

      <div className="md:hidden">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              aria-label="Spatial Analysis & Transportation Laboratory, home"
              className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-300"
            >
              <Image src={logo} alt="" priority height={36} className="h-9 w-auto" />
            </Link>

            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="flex h-11 w-11 items-center justify-center text-ink-100"
            >
              {open ? <X size={22} weight="regular" /> : <List size={22} weight="regular" />}
            </button>
          </div>
        </Container>

        {open && (
          <nav aria-label="Primary" className="border-t border-ink-600 bg-ink-900 py-4">
            <Container>
              <div className="flex flex-col gap-1">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="py-3 font-body text-base text-ink-100"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </Container>
          </nav>
        )}
      </div>
    </header>
  );
}
