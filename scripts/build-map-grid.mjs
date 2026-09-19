#!/usr/bin/env node
// Build-time step for the hero (PRD 7.2 / 21.2):
//
//   GeoJSON Asia -> simplified geometry -> rasterise to a brightness grid
//
// This reads the full world country outlines once, at build time, and
// writes a small typed data module with just a class per grid cell
// (0 empty / 1 Asia / 2 Indonesia) plus the Surabaya locator's cell.
// The browser never sees the ~250KB GeoJSON — only that tiny grid — which
// is what keeps the hero's shipped JS inside the 60KB budget in PRD 8.4.
//
// Run manually with `npm run build:map` whenever the crop or resolution
// changes. The output is committed, not regenerated on every `next build`,
// because it depends on a static data file, not on any content editors
// touch through the CMS.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// Crop chosen for composition, not geographic completeness: tightened to
// mainland Southeast Asia through the Philippines and all of Indonesia,
// dropping China/Mongolia/Japan/the Koreas that the old wide crop kept
// for context — a square frame doesn't have room for both that northern
// reach and enough room for Indonesia's archipelago to read clearly, and
// Indonesia is the actual focal point (PRD 3.1 / brief 3.2).
const LON_MIN = 92;
const LON_MAX = 141;
const LAT_MIN = -11;
const LAT_MAX = 21;

// Grid aspect (revised again 2026-09-19, third time on this same map —
// site owner: "proyeksinya kok menciut ga normal"): the "square grid"
// revision this used to carry forced a 1:1 cell grid (64x64, then
// 96x96) onto the crop above, which is NOT 1:1 in degrees (49deg of
// longitude by 32deg of latitude, a 1.53:1 ratio) — every cell was
// silently representing 0.51deg of longitude but only 0.33deg of
// latitude, then drawn as an equal-sided square pixel. That mismatch,
// not any curvature/CRS effect (checked: cos(latitude) across this
// crop's -11 to 21deg band is 0.93-1.0, under 7% either way, negligible
// at this scale), is what squashed real shapes — confirmed by the
// distortion disappearing once the grid's own column:row ratio was
// derived from the crop's actual longitude:latitude ratio instead of
// being forced square.
//
// Fixed by decoupling the GRID's aspect from the CONTAINER's: the
// container stays a square card (matching the reference site,
// https://rbp-portfolio.vercel.app), but the grid itself is computed
// here from the crop bounds above, not hand-typed and left to drift out
// of sync with them again — an equirectangular projection with square
// degree-cells, letterboxed inside the square container by the fit-
// and-centre logic HeroCanvas.tsx already had, written for exactly this
// shape of grid before the square-grid revision temporarily broke it.
// No crop content is lost restoring this (unlike narrowing LON_MAX,
// which would have cropped Papua, part of Indonesia, out of frame) —
// the tradeoff is a visible empty margin above and below the map inside
// its square card, the honest cost of drawing the real shapes without
// distorting them.
const GRID_COLS = 96;
const GRID_ROWS = Math.round((GRID_COLS * (LAT_MAX - LAT_MIN)) / (LON_MAX - LON_MIN));

// Surabaya: the lab's real campus coordinates (site owner, 2026-09-19,
// checked against Google Maps), not the brief's rounded 07°15'S /
// 112°45'E — that rounding was coarse enough at this grid's resolution
// to read as a different city (see the raw-cell fix below).
const SURABAYA = { lon: 112.79412514560501, lat: -7.27955381587467 };

const ASIA_COUNTRIES = new Set([
  "Afghanistan",
  "Bangladesh",
  "Bhutan",
  "Brunei",
  "Cambodia",
  "China",
  "East Timor",
  "India",
  "Japan",
  "Kazakhstan",
  "Kyrgyzstan",
  "Laos",
  "Malaysia",
  "Mongolia",
  "Myanmar",
  "Nepal",
  "North Korea",
  "Pakistan",
  "Papua New Guinea",
  "Philippines",
  "South Korea",
  "Sri Lanka",
  "Taiwan",
  "Tajikistan",
  "Thailand",
  "Turkmenistan",
  "Uzbekistan",
  "Vietnam",
]);

function pointInRing([x, y], ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersects =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

function pointInPolygonCoords(pt, rings) {
  if (!pointInRing(pt, rings[0])) return false;
  for (let i = 1; i < rings.length; i++) {
    if (pointInRing(pt, rings[i])) return false; // inside a hole
  }
  return true;
}

function pointInGeometry(pt, geometry) {
  if (geometry.type === "Polygon") {
    return pointInPolygonCoords(pt, geometry.coordinates);
  }
  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates.some((poly) => pointInPolygonCoords(pt, poly));
  }
  return false;
}

const raw = JSON.parse(
  readFileSync(path.join(root, "data/geo/countries.geo.json"), "utf8"),
);

const indonesiaFeature = raw.features.find((f) => f.properties.name === "Indonesia");
const asiaFeatures = raw.features.filter((f) => ASIA_COUNTRIES.has(f.properties.name));

if (!indonesiaFeature) throw new Error("Indonesia feature not found in source GeoJSON");
if (asiaFeatures.length !== ASIA_COUNTRIES.size) {
  const found = new Set(asiaFeatures.map((f) => f.properties.name));
  const missing = [...ASIA_COUNTRIES].filter((n) => !found.has(n));
  throw new Error(`Missing expected countries in source GeoJSON: ${missing.join(", ")}`);
}

// class per cell: 0 empty, 1 asia, 2 indonesia
const cells = new Array(GRID_COLS * GRID_ROWS).fill(0);

