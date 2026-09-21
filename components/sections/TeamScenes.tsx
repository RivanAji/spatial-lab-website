"use client";

import { motion, type Transition } from "motion/react";

// Isometric scenes for the three research-team cards. Each one depicts
// what that team actually does — a city block, a stack of spatial data,
// a modelled terrain under water — rather than generic tech iconography.
//
// All three share one projection and one shading rule, so they read as a
// set. In a strictly monochrome palette the only thing that can express
// volume is tonal separation between faces, so every solid is drawn as
// three faces at fixed, distinct opacities: a near-white top, a mid left
// and a dark right. That is what makes these read as objects with mass
// instead of outlines.

// 30° isometric axes, written as literals rather than Math.cos/Math.sin
// calls: transcendental results can differ in the last bit between Node
// and the browser, and an SVG coordinate that differs is a hydration
// mismatch. Projected values are rounded for the same reason.
const KX = 0.866;
const KY = 0.5;

function round(n: number): number {
  return Math.round(n * 1000) / 1000;
}

/** Grid space (x, y, height) to screen space. +x goes right-down, +y left-down, +z up. */
function iso(x: number, y: number, z = 0): [number, number] {
  return [round((x - y) * KX), round((x + y) * KY - z)];
}

function poly(points: [number, number][]): string {
  return points.map(([px, py]) => `${px},${py}`).join(" ");
}

type Solid = { x: number; y: number; w: number; d: number; z0?: number; z1: number };

/** The three faces of a box that an isometric viewer can actually see. */
function faces({ x, y, w, d, z0 = 0, z1 }: Solid) {
  return {
    top: poly([iso(x, y, z1), iso(x + w, y, z1), iso(x + w, y + d, z1), iso(x, y + d, z1)]),
    right: poly([
      iso(x + w, y, z1),
      iso(x + w, y + d, z1),
      iso(x + w, y + d, z0),
      iso(x + w, y, z0),
    ]),
    left: poly([
      iso(x, y + d, z1),
      iso(x + w, y + d, z1),
      iso(x + w, y + d, z0),
      iso(x, y + d, z0),
    ]),
  };
}

/** A flat diamond on the ground plane, for plates, water and ripples. */
function plate(x: number, y: number, w: number, d: number, z = 0): string {
  return poly([iso(x, y, z), iso(x + w, y, z), iso(x + w, y + d, z), iso(x, y + d, z)]);
}

const FACE_TOP = 0.92;
const FACE_LEFT = 0.3;
const FACE_RIGHT = 0.13;

function Box({ solid, tone = 1 }: { solid: Solid; tone?: number }) {
  const f = faces(solid);
  return (
    <>
      <polygon points={f.right} fill="currentColor" opacity={FACE_RIGHT * tone} />
      <polygon points={f.left} fill="currentColor" opacity={FACE_LEFT * tone} />
      <polygon points={f.top} fill="currentColor" opacity={FACE_TOP * tone} />
      <polygon
        points={f.top}
        fill="none"
        stroke="var(--color-ink-900)"
        strokeWidth="0.4"
        opacity="0.45"
      />
    </>
  );
}

export type SceneProps = {
  /** Assembled (hover / in view) rather than collapsed. */
  shown: boolean;
  /** False under prefers-reduced-motion: snap to the assembled state, run no loops. */
  animated: boolean;
};

// Each scene gets a view box fitted to its own content so all three fill
// their card equally, rather than one shared box that leaves the shorter
// scenes floating in dead space.
const VIEW_CITY = "-27 -7 54 39";
const VIEW_DATA = "-22 -23 44 48";
const VIEW_CLIMATE = "-20 -9 40 33";

function rise(animated: boolean, delay: number): Transition {
  return animated
    ? { type: "spring", stiffness: 190, damping: 18, delay }
    : { duration: 0 };
}

function fade(animated: boolean, delay: number, duration = 0.35): Transition {
  return animated ? { duration, delay, ease: [0.22, 1, 0.36, 1] } : { duration: 0 };
}

/* — 01 Sustainable Urban Transportation ——————————————————————————————
   An urban block seen from above: buildings standing on a street grid,
   with the transit line running through it and a vehicle on the line.
   The blocks rise back-to-front, which is also their draw order, so the
   depth sorting and the choreography agree.                           */

const CITY: Solid[] = [
  { x: 2, y: 2, w: 9, d: 8, z1: 10 },
  { x: 19, y: 2, w: 9, d: 7, z1: 15 },
  { x: 2, y: 19, w: 8, d: 9, z1: 6 },
  { x: 19, y: 19, w: 9, d: 8, z1: 9 },
];

