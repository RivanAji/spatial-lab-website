"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { List, X } from "@phosphor-icons/react";
import { Container } from "@/components/ui/Container";
import logo from "@/public/brand/logo.png";

// Replaces the earlier ThreeUI AnimatedTopDock per the site owner's
// direction (2026-09-19): "keep the dock concept, drop the boxed-item
// styling" — reference: https://rbp-portfolio.vercel.app. That site's
// nav is a single soft pill (bg matching the page, an 8%-opacity
// border, a sliding indicator behind the current/hovered link) rather
// than a bordered box per item. Structure below (pill recipe, sliding
// indicator, indicator sizing off a measured rect) is read directly
// from that reference's rendered DOM, not guessed at; the vendored
// ThreeUI physics engine is gone (uninstalled) since it no longer
// matches the direction.
const NAV_ITEMS = [
  { label: "Research", href: "/research" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "People", href: "/people" },
  { label: "About", href: "/about" },
];

function DesktopNav() {
  const pathname = usePathname();
  const listRef = useRef<HTMLUListElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  const active = hovered ?? NAV_ITEMS.find((item) => item.href === pathname)?.href ?? null;

  function updateIndicator(href: string | null) {
    if (!href || !listRef.current) {
      setIndicator(null);
      return;
    }
    const el = listRef.current.querySelector<HTMLElement>(`[data-href="${href}"]`);
    if (!el) return;
    // offsetLeft is relative to the nearest positioned ancestor, which is
    // each item's own <li className="relative"> — not the <ul> the
    // indicator is actually positioned against, so every item reported
    // roughly the same small offset regardless of where it actually sat
    // (caught by hovering "About" and watching the indicator stay at
    // left:0 instead of moving to the right). Bounding rects, measured
    // against the same <ul>, aren't fooled by intermediate positioned
    // ancestors.
    const listRect = listRef.current.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setIndicator({ left: elRect.left - listRect.left, width: elRect.width });
  }

  // Positions the indicator on the current page's link on first render
  // (and if the route changes) rather than leaving it hidden until the
  // first hover — fonts/layout settle a frame or two after mount, so
  // this re-measures once more shortly after.
  useEffect(() => {
    updateIndicator(pathname ?? null);
    const timeout = setTimeout(() => updateIndicator(pathname ?? null), 150);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <nav
      aria-label="Primary"
      className="fixed left-1/2 top-5 z-50 hidden -translate-x-1/2 md:block"
      onMouseLeave={() => {
        setHovered(null);
        updateIndicator(pathname ?? null);
      }}
    >
      <ul
        ref={listRef}
        className="relative flex items-center gap-1 rounded-full border border-white/8 bg-ink-900/95 p-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-sm"
      >
        {indicator && (
          <span
            aria-hidden="true"
            className="absolute inset-y-1.5 rounded-full bg-white/5 ring-1 ring-white/8 transition-[left,width] duration-300 ease-out"
            style={{ left: indicator.left, width: indicator.width }}
          />
        )}
        {NAV_ITEMS.map((item) => {
          const current = pathname === item.href;
          return (
            <li key={item.href} className="relative">
              <Link
                href={item.href}
                data-href={item.href}
                aria-current={current ? "page" : undefined}
                onMouseEnter={() => {
                  setHovered(item.href);
                  updateIndicator(item.href);
                }}
                className={`relative z-10 inline-flex items-center justify-center rounded-full px-4 py-1.5 font-body text-sm font-medium transition-colors duration-200 ${
                  active === item.href ? "text-ink-000" : "text-ink-300 hover:text-ink-100"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header>
      {/* Small brand mark, independent of the centred nav pill — the
          reference has no logo (personal-name site), but this project
          still needs one visible; a separate mark beside a centred
          pill is a common enough pairing that it doesn't fight the
          minimal language. */}
      <Link
        href="/"
        aria-label="Spatial Analysis & Transportation Laboratory, home"
        className="fixed left-6 top-5 z-50 hidden md:block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-300"
      >
        <Image src={logo} alt="" priority height={32} className="h-8 w-auto" />
      </Link>

      <DesktopNav />

      {/* Mobile: unchanged in-flow bar (the floating pill's fixed-width
          items were never going to fit four labels plus a logo at
          375px), restyled with the same soft border language as the
          desktop pill instead of a solid ink-600 line. */}
      <div className="border-b border-white/8 bg-ink-900 md:hidden">
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
          <nav aria-label="Primary" className="border-t border-white/8 bg-ink-900 py-4">
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
