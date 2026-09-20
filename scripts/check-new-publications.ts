// Scan external indexes for publication candidates without writing canonical content directly.
// Candidates go to publications.pending.json for human review; ORCID is preferred, Crossref is a noisier fallback.
// Run with Node 22.6+: node --experimental-strip-types scripts/check-new-publications.ts

import { readFile, writeFile } from "node:fs/promises";
import { people } from "../lib/content/people.ts";
import { publications } from "../lib/content/publications.ts";

const PENDING_PATH = new URL("../lib/content/publications.pending.json", import.meta.url);

type Candidate = {
  title: string;
  authors: string | null;
  year: number | null;
  venue: string | null;
  doi: string | null;
  link: string | null;
  // "artifact" marks manually imported candidates; this script emits only "orcid" and "crossref".
  source: "orcid" | "crossref" | "artifact";
  matchedPerson: string; // Person.slug
  foundAt: string; // ISO date this script first saw it
};

// Match the comma-separated author format used by publications.ts.
function formatAuthors(authors: { given?: string; family?: string }[]): string | null {
  const names = authors
    .filter((a) => a.family)
    .map((a) => {
      const initials = (a.given ?? "")
        .split(/[\s-]+/)
        .filter(Boolean)
        .map((n) => `${n[0]!.toUpperCase()}.`)
        .join("");
      return initials ? `${a.family}, ${initials}` : a.family!;
    });
  return names.length > 0 ? names.join(", ") : null;
}

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
    // ORCID records can contain leading whitespace; trim titles and DOIs before use.
    const title: string | undefined = summary.title?.title?.value?.trim();
    if (!title) continue;
    // Treat the string "0" as missing; year zero is not a valid publication year.
    const yearValue = summary["publication-date"]?.year?.value;
    const year = yearValue ? Number(yearValue) || null : null;
    const doiEntry = (summary["external-ids"]?.["external-id"] ?? []).find(
      (id: { "external-id-type"?: string }) => id["external-id-type"] === "doi",
    );
    const doi: string | null = doiEntry?.["external-id-value"]?.trim() || null;
    // The bulk endpoint omits contributors; enrichMissingAuthors fills them from Crossref by DOI.
    out.push({
      title,
      authors: null,
      year,
      venue: summary["journal-title"]?.value?.trim() || null,
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

// Crossref query parameters are hints, so verify each result's author and ITS affiliation records.
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
    // Require both name and affiliation matches because either signal alone is noisy.
    if (!nameMatches(personName, authors) || !affiliationMatches(authors)) continue;
    const year: number | null = item.published?.["date-parts"]?.[0]?.[0] ?? null;
    const doi: string | null = item.DOI ?? null;
    out.push({
      title,
      authors: formatAuthors(authors),
      year,
      venue: item["container-title"]?.[0]?.trim() || null,
      doi,
      link: doi ? `https://doi.org/${doi}` : (item.URL ?? null),
      source: "crossref",
      matchedPerson: "",
      foundAt: new Date().toISOString().slice(0, 10),
    });
  }
  return out;
}

// Fill missing ORCID authors from the exact DOI's Crossref record.
async function enrichMissingAuthors(candidates: Candidate[]): Promise<void> {
  for (const c of candidates) {
    if (c.authors || !c.doi) continue;
    try {
      const res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(c.doi)}`, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) continue;
      const data = await res.json();
      const item = data.message;
      c.authors = formatAuthors(item?.author ?? []);
      if (!c.venue) c.venue = item?.["container-title"]?.[0]?.trim() || null;
    } catch {
      // Keep candidates even when optional author enrichment fails.
    }
    await new Promise((r) => setTimeout(r, 200));
  }
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

    // Avoid issuing unauthenticated API requests back-to-back.
    await new Promise((r) => setTimeout(r, 300));
  }

  if (fresh.length === 0) {
    console.log("No new publication candidates found.");
    return;
  }

  await enrichMissingAuthors(fresh);

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