const STREET_Z = 0.25;
const TRANSIT = `M${iso(0, 15, STREET_Z).join(" ")} L${iso(30, 15, STREET_Z).join(" ")}`;
const CROSS_STREET = `M${iso(15, 0, STREET_Z).join(" ")} L${iso(15, 30, STREET_Z).join(" ")}`;
const STOP = iso(15, 15, STREET_Z);
const RIPPLE = poly([iso(18, 15), iso(15, 18), iso(12, 15), iso(15, 12)]);

function CityScene({ shown, animated }: SceneProps) {
  return (
    <svg viewBox={VIEW_CITY} fill="none" className="h-full w-full">
      <motion.g
        initial={false}
        animate={{ opacity: shown ? 1 : 0 }}
        transition={fade(animated, 0)}
      >
        <polygon points={plate(0, 0, 30, 30)} fill="currentColor" opacity="0.05" />
        <polygon
          points={plate(0, 0, 30, 30)}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.4"
          opacity="0.3"
        />
        <polygon points={plate(0, 13, 30, 4, 0.1)} fill="currentColor" opacity="0.1" />
        <polygon points={plate(13, 0, 4, 30, 0.1)} fill="currentColor" opacity="0.1" />
      </motion.g>

      {CITY.map((solid, i) => (
        <motion.g
          key={i}
          initial={false}
          animate={{ scaleY: shown ? 1 : 0, opacity: shown ? 1 : 0 }}
          transition={rise(animated, 0.06 + i * 0.07)}
          style={{
            transformBox: "fill-box",
            transformOrigin: "50% 100%",
          }}
        >
          <Box solid={solid} />
        </motion.g>
      ))}

      <motion.path
        d={CROSS_STREET}
        stroke="currentColor"
        strokeWidth="0.5"
        strokeDasharray="2 2"
        opacity="0.45"
        initial={false}
        animate={{ pathLength: shown ? 1 : 0 }}
        transition={fade(animated, 0.25, 0.5)}
      />
      <motion.path
        d={TRANSIT}
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.85"
        initial={false}
        animate={{ pathLength: shown ? 1 : 0 }}
        transition={fade(animated, 0.3, 0.55)}
      />

      <motion.polygon
        points={RIPPLE}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
        initial={false}
        animate={
          shown && animated
            ? { scale: [0.35, 1.6], opacity: [0.55, 0] }
            : { scale: 0.35, opacity: 0 }
        }
        transition={
          shown && animated
            ? { duration: 2.6, repeat: Infinity, ease: "easeOut", delay: 0.8 }
            : { duration: 0 }
        }
        style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
      />
      <motion.circle
        cx={STOP[0]}
        cy={STOP[1]}
        r="1.5"
        fill="currentColor"
        initial={false}
        animate={{ scale: shown ? 1 : 0 }}
        transition={rise(animated, 0.5)}
        style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
      />

      <motion.g
        initial={false}
        animate={{
          offsetDistance: shown && animated ? ["0%", "100%"] : "42%",
          opacity: shown ? 1 : 0,
        }}
        transition={{
          offsetDistance:
            shown && animated
              ? { duration: 4.2, repeat: Infinity, ease: "linear", delay: 0.6 }
              : { duration: 0 },
          opacity: fade(animated, 0.55),
        }}
        style={{ offsetPath: `path("${TRANSIT}")`, offsetRotate: "0deg" }}
      >
        <g transform="translate(-2.6 -1.4)">
          <Box solid={{ x: 0, y: 0, w: 5.5, d: 3, z1: 2.6 }} />
        </g>
      </motion.g>
    </svg>
  );
}

/* — 02 Spatial Data Science & AI ————————————————————————————————————
   The GIS layer stack, extruded into real slabs instead of drawn as flat
   parallelograms: points, raster, vector. Feature lines lift off the top
   surface into a small model above it, and activations fire along the
   edges to the output node — data going in, a decision coming out.    */

const SLAB_SPAN = 24;
const SLAB_LEVELS = [0, 7, 14];
const SLAB_THICKNESS = 1.4;
const NODE_Z = 22;
const OUT_Z = 27;
const HIDDEN_NODES: [number, number][] = [
  [5, 19],
  [12, 12],
  [19, 5],
];
const OUT_NODE = iso(12, 12, OUT_Z);

