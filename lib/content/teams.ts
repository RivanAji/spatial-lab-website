import type { Team } from "./types";

// Confirmed by the lab, 2026-09-19 (PRD section 3.2). Order is fixed at
// 01/02/03 — these are the lab's real team numbers, not decorative
// section numbering (PRD 6.6 / 29.5).
export const teams: Team[] = [
  {
    number: 1,
    slug: "sustainable-urban-transportation",
    name: "Sustainable Urban Transportation",
    displayName: "Sustainable Urban Transportation",
    tagline:
      "Policy, planning and modelling for transport, spatial and economic integration.",
    focus: [
      "Policy",
      "Transport, spatial and economic integration",
      "Transit-oriented development",
      "GEDSI",
    ],
    coordinatorSlug: "siti-nurlaela",
    memberSlugs: [
      "ketut-dewi-martha-erli-handayeni",
      "anoraga-jatayu",
      "caesario-arif-wibowo",
    ],
  },
  {
    number: 2,
    slug: "spatial-data-science-ai",
    name: "Spatial Data Science and AI for Urban Analytics",
    displayName: "Spatial Data Science & AI",
    tagline: "Machine learning, big data, and spatial data infrastructure.",
    // "Spatial Statistics" added 2026-09-20 (site owner, for the new
    // team detail page's centred description) — the other three items
    // were already here; this was the one gap.
    focus: ["Spatial Statistics", "Machine Learning", "Big Data", "Spatial Data Infrastructure"],
    coordinatorSlug: "nursakti-adhi-pratomoatmojo",
    memberSlugs: ["fendy-firmansyah", "rivan-aji-wahyu-dyan-syafitri", "anoraga-jatayu"],
  },
  {
    number: 3,
    slug: "decision-support-climate",
    name: "Decision Support and Climate Change",
    displayName: "Decision Support & Climate",
    tagline: "Climate resilience, scenario building, and policy evaluation.",
    focus: ["Climate resilience", "Scenario building", "Policy and decision evaluation"],
    coordinatorSlug: "cahyono-susetyo",
    memberSlugs: [
      "ummi-fadlilah-kurniawati",
      "siti-nurlaela",
      "ketut-dewi-martha-erli-handayeni",
      "fendy-firmansyah",
    ],
  },
];

export function getTeam(slug: string): Team | undefined {
  return teams.find((t) => t.slug === slug);
}
