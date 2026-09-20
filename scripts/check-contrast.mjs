#!/usr/bin/env node
// Automated WCAG contrast gate for the token pairs actually used in the UI
// (PRD section 6.2). Run this whenever a token value changes — the numbers
// in PRD.md's contrast table were computed by an earlier one-off version of
// this exact logic, this script is that logic made reusable so the claim
// stays checkable instead of becoming stale prose.

const tokens = {
  "ink-900": "#08090B",
  "ink-800": "#0D0F14",
  "ink-700": "#141821",
  "ink-600": "#1E2430",
  "ink-500": "#2A313B",
  "ink-300": "#8A929C",
  "ink-100": "#E8EBEF",
  "ink-000": "#F7F9FB",
  "blue-900": "#141C35",
  "blue-800": "#273669",
  "blue-600": "#445EA5",
  "blue-400": "#5B78BE",
  "blue-300": "#7E97DC",
};

function luminance(hex) {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i + 1, i + 3), 16) / 255);
  const f = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function ratio(a, b) {
  const [l1, l2] = [luminance(tokens[a]), luminance(tokens[b])].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

// [foreground, background, minimum ratio, where it's used]
//
// Monochrome pivot (2026-09-19): every blue-* pair below was retired —
// nothing in the UI rendered those tokens for a while (app/globals.css
// kept the values defined for reference, not active use). Emphasis that
// used to be blue-400/blue-300 became ink-000 on the same grounds
// already checked above.
//
// Un-retired 2026-09-20 for the new team detail page (app/research/
// [team]/page.tsx) — the one place on the site with a deliberate colour
// accent again (site owner: "boleh ditambahi warna biru untuk filter
// baris di sebelah kiri, biru ITS yang cocok/match untuk warna hitam
// backgroundnya"), reusing these same exact ITS-brand values rather
// than inventing new ones (styleguide/page.tsx already documented
// blue-800/blue-600 as "exact" brand navy/royal).
//
// Rebuilt same day, second pass (TeamTimeline.tsx): the rotated WORK/
// PAPERS row label is blue-300 text in a bg-blue-900/30 rail — checked
// against solid ink-900 below, which is a safe floor since blue-900/30
// over ink-900 is strictly lighter than ink-900 alone (blue-900 is a
// lighter value), so the real contrast only exceeds this number.
const checks = [
  ["ink-100", "ink-900", 4.5, "body text on page ground"],
  ["ink-300", "ink-900", 4.5, "muted text on page ground"],
  ["ink-000", "ink-900", 4.5, "display text on page ground, and the site's one emphasis colour"],
  ["ink-100", "ink-700", 4.5, "body text on card surface"],
  ["ink-300", "ink-700", 4.5, "muted text on card surface"],
  ["ink-900", "ink-000", 4.5, "primary CTA text (Contact button, Button.tsx primary) on white fill"],
  ["blue-300", "ink-900", 4.5, "team page WORK/PAPERS rail label (TeamTimeline.tsx, floor for bg-blue-900/30)"],
];

let failed = false;
console.log("Contrast check against PRD 6.2 token pairs\n");
for (const [fg, bg, min, note] of checks) {
  const r = ratio(fg, bg);
  const pass = r >= min;
  if (!pass) failed = true;
  const label = `${fg} on ${bg}`.padEnd(22);
  console.log(
    `${pass ? "PASS" : "FAIL"}  ${label} ${r.toFixed(2)}:1  (min ${min}:1)  — ${note}`,
  );
}

if (failed) {
  console.error("\nOne or more token pairs fail their required contrast ratio.");
  process.exit(1);
}
console.log("\nAll checked pairs pass.");