function DataScene({ shown, animated }: SceneProps) {
  const surface = SLAB_LEVELS[2] + SLAB_THICKNESS;

  return (
    <svg viewBox={VIEW_DATA} fill="none" className="h-full w-full">
      {SLAB_LEVELS.map((z, i) => (
        <motion.g
          key={z}
          initial={false}
          animate={{ y: shown ? 0 : 10 - i * 3, opacity: shown ? 1 : 0 }}
          transition={rise(animated, 0.05 + i * 0.09)}
        >
          <Box solid={{ x: 0, y: 0, w: SLAB_SPAN, d: SLAB_SPAN, z0: z, z1: z + SLAB_THICKNESS }} tone={0.55 + i * 0.15} />

          {i === 0 &&
            [4, 10, 16, 20].flatMap((gx) =>
              [4, 10, 16, 20].map((gy) => {
                const [cx, cy] = iso(gx, gy, z + SLAB_THICKNESS);
                return <circle key={`${gx}-${gy}`} cx={cx} cy={cy} r="0.6" fill="var(--color-ink-900)" opacity="0.65" />;
              }),
            )}

          {i === 1 && (
            <g stroke="var(--color-ink-900)" strokeWidth="0.4" opacity="0.5">
              {[6, 12, 18].map((gx) => (
                <line key={`x${gx}`} x1={iso(gx, 0, z + SLAB_THICKNESS)[0]} y1={iso(gx, 0, z + SLAB_THICKNESS)[1]} x2={iso(gx, SLAB_SPAN, z + SLAB_THICKNESS)[0]} y2={iso(gx, SLAB_SPAN, z + SLAB_THICKNESS)[1]} />
              ))}
              {[6, 12, 18].map((gy) => (
                <line key={`y${gy}`} x1={iso(0, gy, z + SLAB_THICKNESS)[0]} y1={iso(0, gy, z + SLAB_THICKNESS)[1]} x2={iso(SLAB_SPAN, gy, z + SLAB_THICKNESS)[0]} y2={iso(SLAB_SPAN, gy, z + SLAB_THICKNESS)[1]} />
              ))}
            </g>
          )}

          {i === 2 && (
            <g stroke="var(--color-ink-900)" strokeWidth="0.5" fill="none" opacity="0.6">
              <polygon points={poly([iso(5, 6, z + SLAB_THICKNESS), iso(13, 4, z + SLAB_THICKNESS), iso(19, 10, z + SLAB_THICKNESS), iso(12, 15, z + SLAB_THICKNESS), iso(6, 12, z + SLAB_THICKNESS)])} />
              <polygon points={poly([iso(8, 8, z + SLAB_THICKNESS), iso(13, 7, z + SLAB_THICKNESS), iso(16, 10, z + SLAB_THICKNESS), iso(11, 12, z + SLAB_THICKNESS)])} />
            </g>
          )}
        </motion.g>
      ))}

      {HIDDEN_NODES.map(([gx, gy], i) => {
        const from = iso(gx, gy, surface);
        const to = iso(gx, gy, NODE_Z);
        return (
          <motion.line
            key={`feat-${i}`}
            x1={from[0]}
            y1={from[1]}
            x2={to[0]}
            y2={to[1]}
            stroke="currentColor"
            strokeWidth="0.45"
            strokeDasharray="1.6 1.4"
            opacity="0.45"
            initial={false}
            animate={{ pathLength: shown ? 1 : 0 }}
            transition={fade(animated, 0.35 + i * 0.05, 0.4)}
          />
        );
      })}

      {HIDDEN_NODES.map(([gx, gy], i) => {
        const node = iso(gx, gy, NODE_Z);
        const edge = `M${node.join(" ")} L${OUT_NODE.join(" ")}`;
        return (
          <g key={`edge-${i}`}>
            <motion.path
              d={edge}
              stroke="currentColor"
              strokeWidth="0.45"
              opacity="0.35"
              initial={false}
              animate={{ pathLength: shown ? 1 : 0 }}
              transition={fade(animated, 0.5 + i * 0.05, 0.35)}
            />
            <motion.circle
              r="0.9"
              fill="currentColor"
              initial={false}
              animate={{
                offsetDistance: shown && animated ? ["0%", "100%"] : "0%",
                opacity: shown && animated ? [0, 1, 1, 0] : 0,
              }}
              transition={
                shown && animated
                  ? {
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 0.5,
                      ease: "easeInOut",
                      delay: 0.9 + i * 0.22,
                    }
                  : { duration: 0 }
              }
              style={{ offsetPath: `path("${edge}")` }}
            />
          </g>
        );
      })}

      {HIDDEN_NODES.map(([gx, gy], i) => {
        const node = iso(gx, gy, NODE_Z);
        return (
          <motion.circle
            key={`node-${i}`}
            cx={node[0]}
            cy={node[1]}
            r="1.5"
            fill="currentColor"
            opacity="0.85"
            initial={false}
            animate={{ scale: shown ? 1 : 0 }}
            transition={rise(animated, 0.45 + i * 0.06)}
            style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
          />
        );
      })}

      <motion.circle
        cx={OUT_NODE[0]}
        cy={OUT_NODE[1]}
        r="2.4"
        fill="currentColor"
        initial={false}
        animate={{ scale: shown ? 1 : 0 }}
        transition={rise(animated, 0.62)}
        style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
      />
      <motion.circle
        cx={OUT_NODE[0]}
        cy={OUT_NODE[1]}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.55"
        initial={false}
        animate={shown && animated ? { r: [2.4, 6.5], opacity: [0.6, 0] } : { r: 2.4, opacity: 0 }}
        transition={
          shown && animated
            ? { duration: 1.9, repeat: Infinity, ease: "easeOut", delay: 1.1 }
            : { duration: 0 }
        }
      />
    </svg>
  );
}

