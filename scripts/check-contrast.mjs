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
// Monochrome pivot (2026-09-19): every blue-* pair below is retired —
// nothing in the UI renders those tokens any more (app/globals.css keeps
// the values defined for reference, not active use). Emphasis that used
// to be blue-400/blue-300 is now ink-000 on the same grounds already
// checked above, so no new pairs were needed for that change. The two
// new pairs are the monochrome CTA fills (white background, dark text —
// the inverse of the ink-000-on-ink-900 pair above, same ratio either
// direction since contrast is symmetric, checked explicitly anyway so
// the claim stays a checked one and not an assumption).
const checks = [
  ["ink-100", "ink-900", 4.5, "body text on page ground"],
  ["ink-300", "ink-900", 4.5, "muted text on page ground"],
  ["ink-000", "ink-900", 4.5, "display text on page ground, and the site's one emphasis colour"],
  ["ink-100", "ink-700", 4.5, "body text on card surface"],
  ["ink-300", "ink-700", 4.5, "muted text on card surface"],
  ["ink-900", "ink-000", 4.5, "primary CTA text (Contact button, Button.tsx primary) on white fill"],
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
