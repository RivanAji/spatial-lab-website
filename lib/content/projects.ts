import type { Project } from "./types";

// Names only for now, per the site owner's own words (2026-09-20):
// "listnya meliputi... gambarnya kosongan dulu aja" — the six real
// project names, everything else (description, cover image, link)
// still to come. No invented copy standing in for content that
// doesn't exist yet (PRD 6.6), same discipline lib/content/publications.
// ts already follows for a coverImage-less entry.
export const projects: Project[] = [
  { slug: "landusesim", name: "LanduseSim" },
  { slug: "raneus", name: "Raneus" },
  { slug: "urbanscad", name: "UrbanScad" },
  { slug: "gravigis", name: "GraviGIS" },
  { slug: "urbanrvm", name: "UrbanRVM" },
  { slug: "urbangvi", name: "UrbanGVI" },
];
