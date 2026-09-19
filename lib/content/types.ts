// Content model per PRD section 5. These fixtures are the Phase 4
// hand-written stand-in for the CMS-backed content Phase 5 wires up — same
// shapes, so migrating to Decap CMS later doesn't require touching every
// component that reads this data.

export type TeamSlug =
  | "sustainable-urban-transportation"
  | "spatial-data-science-ai"
  | "decision-support-climate";

export type Person = {
  slug: string;
  name: string;
  role: string;
  photo?: string; // path under /public, omitted -> initials block (PRD 7.7)
  expertise: string[];
  teams: TeamSlug[];
  coordinatorOf?: TeamSlug;
  scholarId?: string;
};

export type Team = {
  number: 1 | 2 | 3;
  slug: TeamSlug;
  name: string; // full name, for the team page
  displayName: string; // short name, for the homepage panel (PRD 3.2.2)
  tagline: string;
  focus: string[];
  coordinatorSlug: string;
  memberSlugs: string[]; // excludes the coordinator
};

export type Publication = {
  slug: string;
  title: string;
  authors: string;
  year: number;
  venue: string;
  team: TeamSlug;
  citations?: number;
  doi?: string;
  // Added 2026-09-19 for the homepage publications slider (site owner's
  // direct request) — not part of the original PRD 5.3 schema, which
  // deliberately shipped publications text-only since no real cover
  // images existed yet (see ResearchArchive.tsx). Optional and honest:
  // a publication without one renders a plain, undecorated placeholder
  // slot rather than a stock photo standing in for a real cover. The
  // site owner will fill these in by hand once real cover images
  // (paper first pages, journal covers) are ready.
  coverImage?: string;
};
