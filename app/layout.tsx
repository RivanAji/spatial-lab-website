import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import "./globals.css";

// Typography follows the reference: Geist Sans/Mono with Fraunces as a selective display accent.
// Keep these custom-property names distinct from Tailwind's --font-* variables.
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
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
