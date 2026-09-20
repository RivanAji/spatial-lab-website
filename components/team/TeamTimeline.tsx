"use client";

// Added 2026-09-20 for app/research/[team]/page.tsx — the two-row
// filter plus year-grouped card timeline the site owner described,
// reading roughly like https://senseabledb.mit.edu's own dark,
// single-accent mood (see that page's own top comment for how this
// diverges from that reference's actual interaction). "Work" and
// "Papers" are two separately-sourced lists passed in from the server
// component (lib/content/projects.ts's projectsForTeam and
// lib/content/publications.ts's publicationsByTeam) rather than one
// shared shape — this component only normalises them for display.
import { useMemo, useState } from "react";
import Image from "next/image";
import type { Person } from "@/lib/content/types";
import { PersonAvatar } from "./PersonAvatar";
import { cn } from "@/lib/cn";

export type TimelineEntry = {
  slug: string;
  title: string;
  subtitle: string;
  year: number | null;
  coverImage?: string;
  href?: string;
  peopleSlugs: string[];
};

type Tab = "work" | "papers";

function groupByYear(entries: TimelineEntry[]): [string, TimelineEntry[]][] {
  const groups = new Map<string, TimelineEntry[]>();
  for (const entry of entries) {
    const key = entry.year != null ? String(entry.year) : "Undated";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(entry);
  }
  return Array.from(groups.entries()).sort(([a], [b]) => {
    if (a === "Undated") return 1;
    if (b === "Undated") return -1;
    return Number(b) - Number(a);
  });
}

export function TeamTimeline({
  work,
  papers,
  people,
}: {
  work: TimelineEntry[];
  papers: TimelineEntry[];
  people: Person[];
}) {
  const [tab, setTab] = useState<Tab>(papers.length > 0 ? "papers" : "work");
  const peopleBySlug = useMemo(() => new Map(people.map((p) => [p.slug, p])), [people]);

  const entries = tab === "work" ? work : papers;
  const groups = useMemo(() => groupByYear(entries), [entries]);

  return (
    <div className="mt-12 flex flex-col gap-8 md:mt-16 md:flex-row md:items-start md:gap-10">
      {/* Left filter (site owner: "warna biru untuk filter baris di
          sebelah kiri, biru ITS yang cocok/match untuk warna hitam
          backgroundnya") — the site's own blue-* tokens (app/globals.
          css), kept defined but unused since the monochrome pivot,
          reused here as the one deliberate accent this page carries. */}
      <div className="flex gap-2 md:w-40 md:shrink-0 md:flex-col md:gap-3">
        {(
          [
            ["work", "Work", work.length],
            ["papers", "Papers", papers.length],
          ] as const
        ).map(([key, label, count]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            disabled={count === 0}
            aria-pressed={tab === key}
            className={cn(
              "flex flex-1 items-center justify-between gap-2 rounded-3xl border px-5 py-3.5 text-left font-display text-sm font-semibold tracking-tight transition-colors duration-200 md:flex-none",
              tab === key
                ? "border-blue-400 bg-blue-800/60 text-ink-000"
                : "border-white/8 bg-ink-800/60 text-ink-300 hover:border-white/20 hover:text-ink-100",
              count === 0 && "cursor-not-allowed opacity-40 hover:border-white/8 hover:text-ink-300",
            )}
          >
            {label}
            <span className="font-mono text-[10px] text-ink-300">{String(count).padStart(2, "0")}</span>
          </button>
        ))}
      </div>

      {/* Timeline: year-grouped cards, not month-grouped (site owner:
          "kalo kita pertahun aja gausah perbulan"). */}
      <div className="min-w-0 flex-1">
        {entries.length === 0 ? (
          <p className="rounded-3xl border border-white/8 bg-ink-800/40 p-10 text-center font-body text-sm text-ink-300">
            Nothing here yet.
          </p>
        ) : (
          <div className="flex flex-col gap-10">
            {groups.map(([year, items]) => (
              <div key={year}>
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-sm text-blue-300">{year}</span>
                  <span className="h-px flex-1 bg-white/8" aria-hidden="true" />
                </div>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((entry) => (
                    <TimelineCard key={entry.slug} entry={entry} peopleBySlug={peopleBySlug} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TimelineCard({
  entry,
  peopleBySlug,
}: {
  entry: TimelineEntry;
  peopleBySlug: Map<string, Person>;
}) {
  const entryPeople = entry.peopleSlugs.map((slug) => peopleBySlug.get(slug)).filter((p): p is Person => !!p);

  // The avatar row sits OUTSIDE the title/image link below, not inside
  // it — PersonAvatar is its own <a> (to that person's profile), and an
  // <a> can't nest inside another <a> (invalid HTML; caught as a real
  // hydration error when this card had a DOI link wrapping everything,
  // avatar included). Both live inside this same outer card, they just
  // don't share one clickable element.
  //
  // Rounded-4xl double-bezel, the same recipe as this site's other cards
  // (Hero's map card, the Research gallery frame, Project.tsx) —
  // deliberately not this page's own reference's sharp, un-rounded grid
  // (see this file's top comment).
  return (
    <div className="group rounded-4xl border border-white/8 bg-ink-900 p-1.5 transition-colors hover:border-white/20">
      {entry.href ? (
        <a
          href={entry.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-000"
        >
          <TimelineCardBody entry={entry} />
        </a>
      ) : (
        // No real destination yet (a project with no detail page, or a
        // paper with no DOI on file) — plain, non-interactive, per this
        // project's "no dead navigation" rule (PRD 6.6).
        <TimelineCardBody entry={entry} />
      )}
      {entryPeople.length > 0 && (
        <div className="flex -space-x-2 px-3 pb-3">
          {entryPeople.map((person) => (
            <PersonAvatar key={person.slug} person={person} size="sm" />
          ))}
        </div>
      )}
    </div>
  );
}

function TimelineCardBody({ entry }: { entry: TimelineEntry }) {
  return (
    <>
      <div className="relative aspect-square overflow-hidden rounded-[1.6rem] bg-ink-800">
        {entry.coverImage && (
          <Image src={entry.coverImage} alt="" fill sizes="360px" className="object-cover" />
        )}
      </div>
      <div className="flex flex-col gap-2 p-3 pb-2">
        <h3 className="line-clamp-2 font-display text-sm font-semibold leading-snug text-ink-000">
          {entry.title}
        </h3>
        {entry.subtitle && (
          <p className="line-clamp-1 font-body text-xs text-ink-300">{entry.subtitle}</p>
        )}
      </div>
    </>
  );
}
