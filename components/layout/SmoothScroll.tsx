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
//
// The extra click listener below works around a gap in Lenis's own
// `anchors` handling (read directly from its source, node_modules/lenis/
// dist/lenis.mjs's onClick): it calls scrollTo() but never calls
// event.preventDefault(), so the browser's own native instant hash-jump
// still fires from the same click. Lenis's onNativeScroll handler treats
// any native scroll event as "the user scrolled" and resyncs its internal
// state to match it whenever it isn't already mid-animation — so a native
// jump landing before Lenis's own animation has visibly started risks
// cancelling that animation before it's seen. Pre-empting the browser's
// default action here (capture phase, so it runs before Lenis's own
// bubble-phase listener) removes that competing native jump entirely;
// Lenis's own listener still runs afterwards and drives the scroll alone.
// A plain preventDefault() also throws away the browser's own default
// behaviour of updating the URL's hash, which anyone bookmarking or
// sharing a section link (or using back/forward) still needs — so this
// pushes that same hash onto history manually, the one piece of the
// default action actually worth keeping.
import { ReactLenis } from "lenis/react";
import { useEffect, type ReactNode } from "react";

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    function onClickCapture(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      const anchor = (e.target as Element).closest?.("a[href]");
      if (!anchor) return;
      const url = new URL((anchor as HTMLAnchorElement).href, window.location.href);
      const here = window.location;
      if (url.host === here.host && url.pathname === here.pathname && url.hash) {
        e.preventDefault();
        history.pushState(null, "", url.hash);
      }
    }
    document.addEventListener("click", onClickCapture, true);
    return () => document.removeEventListener("click", onClickCapture, true);
  }, []);

  return (
    <ReactLenis root options={{ anchors: true, respectReducedMotion: true }}>
      {children}
    </ReactLenis>
  );
}
