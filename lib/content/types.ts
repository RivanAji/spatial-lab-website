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
  // Added 2026-09-20 for Team.tsx (site owner's direct request: "untuk
  // masing masing nama saya sertakan URL risetnya") — the site owner's
  // own links, mostly ITS's institutional research-profile pages
  // (scholar.its.ac.id), one a direct Google Scholar citations URL.
  // Deliberately its own field rather than folded into `scholarId`
  // above: that field is a bare Google Scholar user ID for building a
  // scholar.google.com URL, and most of these links aren't that.
  profileUrl?: string;
  // Added 2026-09-20 for scripts/check-new-publications.mjs: a member's
  // ORCID iD (16-digit, dash-separated) lets that script query ORCID's
  // public works API directly instead of falling back to a noisier
  // Crossref name search. Only set when confirmed from a real source
  // (e.g. seen on the member's own Scopus/ITS Scholar profile) — never
  // guessed, since a wrong ORCID iD would pull a stranger's publications.
  orcidId?: string;
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

export type Project = {
  slug: string;
  name: string;
  // No link field yet — the site owner's own words when this section
  // was added (2026-09-20): "kontennya menyusul". Adding fields here
  // (rather than adding a whole new type later) is what lets
  // Project.tsx render whatever's filled in without a reshape.
  description?: string;
  // Added the same day the 10-item project list arrived: two of those
  // projects genuinely have no known year yet, so this stays optional
  // rather than a placeholder value standing in for a real one (PRD
  // 6.6) — Project.tsx's year filter only lists years that exist.
  year?: number;
  // Added 2026-09-20 (site owner's request): "hilangkan nomor didepan
  // tahun pada menu project, cukup tahun dan juga nama pengembang" —
  // replaces the card's old plain index number with who actually built
  // it. A plain string, not slugs into lib/content/people.ts: several
  // projects list two or three names together (e.g. the MRT study), and
  // this only needs to render, not link anywhere yet.
  developer?: string;
  coverImage?: string; // same honest-empty-slot convention as
  // Publication.coverImage above — omitted renders a plain placeholder,
  // never a stock photo standing in for real project work.
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
