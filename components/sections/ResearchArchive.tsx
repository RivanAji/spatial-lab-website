"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { publications } from "@/lib/content/publications";
import { teams } from "@/lib/content/teams";
import { Container } from "@/components/ui/Container";
import { FilterChip } from "@/components/ui/FilterChip";
import { Button } from "@/components/ui/Button";

// PRD 7.4. These cards show real publications, not fabricated "research
// projects" — actual project entries with field photos or GIS output are
// still an open content gap (PRD 3.5), and a stock photo standing in for
// one would be exactly the kind of dishonest placeholder PRD 6.6 bans.
// A publication is real research output on its own; the card is designed
// text-forward on purpose rather than pretending to have a cover image.
//
// Search (PRD 7.4) ships in Phase 6, once the archive is past ~24 entries
// — at 27 it's arguably already there, but that's a Phase 6 call, not a
// Phase 4 one; the filters below are enough for this size for now.

const TEAM_FILTER_LABELS: Record<string, string> = {
  all: "All",
  "sustainable-urban-transportation": "01 Transport",
  "spatial-data-science-ai": "02 Data Science & AI",
  "decision-support-climate": "03 Decision & Climate",
};

export function ResearchArchive() {
  const [activeTeam, setActiveTeam] = useState<string>("all");
  const [activeYear, setActiveYear] = useState<string>("all");

  const years = useMemo(
    () => Array.from(new Set(publications.map((p) => p.year))).sort((a, b) => b - a),
    [],
  );

  const filtered = useMemo(
    () =>
      publications
        .filter((p) => activeTeam === "all" || p.team === activeTeam)
        .filter((p) => activeYear === "all" || String(p.year) === activeYear)
        .sort((a, b) => b.year - a.year),
    [activeTeam, activeYear],
  );

  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h2 className="font-display text-3xl font-semibold uppercase text-ink-000 md:text-4xl">
            Research Archive
          </h2>

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {["all", ...teams.map((t) => t.slug)].map((slug) => (
                <FilterChip
                  key={slug}
                  active={activeTeam === slug}
                  onClick={() => setActiveTeam(slug)}
                >
                  {TEAM_FILTER_LABELS[slug]}
                </FilterChip>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <FilterChip active={activeYear === "all"} onClick={() => setActiveYear("all")}>
                All years
              </FilterChip>
              {years.map((year) => (
                <FilterChip
                  key={year}
                  active={activeYear === String(year)}
                  onClick={() => setActiveYear(String(year))}
                >
                  {year}
                </FilterChip>
              ))}
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-14 flex flex-col items-start gap-4 border border-ink-500 p-10">
            <p className="font-body text-ink-100">
              No publications match this combination of team and year yet.
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                setActiveTeam("all");
                setActiveYear("all");
              }}
            >
              Reset filters
            </Button>
          </div>
        ) : (
          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((pub) => (
              <ArchiveCard key={pub.slug} publication={pub} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

function ArchiveCard({ publication }: { publication: (typeof publications)[number] }) {
  const team = teams.find((t) => t.slug === publication.team);
  return (
    <Link
      href={`/publications/${publication.slug}`}
      className="group flex flex-col justify-between border border-ink-500 bg-ink-700 p-6 transition-transform duration-200 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
    >
      <div>
        <p className="font-mono text-xs text-blue-400">{publication.year}</p>
        <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-ink-000 transition-colors group-hover:text-ink-000">
          {publication.title}
        </h3>
        <p className="mt-3 font-body text-sm text-ink-300">{publication.authors}</p>
      </div>
      <div className="mt-6">
        {publication.venue && (
          <p className="font-body text-xs text-ink-300">{publication.venue}</p>
        )}
        <p className="mt-1 font-mono text-xs text-ink-300">
          {team?.displayName} · {publication.year}
        </p>
      </div>
    </Link>
  );
}