for (let row = 0; row < GRID_ROWS; row++) {
  // Sample at cell centres, and flip row 0 to the top (max latitude).
  const lat = LAT_MAX - ((row + 0.5) / GRID_ROWS) * (LAT_MAX - LAT_MIN);
  for (let col = 0; col < GRID_COLS; col++) {
    const lon = LON_MIN + ((col + 0.5) / GRID_COLS) * (LON_MAX - LON_MIN);
    const pt = [lon, lat];

    let cls = 0;
    if (pointInGeometry(pt, indonesiaFeature.geometry)) {
      cls = 2;
    } else if (asiaFeatures.some((f) => pointInGeometry(pt, f.geometry))) {
      cls = 1;
    }
    cells[row * GRID_COLS + col] = cls;
  }
}

// Cells are classified at their CENTRE (the `+0.5` in the main loop
// above: lon(col) = LON_MIN + (col+0.5)/GRID_COLS * span), so finding
// the cell that CONTAINS a point needs the inverse of that same
// formula — col = (lon-LON_MIN)/span*GRID_COLS - 0.5 — not a bare
// `round(frac * GRID_COLS)` with no offset. The bare version (what
// this used to do) is systematically half a cell short of that
// inverse, which reads as nothing at this grid's resolution (each
// cell spans ~0.51 deg) until it silently pushes the rounded result
// one whole cell over — here, one cell south-east, which is exactly
// what put the locator nearer Banyuwangi than the lab's real campus
// (site owner caught it by eye, checking against Google Maps).
const rawSurabayaCol = Math.round(
  ((SURABAYA.lon - LON_MIN) / (LON_MAX - LON_MIN)) * GRID_COLS - 0.5,
);
const rawSurabayaRow = Math.round(
  ((LAT_MAX - SURABAYA.lat) / (LAT_MAX - LAT_MIN)) * GRID_ROWS - 0.5,
);

// At this resolution Java is only 1-2 rows thick, so the raw projected cell
// can land in an "empty" cell right beside the coastline (it does, here: a
// direct check confirmed cell class 0 at the raw projection). The locator
// must sit visibly on the highlighted landmass, so snap to the nearest
// class-2 (Indonesia) cell within a small radius rather than trusting the
// unadjusted projection.
function nearestIndonesiaCell(col, row) {
  if (cells[row * GRID_COLS + col] === 2) return { col, row };
  for (let radius = 1; radius <= 4; radius++) {
    for (let dr = -radius; dr <= radius; dr++) {
      for (let dc = -radius; dc <= radius; dc++) {
        if (Math.max(Math.abs(dr), Math.abs(dc)) !== radius) continue;
        const r = row + dr;
        const c = col + dc;
        if (r < 0 || r >= GRID_ROWS || c < 0 || c >= GRID_COLS) continue;
        if (cells[r * GRID_COLS + c] === 2) return { col: c, row: r };
      }
    }
  }
  throw new Error(
    `No Indonesia cell found within radius of raw projection (${col}, ${row}) — check the crop or the source geometry.`,
  );
}

const { col: surabayaCol, row: surabayaRow } = nearestIndonesiaCell(
  rawSurabayaCol,
  rawSurabayaRow,
);

// Derived from the same SURABAYA constant the cell above is derived
// from, not hand-typed — a hand-typed label is exactly what went stale
// the first time this used the brief's rounded 07°15'/112°45' instead
// of the real campus coordinates.
function toDMS(decimalDegrees, positiveSuffix, negativeSuffix) {
  const suffix = decimalDegrees < 0 ? negativeSuffix : positiveSuffix;
  const abs = Math.abs(decimalDegrees);
  const degrees = Math.floor(abs);
  const minutesFull = (abs - degrees) * 60;
  const minutes = Math.floor(minutesFull);
  const seconds = Math.round((minutesFull - minutes) * 60);
  return `${String(degrees).padStart(2, "0")}°${String(minutes).padStart(2, "0")}'${String(seconds).padStart(2, "0")}"${suffix}`;
}

const surabayaCoords = `${toDMS(SURABAYA.lat, "N", "S")} / ${toDMS(SURABAYA.lon, "E", "W")}`;

// Debug preview so this is checkable by reading terminal output, not just
// trusting the numbers — run `node scripts/build-map-grid.mjs` directly.
if (process.argv.includes("--preview") || true) {
  const chars = [" ", "·", "▓"];
  const lines = [];
  for (let row = 0; row < GRID_ROWS; row++) {
    let line = "";
    for (let col = 0; col < GRID_COLS; col++) {
      const isSurabaya = col === surabayaCol && row === surabayaRow;
      line += isSurabaya ? "@" : chars[cells[row * GRID_COLS + col]];
    }
    lines.push(line);
  }
  console.log(lines.join("\n"));
  console.log(`\nSurabaya cell: col ${surabayaCol}, row ${surabayaRow} of ${GRID_COLS}x${GRID_ROWS}`);
}

const output = `// Generated by scripts/build-map-grid.mjs — do not hand-edit.
// Regenerate with \`npm run build:map\` if the crop or resolution changes.

export const GRID_COLS = ${GRID_COLS};
export const GRID_ROWS = ${GRID_ROWS};

/** 0 = empty (ocean/background), 1 = Asia landmass, 2 = Indonesia. */
export const ASIA_GRID: Uint8Array = new Uint8Array([${cells.join(",")}]);

export const SURABAYA_CELL = { col: ${surabayaCol}, row: ${surabayaRow} };
export const SURABAYA_COORDS = ${JSON.stringify(surabayaCoords)};
`;

writeFileSync(path.join(root, "data/asia-grid.ts"), output);
console.log(`\nWrote data/asia-grid.ts (${cells.length} cells)`);
