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

// Square grid (2026-09-19 revision): the hero's visual moved from a wide
// landscape composition into a square card (matching the reference site
// this redesign is based on, https://rbp-portfolio.vercel.app, whose own
// hero visual is a square-cropped canvas). A wide 108x46 grid inside a
// square card would letterbox into a thin horizontal band with empty
// space top and bottom, so both the resolution and the crop change here,
// not just the CSS container.
const GRID_COLS = 64;
const GRID_ROWS = 64;

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

// Surabaya, per the brief (spatial lab_brief.md section 3.2): 07°15'S / 112°45'E.
const SURABAYA = { lon: 112.75, lat: -7.25 };

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

const rawSurabayaCol = Math.round(
  ((SURABAYA.lon - LON_MIN) / (LON_MAX - LON_MIN)) * GRID_COLS,
);
const rawSurabayaRow = Math.round(
  ((LAT_MAX - SURABAYA.lat) / (LAT_MAX - LAT_MIN)) * GRID_ROWS,
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
export const SURABAYA_COORDS = "07°15'S / 112°45'E";
`;

writeFileSync(path.join(root, "data/asia-grid.ts"), output);
console.log(`\nWrote data/asia-grid.ts (${cells.length} cells)`);
