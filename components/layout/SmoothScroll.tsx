"use client";

// Lenis handles root scrolling and respects reduced motion.
// Capture hash links because Lenis does not prevent the browser's competing jump; preserve the hash with pushState.
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