/* — 03 Decision Support & Climate ————————————————————————————————————
   A modelled terrain: elevation as extruded columns, with a water plane
   cutting through it. Columns rise as a diagonal wave, the water settles
   after them, and the peaks that clear the surface are redrawn above it
   so the plane genuinely reads as a level, not an overlay.            */

// A single hill on a shallow shelf: the water level has something to cut
// against, which is the whole point of the picture. Four cells a side,
// not five — at card size a finer grid stops reading as a landform and
// starts reading as a checkerboard.
// Heights are exaggerated against the footprint on purpose. In an
// isometric view a unit of height and a unit of depth cancel each other
// out on screen, so a peak modelled at true scale lands at the same
// screen height as the flat back corner and the landform disappears.
// Vertical exaggeration is what terrain visualisation does about that.
const TERRAIN: number[][] = [
  [2.0, 3.4, 2.6, 1.8],
  [3.4, 11.0, 8.0, 2.8],
  [2.6, 9.0, 16.0, 4.2],
  [1.8, 2.8, 4.2, 2.0],
];
// Cells sit flush, not spaced: a gap between them reads as loose blocks,
// where a continuous stepped surface reads as elevation.
const FOOT = 5.5;
const TERRAIN_SPAN = 4 * FOOT;
const WATER_Z = 4.2;

const COLUMNS = TERRAIN.flatMap((row, i) =>
  row.map((h, j) => ({
    x: i * FOOT,
    y: j * FOOT,
    w: FOOT,
    d: FOOT,
    z1: h,
    depth: i + j,
  })),
).sort((a, b) => a.depth - b.depth);

function ClimateScene({ shown, animated }: SceneProps) {
  return (
    <svg viewBox={VIEW_CLIMATE} fill="none" className="h-full w-full">
      {/* Column, then that cell's patch of water, then the part of the
          column standing above it — interleaved per cell in depth order.
          Drawing the whole water plane in one pass instead would lay its
          surface across the face of every peak in front of it. */}
      {COLUMNS.map((col, i) => {
        const emerges = col.z1 > WATER_Z;
        return (
          <g key={i}>
            <motion.g
              initial={false}
              animate={{ scaleY: shown ? 1 : 0, opacity: shown ? 1 : 0 }}
              transition={rise(animated, 0.035 * col.depth)}
              style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
            >
              <Box solid={col} tone={emerges ? 1 : 0.42} />
            </motion.g>

            <motion.polygon
              points={plate(col.x, col.y, col.w, col.d, WATER_Z)}
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="0.3"
              initial={false}
              animate={
                shown && animated
                  ? { opacity: [0.14, 0.3, 0.14] }
                  : { opacity: shown ? 0.2 : 0 }
              }
              transition={
                shown && animated
                  ? {
                      duration: 3.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5 + col.depth * 0.12,
                    }
                  : { duration: 0 }
              }
            />

            {emerges && (
              <motion.g
                initial={false}
                animate={{ opacity: shown ? 1 : 0 }}
                transition={fade(animated, 0.2 + 0.035 * col.depth)}
              >
                <Box solid={{ ...col, z0: WATER_Z }} />
              </motion.g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export const TEAM_SCENES = [CityScene, DataScene, ClimateScene];
