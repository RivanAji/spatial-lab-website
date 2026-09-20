// Weekly check for new team publications (2026-09-20, site owner's
// request: "bisakah website ini nanti otomatis menarik jurnal ketika ada
// publikasi baru atas nama nama tim tersebut?").
//
// This does NOT write to lib/content/publications.ts directly — deciding
// which team a new paper belongs to, what its slug should be, and
// whether Crossref's name-matching actually found the right person are
// all judgment calls this script can't reliably make on its own, and
// this project has followed a strict "no invented content, nothing
// unreviewed ships" rule from day one (PRD 6.6). Instead it writes
// candidates to lib/content/publications.pending.json, and the GitHub
// Actions workflow (.github/workflows/check-publications.yml) opens a
// PR with that file's diff for a human to review — turning a real new
// paper into a proper publications.ts entry stays a deliberate step,
// same as every other publication currently in that file.
//
// Two data sources, chosen per-person:
// - ORCID's public works API (no key, no rate-limit headache) when the
//   person has a confirmed `orcidId` (lib/content/types.ts) — precise,
//   since it's keyed to their actual ORCID record rather than a name
//   match.
// - Crossref's public works search (also no key) as a fallback for
//   everyone else, filtered by name + ITS affiliation. Name search is
//   inherently noisier than an ORCID lookup (common-name collisions,
//   affiliation strings publishers format inconsistently) — expect some
//   false positives here, which is exactly why this produces review
//   candidates, not finished entries.
//
// Run locally: node --experimental-strip-types scripts/check-new-publications.ts
// (needs Node 22.6+ for native TS stripping — see this repo's own nvm
// note in AGENTS.md's neighboring docs for why the Bash tool's frozen
// Node 18 can't run this directly; the GitHub Actions workflow pins
// Node 22 the same way deploy.yml does.)

import { readFile, writeFile } from "node:fs/promises";
import { people } from "../lib/content/people.ts";
import { publications } from "../lib/content/publications.ts";

const PENDING_PATH = new URL("../lib/content/publications.pending.json", import.meta.url);

type Candidate = {
  title: string;
  year: number | null;
  doi: string | null;
  link: string | null;
  source: "orcid" | "crossref";
  matchedPerson: string; // Person.slug
  foundAt: string; // ISO date this script first saw it
};

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

const knownTitles = new Set(publications.map((p) => normalizeTitle(p.title)));

async function loadPending(): Promise<Candidate[]> {
  try {
    const raw = await readFile(PENDING_PATH, "utf8");
    return JSON.parse(raw) as Candidate[];
  } catch {
    return [];
  }
}

async function fetchOrcidWorks(orcidId: string): Promise<Candidate[]> {
  const res = await fetch(`https://pub.orcid.org/v3.0/${orcidId}/works`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`ORCID ${orcidId}: HTTP ${res.status}`);
  const data = await res.json();
  const out: Candidate[] = [];
  for (const group of data.group ?? []) {
    const summary = group["work-summary"]?.[0];
    if (!summary) continue;
    // .trim(): real ORCID records in this project's own data came back
    // with a stray leading space on both a title and a DOI (the DOI one
    // silently produced a broken link, "https://doi.org/ 10.1016/...",
    // since a URL's own whitespace doesn't get trimmed for you) — not
    // this script's bug, ORCID members' self-entered data is exactly as
    // clean as what they typed.
    const title: string | undefined = summary.title?.title?.value?.trim();
    if (!title) continue;
    // `|| null`, not just the presence check above: at least one real
    // ORCID record in this project's own data had publication-date.year.
    // value set to the literal string "0" (truthy, so it passed the
    // check above) rather than being absent — Number("0") is 0, and
    // year 0 isn't a real publication year worth showing as one.
    const yearValue = summary["publication-date"]?.year?.value;
    const year = yearValue ? Number(yearValue) || null : null;
    const doiEntry = (summary["external-ids"]?.["external-id"] ?? []).find(
      (id: { "external-id-type"?: string }) => id["external-id-type"] === "doi",
    );
    const doi: string | null = doiEntry?.["external-id-value"]?.trim() || null;
    out.push({
      title,
      year,
      doi,
      link: doi ? `https://doi.org/${doi}` : (summary.url?.value ?? null),
      source: "orcid",
      matchedPerson: "",
      foundAt: new Date().toISOString().slice(0, 10),
    });
  }
  return out;
}

