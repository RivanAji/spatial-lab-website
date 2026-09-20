import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import "./globals.css";

// Typography matches the reference repo exactly (2026-09-19 request):
// https://github.com/DavidHDev/rbp-portfolio's README states its system
// plainly — "Sans: Geist Sans, Mono: Geist Mono, Serif: Fraunces (used
// selectively for display headlines)". Confirmed against the repo's own
// components too: hero.tsx's <h1> carries no font-serif class (Geist
// Sans, same as body), while projects.tsx's section heading does
// ("My projects" is the one place font-serif appears) — Fraunces is a
// deliberate, rare accent there, not the default display face. Fraunces
// is normally on this project's own banned-by-default list (it's one of
// the two most common AI-default display serifs) — that default applies
// to an unprompted reach for "creative = serif"; this is the opposite,
// a named font from a specific, cited, real source the site owner
// pointed to directly, used the same restrained way that source uses it.
//
// Self-hosted via next/font (PRD 6.3) — no render-blocking Google Fonts
// <link> ships to the browser; the files are downloaded at build time and
// served from this origin.
// Variable names are deliberately not --font-sans/--font-mono/--font-serif:
// those names belong to the Tailwind utilities defined in globals.css's
// @theme block, which reference these vars by name. Reusing the same name
// here would make next/font's injected class and Tailwind's :root rule race
// on specificity for the same custom property, silently breaking under
// static export in a way that isn't obvious in dev.
const sans = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--sans-font",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--mono-font",
  display: "swap",
});

const serif = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--serif-font",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Spatial Analysis & Transportation Laboratory",
    template: "%s - Spatial Analysis & Transportation Laboratory",
  },
  description:
    "Research laboratory in the Department of Urban and Regional Planning, Institut Teknologi Sepuluh Nopember (ITS), Surabaya. Spatial analysis, transportation, and decision support research.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${serif.variable}`}>
      <body className="flex min-h-[100dvh] flex-col">
        {/* Header/Footer moved to app/(site)/layout.tsx (2026-09-20) —
            see that file's own comment for why. */}
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
