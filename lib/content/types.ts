// Canonical content model used by the static build.

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
  // Unlike scholarId, this may point to any institutional research profile.
  profileUrl?: string;
  // Used by the publication checker; only store a verified ORCID iD.
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
  category?: "Software" | "Study";
  slug: string;
  name: string;
  description?: string;
  year?: number;
  developer?: string;
  coverImage?: string;
};

export type Publication = {
  category?: "Journal" | "Proceedings" | "Report" | "Book chapter";
  slug: string;
  title: string;
  authors: string;
  year: number;
  venue: string;
  team: TeamSlug;
  citations?: number;
  doi?: string;
  url?: string;
  coverImage?: string;
};
