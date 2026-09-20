"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { List, X } from "@phosphor-icons/react";
import { Container } from "@/components/ui/Container";
import logo from "@/public/brand/logo-white.png";

// Monochrome pivot (2026-09-19): the lab mark now renders in white
// (de-matted from the same source PNG used earlier, this time filled
// solid white instead of the two brand blues — see
// public/brand/logo-white.png) rather than the brand blue used until
// this point. The site's accent colour is dropped site-wide in favour
// of strict black and white, matching the reference's own stated
// palette (github.com/DavidHDev/rbp-portfolio README: "The palette is
// strict black and white. No accent or semantic color hues are used.")
// — this project had been drifting toward that anyway through this
// whole redesign; this is the site owner making it explicit.
//
// The ITS institutional mark (also recoloured white, same source and
// method) sits in this header's own top-right corner, mirroring the lab
// mark's top-left position — both stay visible on scroll.
//
// Vertical alignment (2026-09-19): the lab mark, nav pill and ITS mark
// used to be three independently `fixed` elements each pinned at the
// same `top-*` value — which lines up their boxes' tops, not their
// visual centres, since the nav pill is taller than either logo once
// its own padding is counted. Replaced with one fixed 3-column grid bar
// (`items-center`) so all three sit on a true shared centreline
// regardless of each child's own height, instead of hand-tuning offsets
// per child to fake the same result.

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
// Research (2026-09-19, site owner's request): this is a one-page site —
// ResearchArchive.tsx (a separate full-list section) was removed the same
// day as redundant with PublicationsShowcase's own gallery below the
// hero, and there never was a real `/research` route behind this link
// (checked: no app/research directory exists, so it was a dead link).
// Same-page anchor now, matching HeroCtas.tsx's own "Explore Research"
// control exactly — both point at the one gallery that actually exists.
//
// Roadmap (2026-09-20, site owner's correction): first tried as a
// disabled comingSoon nav item, since the roadmap content itself isn't
// ready — but the site owner's actual ask was a real section, placed
// on the page below the publications gallery, that's honest about not
// having content yet rather than a nav item that goes nowhere. Same
// same-page-anchor treatment as Research now (components/sections/
// Roadmap.tsx renders the section itself, an intentionally empty
// canvas labelled "Soon").
//
// People and About stay as route links for now even though those routes
// don't exist yet either — a known gap, not part of this pass's scope.
const NAV_ITEMS: { label: string; href: string }[] = [
  { label: "Research", href: "#research" },
  { label: "Roadmap", href: "#roadmap" },
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
      className="hidden md:block"
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
          // Hash-only hrefs are a same-page scroll target (Research ->
          // #research, Roadmap -> #roadmap), not a route — a plain
          // <a>, matching HeroCtas.tsx's own "Explore Research" control,
          // which does the same thing for the same kind of destination.
          const isHashLink = item.href.startsWith("#");
          const current = !isHashLink && pathname === item.href;
          const sharedProps = {
            "data-href": item.href,
            onMouseEnter: () => {
              setHovered(item.href);
              updateIndicator(item.href);
            },
            className: `relative z-10 inline-flex items-center justify-center rounded-full px-4 py-1.5 font-body text-sm font-medium transition-colors duration-200 ${
              active === item.href ? "text-ink-000" : "text-ink-300 hover:text-ink-100"
            }`,
          };
          return (
            <li key={item.href} className="relative">
              {isHashLink ? (
                <a href={item.href} {...sharedProps}>
                  {item.label}
                </a>
              ) : (
                <Link href={item.href} aria-current={current ? "page" : undefined} {...sharedProps}>
                  {item.label}
                </Link>
              )}
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
      {/* Desktop: one fixed 3-column grid bar (logo / nav / logo) instead
          of three separately `fixed` elements each guessing at a `top`
          offset — `items-center` gives the lab mark, nav pill and ITS
          mark a genuine shared centreline no matter how tall the pill's
          own padding makes it, which three independent fixed offsets
          could only ever approximate. */}
      <div className="fixed inset-x-0 top-0 z-50 hidden h-20 items-center px-6 md:grid md:grid-cols-[1fr_auto_1fr]">
        {/* Small brand mark, independent of the centred nav pill — the
            reference has no logo (personal-name site), but this project
            still needs one visible; a separate mark beside a centred
            pill is a common enough pairing that it doesn't fight the
            minimal language. */}
        <Link
          href="/"
          aria-label="Spatial Analysis & Transportation Laboratory, home"
          className="justify-self-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink-000"
        >
          <Image src={logo} alt="" priority height={32} className="h-8 w-auto" />
        </Link>

        <DesktopNav />

        {/* ITS institutional mark, the header's own top-right corner
            (2026-09-19: briefly tried scoping this to the hero's content
            flow instead, so it would scroll away; the site owner's
            actual ask was the header's corner, not the hero's —
            corrected here). Same size as the lab mark, same recolour
            method (source SVG uses one fill colour, #187DC2, swapped for
            white losslessly). */}
        <img
          src="/brand/its-logo-white.svg"
          alt="Institut Teknologi Sepuluh Nopember"
          className="h-8 w-auto justify-self-end opacity-90"
        />
      </div>

      {/* Mobile: unchanged in-flow bar (the floating pill's fixed-width
          items were never going to fit four labels plus a logo at
          375px), restyled with the same soft border language as the
          desktop pill instead of a solid ink-600 line. */}
      <div className="border-b border-white/8 bg-ink-900 md:hidden">
        <Container>
          <div className="flex h-16 items-center justify-between">
            {/* ITS mark is desktop-only (above) — mobile already sits
                right at its gutter limit with just this one mark plus
                the hamburger (a second logo was exactly the kind of
                "technically fits, no margin left" bug found and fixed
                earlier in this header). */}
            <Link
              href="/"
              onClick={() => setOpen(false)}
              aria-label="Spatial Analysis & Transportation Laboratory, home"
              className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink-000"
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
                {NAV_ITEMS.map((item) =>
                  item.href.startsWith("#") ? (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="py-3 font-body text-base text-ink-100"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="py-3 font-body text-base text-ink-100"
                    >
                      {item.label}
                    </Link>
                  ),
                )}
              </div>
            </Container>
          </nav>
        )}
      </div>
    </header>
  );
}