type CrossrefAuthor = {
  given?: string;
  family?: string;
  affiliation?: { name?: string }[];
};

// Crossref's `query.author`/`query.affiliation` params are relevance
// hints, not filters — a first live run against all 9 names (2026-09-20)
// came back with 146 "candidates" for the 8 people without an ORCID iD,
// almost all of them someone else entirely (Firmansyah, Kurniawati,
// Susetyo etc. are common enough Indonesian surnames that Crossref's
// fuzzy author search pulls in unrelated papers from unrelated authors
// worldwide). These two checks run against each item's OWN author/
// affiliation records instead of trusting the query — real signal, not
// a relevance guess — before anything is written to the pending file.
function nameMatches(personName: string, authors: CrossrefAuthor[]): boolean {
  const tokens = personName
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 2);
  const required = Math.min(2, tokens.length);
  return authors.some((author) => {
    const full = `${author.given ?? ""} ${author.family ?? ""}`.toLowerCase();
    const hits = tokens.filter((t) => full.includes(t)).length;
    return hits >= required;
  });
}

function affiliationMatches(authors: CrossrefAuthor[]): boolean {
  return authors.some((author) =>
    (author.affiliation ?? []).some((aff) =>
      /sepuluh nopember|institut teknologi|\bits\b/i.test(aff.name ?? ""),
    ),
  );
}

async function fetchCrossrefWorks(personName: string): Promise<Candidate[]> {
  const params = new URLSearchParams({
    "query.author": personName,
    "query.affiliation": "Institut Teknologi Sepuluh Nopember",
    rows: "20",
    sort: "published",
    order: "desc",
  });
  const res = await fetch(`https://api.crossref.org/works?${params}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Crossref "${personName}": HTTP ${res.status}`);
  const data = await res.json();
  const out: Candidate[] = [];
  for (const item of data.message?.items ?? []) {
    const title: string | undefined = item.title?.[0];
    if (!title) continue;
    const authors: CrossrefAuthor[] = item.author ?? [];
    // Both checks required (see the two functions' own comment above):
    // name alone isn't enough given how common these surnames are, and
    // Crossref's affiliation data is inconsistent enough between
    // publishers that this is the strictest reliable filter available
    // without a real ORCID iD for this person.
    if (!nameMatches(personName, authors) || !affiliationMatches(authors)) continue;
    const year: number | null = item.published?.["date-parts"]?.[0]?.[0] ?? null;
    const doi: string | null = item.DOI ?? null;
    out.push({
      title,
      year,
      doi,
      link: doi ? `https://doi.org/${doi}` : (item.URL ?? null),
      source: "crossref",
      matchedPerson: "",
      foundAt: new Date().toISOString().slice(0, 10),
    });
  }
  return out;
}

async function main() {
  const pending = await loadPending();
  const pendingTitles = new Set(pending.map((c) => normalizeTitle(c.title)));
  const fresh: Candidate[] = [];

  for (const person of people) {
    let found: Candidate[] = [];
    try {
      found = person.orcidId
        ? await fetchOrcidWorks(person.orcidId)
        : await fetchCrossrefWorks(person.name);
    } catch (err) {
      console.error(`[skip] ${person.name}:`, (err as Error).message);
      continue;
    }

    for (const candidate of found) {
      const norm = normalizeTitle(candidate.title);
      if (knownTitles.has(norm) || pendingTitles.has(norm)) continue;
      pendingTitles.add(norm); // avoid the same title twice in one run
      // (e.g. co-authored by two team members hit separately)
      fresh.push({ ...candidate, matchedPerson: person.slug });
    }

    // A small courtesy delay between calls — both APIs are free and
    // unauthenticated; nothing here needs to run fast, and nine people
    // is nine requests either way.
    await new Promise((r) => setTimeout(r, 300));
  }

  if (fresh.length === 0) {
    console.log("No new publication candidates found.");
    return;
  }

  const merged = [...pending, ...fresh].sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
  await writeFile(PENDING_PATH, `${JSON.stringify(merged, null, 2)}\n`, "utf8");
  console.log(`Found ${fresh.length} new candidate(s):`);
  for (const c of fresh) {
    console.log(`  - [${c.matchedPerson}] ${c.title} (${c.year ?? "?"})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
