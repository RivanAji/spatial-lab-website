import type { Metadata } from "next";
import { Space_Grotesk, Public_Sans, IBM_Plex_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

// Self-hosted via next/font (PRD 6.3) — no render-blocking Google Fonts
// <link> ships to the browser; the files are downloaded at build time and
// served from this origin.
// Variable names are deliberately not --font-display/--font-body/--font-mono:
// those names belong to the Tailwind utilities defined in globals.css's
// @theme block, which reference these vars by name. Reusing the same name
// here would make next/font's injected class and Tailwind's :root rule race
// on specificity for the same custom property, silently breaking under
// static export in a way that isn't obvious in dev.
const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--display-font",
  display: "swap",
});

const body = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--body-font",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--mono-font",
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
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="flex min-h-[100dvh] flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
