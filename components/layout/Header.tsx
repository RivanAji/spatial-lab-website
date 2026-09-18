"use client";

import { useState } from "react";
import Link from "next/link";
import { List, X } from "@phosphor-icons/react";
import { Container } from "@/components/ui/Container";

// PRD 4.1 — four items, single line at desktop, height under 80px. Below
// `md` the links move into a toggled panel instead of squeezing onto one
// row: at 375px width the four links plus the wordmark had zero pixels of
// right-side gutter left (measured directly, not eyeballed — the "About"
// link's right edge landed exactly on the viewport edge), which is the
// kind of "technically no scrollbar but no margin either" bug that's easy
// to miss in a quick look and breaks for real the moment copy gets a
// pixel longer.
const NAV_ITEMS = [
  { label: "Research", href: "/research" },
  { label: "Projects", href: "/research-projects" },
  { label: "People", href: "/people" },
  { label: "About", href: "/about" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-10 border-b border-ink-600">
      <Container>
        <div className="flex h-16 items-center justify-between md:h-[72px]">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="font-mono text-[13px] uppercase tracking-[0.2em] text-ink-000 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-300"
          >
            Spatial Lab
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-body text-[14px] font-medium text-ink-300 transition-colors hover:text-ink-000 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-300"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center text-ink-100 md:hidden"
          >
            {open ? <X size={22} weight="regular" /> : <List size={22} weight="regular" />}
          </button>
        </div>
      </Container>

      {open && (
        <nav
          aria-label="Primary"
          className="border-t border-ink-600 bg-ink-900 py-4 md:hidden"
        >
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
    </header>
  );
}
