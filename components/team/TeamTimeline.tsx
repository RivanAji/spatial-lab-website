"use client";

// Rebuilt 2026-09-20, second pass, once the site owner sent a much
// clearer screenshot of the reference (https://senseabledb.mit.edu):
// "saya mau tampilannya menyamping seperti ini, ubah layoutnya" — MIT's
// own page is several permanently-visible horizontal rows (WORK, WRITE,
// PEOPLE...), each with a rotated label in a coloured left rail, each
// independently scrollable. "Work" and "Papers" are this site's two
// rows, in that order, both visible at once — not a tab switch any
// more (the first pass's mistake, from a vaguer description of the
// same reference). Cards inside each row are grouped by year, not
// month ("kalo kita pertahun aja gausah perbulan"), and are themselves
// three stacked sections per the site owner's own breakdown: a topic
// image, a title/year/venue text block, and the contributing team
// member(s)' photo(s).
import { useMemo } from "react";
import Image from "next/image";
import type { Person } from "@/lib/content/types";
import { PersonAvatar } from "./PersonAvatar";

export type TimelineEntry = {
  slug: string;
  title: string;
  year: number | null;
  venue: string | null;
  coverImage?: string;
  href?: string;
  peopleSlugs: string[];
};

function groupByYear(entries: TimelineEntry[]): { year: string; items: TimelineEntry[] }[] {
  const groups = new Map<string, TimelineEntry[]>();
  for (const entry of entries) {
    const key = entry.year != null ? String(entry.year) : "Undated";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(entry);
  }
  return Array.from(groups.entries())
    .sort(([a], [b]) => {
      if (a === "Undated") return 1;
      if (b === "Undated") return -1;
      return Number(b) - Number(a);
    })
    .map(([year, items]) => ({ year, items }));
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
  const peopleBySlug = useMemo(() => new Map(people.map((p) => [p.slug, p])), [people]);

  return (
    <div className="mt-8 flex flex-col md:mt-10">
      <TimelineRow label="Work" entries={work} peopleBySlug={peopleBySlug} />
      <TimelineRow label="Papers" entries={papers} peopleBySlug={peopleBySlug} />
    </div>
  );
}

function TimelineRow({
  label,
  entries,
  peopleBySlug,
}: {
  label: string;
  entries: TimelineEntry[];
  peopleBySlug: Map<string, Person>;
}) {
  const groups = useMemo(() => groupByYear(entries), [entries]);

  return (
    <div className="flex border-t border-white/8 first:border-t-0">
      {/* Rotated row label in its own rail (site owner: "Work dan Paper
          tulisannya menyamping, rotate 90 degree biar spacenya
          optimal") — the site's ITS-blue accent tokens (see
          TeamTimeline's own earlier use, and check-contrast.mjs),
          reused as the one deliberate colour on this page, same as
          before. */}
      <div className="flex w-10 shrink-0 items-center justify-center border-r border-white/8 bg-blue-900/30 py-6 md:w-12">
        <span
          className="font-display text-xs font-bold tracking-[0.2em] text-blue-300"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          {label.toUpperCase()}
        </span>
      </div>

      {entries.length === 0 ? (
        <p className="flex-1 self-center px-6 py-10 font-body text-sm text-ink-300">
          Nothing here yet.
        </p>
      ) : (
        <div
          style={{
            maskImage: "linear-gradient(to right, transparent, black 2%, black 97%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 2%, black 97%, transparent)",
          }}
          className="flex flex-1 items-stretch gap-6 overflow-x-auto px-5 py-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {groups.map((group) => (
            <div key={group.year} className="flex shrink-0 items-center gap-3">
              <span className="flex h-full items-center border-l border-white/8 pl-3 font-mono text-[11px] text-ink-500">
                {group.year}
              </span>
              <div className="flex items-stretch gap-3">
                {group.items.map((entry) => (
                  <TimelineCard key={entry.slug} entry={entry} peopleBySlug={peopleBySlug} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
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
  const meta = [entry.year, entry.venue].filter(Boolean).join(" · ");

  // Smaller, matching the homepage's own card width (Project.tsx,
  // PublicationCard) — site owner: "bagian cardnya menyamping agak
  // kecilin aja, kyk yang dihalaman home". Three sections, per the site
  // owner's own breakdown: 1) the topic image, 2) title/year/venue,
  // 3) contributor photo(s) — bigger than PublicationCard's own avatar
  // convention on this page specifically (PersonAvatar's own "lg" size,
  // see that component's comment).
  return (
    <div className="group flex w-44 flex-shrink-0 flex-col rounded-4xl border border-white/8 bg-ink-900 p-1.5 transition-colors hover:border-white/20">
      {entry.href ? (
        <a
          href={entry.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-000"
        >
          <CardImage entry={entry} />
        </a>
      ) : (
        // No real destination yet (a project with no detail page, or a
        // paper with no DOI on file) — plain, non-interactive, per this
        // project's "no dead navigation" rule (PRD 6.6).
        <CardImage entry={entry} />
      )}

      <div className="flex flex-col gap-1 px-2 pb-1 pt-3">
        <h3 className="line-clamp-2 font-display text-xs font-semibold leading-snug text-ink-000">
          {entry.title}
        </h3>
        {meta && <p className="line-clamp-1 font-body text-[11px] text-ink-300">{meta}</p>}
      </div>

      {entryPeople.length > 0 && (
        <div className="flex -space-x-3 px-2 pb-2 pt-2">
          {entryPeople.map((person) => (
            <PersonAvatar key={person.slug} person={person} size="lg" />
          ))}
        </div>
      )}
    </div>
  );
}

function CardImage({ entry }: { entry: TimelineEntry }) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-[1.4rem] bg-ink-800">
      {entry.coverImage && (
        <Image src={entry.coverImage} alt="" fill sizes="176px" className="object-cover" />
      )}
    </div>
  );
}
