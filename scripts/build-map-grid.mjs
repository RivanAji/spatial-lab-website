#!/usr/bin/env node
// Build-time GeoJSON-to-grid conversion for the hero; the browser receives the small typed grid, not the source GeoJSON.
// Regenerate with `npm run build:map` when the crop or resolution changes; the output is deterministic and committed.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// Crop the mainland Southeast Asia–Indonesia region so the square frame keeps Indonesia legible.
const LON_MIN = 92;
const LON_MAX = 141;
const LAT_MIN = -11;
const LAT_MAX = 21;

// Derive row count from the crop's longitude/latitude span so geographic shapes are not squashed.
// The square card may letterbox this non-square grid; preserving coordinates is preferable to distortion.
const GRID_COLS = 96;
const GRID_ROWS = Math.round((GRID_COLS * (LAT_MAX - LAT_MIN)) / (LON_MAX - LON_MIN));

// Use the lab campus coordinates rather than rounded brief values; the grid is coarse enough for rounding to shift cities.
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
  if (pointInRing(pt, rings[i])) return false; // Exclude interior rings.
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

// Cell classes: 0 empty, 1 Asia, 2 Indonesia.
const cells = new Array(GRID_COLS * GRID_ROWS).fill(0);

for (let row = 0; row < GRID_ROWS; row++) {
  // Sample cell centres and place row 0 at the maximum latitude.
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

// Invert the centre-sampling formula when mapping coordinates back to a cell; the -0.5 offset is required.
const rawSurabayaCol = Math.round(
  ((SURABAYA.lon - LON_MIN) / (LON_MAX - LON_MIN)) * GRID_COLS - 0.5,
);
const rawSurabayaRow = Math.round(
  ((LAT_MAX - SURABAYA.lat) / (LAT_MAX - LAT_MIN)) * GRID_ROWS - 0.5,
);

// Coarse resolution can place the raw coordinate beside a coastline; snap to the nearest Indonesia cell.
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

// Derive the display coordinates from the same campus constant used for the locator cell.
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

// Optional terminal preview makes the generated grid and locator easy to inspect.
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

const output = `// Generated by scripts/build-map-grid.mjs; do not hand-edit.
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
