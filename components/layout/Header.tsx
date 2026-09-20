"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { assetPath } from "@/lib/asset-path";
import { List, X } from "@phosphor-icons/react";
import { Container } from "@/components/ui/Container";
import logo from "@/public/brand/logo-white.png";

// A fixed three-column grid keeps both logos and the nav pill on one visual centerline.
const NAV_ITEMS: { label: string; href: string }[] = [
  { label: "Research", href: "#research" },
  { label: "Project", href: "#project" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "Team", href: "#team" },
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
    // Measure both elements against the same <ul>; offsetLeft uses each <li>'s positioned ancestor.
    const listRect = listRef.current.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setIndicator({ left: elRect.left - listRect.left, width: elRect.width });
  }

  // Re-measure after fonts/layout settle so the active indicator is visible before the first hover.
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
      <div className="fixed inset-x-0 top-0 z-50 hidden h-20 items-center px-6 md:grid md:grid-cols-[1fr_auto_1fr]">
        <Link
          href="/"
          aria-label="Spatial Analysis & Transportation Laboratory, home"
          className="justify-self-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink-000"
        >
          <Image src={logo} alt="" priority height={32} className="h-8 w-auto" />
        </Link>

        <DesktopNav />

        <img
          src={assetPath("/brand/its-logo-white.svg")}
          alt="Institut Teknologi Sepuluh Nopember"
          className="h-8 w-auto justify-self-end opacity-90"
        />
      </div>

      <div className="border-b border-white/8 bg-ink-900 md:hidden">
        <Container>
          <div className="flex h-16 items-center justify-between">
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
