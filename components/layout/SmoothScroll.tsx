"use client";

// Added 2026-09-20 (site owner's request): "scrollnya juga buat smooth
// seperti pakai Framer atau link referensi, jad hasilnya halus ketika di
// scroll". Checking the reference site itself (rbp-portfolio.vercel.app)
// confirmed it runs on the real Lenis library, not just CSS
// `scroll-behavior: smooth` (its <html> carries "lenis lenis-smooth"
// classes) — that's the actual source of its noticeably more fluid feel,
// so this uses the same library rather than a CSS-only approximation.
//
// `root` mode attaches Lenis directly to the window/document scroll
// instead of a wrapper div, so it doesn't add any extra DOM around the
// page. `anchors: true` makes every existing `href="#section"` link
// (Header.tsx, HeroCtas.tsx, Footer.tsx) animate through Lenis instead of
// a native jump — no changes needed to any of those links themselves.
//
// respectReducedMotion defaults to true in Lenis itself: under
// prefers-reduced-motion, smoothing is disabled and scrolling tracks the
// input 1:1, which matches this project's standing rule that every
// non-essential motion feature (the hero locator pulse, the illustration
// loops, the publications marquee) is gated the same way. Passed
// explicitly below anyway, so that guarantee is visible here rather than
// resting on an unstated library default.
import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ anchors: true, respectReducedMotion: true }}>
      {children}
    </ReactLenis>
  );
}
