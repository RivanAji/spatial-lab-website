"use client";

/*
 * Adapted from ThreeUI's AnimatedTopDock, "sable" variant
 * (@designcodeio/threeui, MIT). Source manifest:
 * https://threeui.com/source-code/animated-top-dock.json, revision
 * 5a736cd3c1f6f19802f61ebb10e1701b9f7aa26e.
 *
 * What's kept verbatim: topDockController.ts (the spring/proximity
 * physics engine, unmodified, verified against its declared sha256)
 * and every CSS value in animated-top-dock.css that this variant uses.
 *
 * What's necessarily different from the registered "Current configured
 * usage" example, and why: that example's ITEMS array is five hardcoded
 * demo labels (SYSTEM / METHOD / WORK / ACCESS / NOTES) with onClick
 * handlers that only set local React state — there's no href, nothing
 * to navigate to, because the component is a shader/interaction
 * showcase, not a drop-in site nav. It also renders its own placeholder
 * brand mark and a demo caption ("MOVE ACROSS THE DOCK · FOCUS WITH
 * TAB") describing the component to someone browsing the catalog. None
 * of that is real content for this site, so this component swaps in
 * this project's actual logo and actual nav links (Research / Roadmap
 * / People / About) as real Next.js <Link>s, drops the demo caption
 * (a decorative text strip is banned outright by this project's own
 * anti-slop rules, PRD 6.6 / brief 9.F), and marks the current page
 * with aria-current instead of the demo's local aria-pressed toggle
 * state. The controller doesn't care what's inside the [data-dock-item]
 * elements it measures and springs — real links plug in exactly like
 * the demo buttons did.
 */

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import logo from "@/public/brand/logo.png";
import { createTopDockController } from "./topDockController";
import "./animated-top-dock.css";

const NAV_ITEMS = [
  { label: "Research", href: "/research" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "People", href: "/people" },
  { label: "About", href: "/about" },
];

// Exact values from the site owner's configured usage: proximity=81,
// spring=0.07, damping=0.45, widthGrowth=6, heightGrowth=6, drop=0.5.
const DOCK_OPTIONS = {
  proximity: 81,
  spring: 0.07,
  damping: 0.45,
  widthGrowth: 6,
  heightGrowth: 6,
  drop: 0.5,
};

export function AnimatedTopDock() {
  const rootRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    // axis "x" / distribute false / lockTrack false matches the sable
    // branch's own call in the source (variant === "glass" is the only
    // one that uses axis "y"; distribute is retro-only; lockTrack is
    // modern-only).
    return createTopDockController(root, () => ({
      ...DOCK_OPTIONS,
      axis: "x",
      distribute: false,
      lockTrack: false,
    }));
  }, []);

  return (
    <nav
      ref={rootRef}
      aria-label="Primary"
      className="animated-top-dock__nav"
      data-dock-state="idle"
      data-dock-max="0.00"
    >
      <Link
        href="/"
        data-dock-item
        aria-label="Spatial Analysis & Transportation Laboratory, home"
        className="animated-top-dock__item animated-top-dock__logo"
      >
        <Image src={logo} alt="" width={20} height={22} />
      </Link>
      {NAV_ITEMS.map((item) => {
        const current = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            data-dock-item
            aria-current={current ? "page" : undefined}
            className="animated-top-dock__item animated-top-dock__link"
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
