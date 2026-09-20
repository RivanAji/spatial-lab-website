"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { assetPath } from "@/lib/asset-path";
import type { Person } from "@/lib/content/types";
import { PersonAvatar } from "./PersonAvatar";

export type TimelineEntry = {
  slug: string;
  title: string;
  category?: string;
  year: number | null;
  venue: string | null;
  coverImage?: string;
  href?: string;
  peopleSlugs: string[];
};


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
  const years = useMemo(() => {
    const values = [...work, ...papers].map((entry) => entry.year);
    return Array.from(new Set(values)).sort((a, b) => {
      if (a === null) return 1;
      if (b === null) return -1;
      return b - a;
    });
  }, [work, papers]);
  const [activeLabel, setActiveLabel] = useState<"Work" | "Papers">("Work");
  const [scrollLeft, setScrollLeft] = useState(0);
  const viewport = useRef<HTMLDivElement>(null);
  const entries = activeLabel === "Work" ? work : papers;
  const columnWidths = years.map((year) => {
    const count = entries.filter((entry) => entry.year === year).length;
    return count ? count * 188 + 12 : 76;
  });
  const columns = columnWidths.map((width) => `${width}px`).join(" ");

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-20 flex h-8 bg-ink-900" aria-label="Timeline years">
        <div className="w-10 shrink-0 md:w-12" />
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="grid h-8 w-max items-center" style={{ gridTemplateColumns: columns, transform: `translateX(-${scrollLeft}px)` }}>
            {years.map((year) => <div key={year ?? "undated"} className="px-3"><span className="inline-block bg-white/10 px-2 py-0.5 font-mono text-[10px] text-ink-200">{year ?? "Undated"}</span></div>)}
          </div>
        </div>
      </div>
      <div className="flex border-t border-white/8">
        <div className="grid w-10 shrink-0 grid-rows-2 border-r border-white/8 md:w-12">
          {(["Work", "Papers"] as const).map((label) => {
            const active = activeLabel === label;
            return (
              <button
                key={label}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setActiveLabel(label);
                  setScrollLeft(0);
                  if (viewport.current) viewport.current.scrollLeft = 0;
                }}
                className={`flex items-start justify-center border-b border-white/8 py-5 font-display text-[10px] font-bold tracking-[0.2em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300 last:border-b-0 ${
                  active ? "bg-blue-900/30 text-blue-300" : "text-ink-500 hover:bg-white/[0.03] hover:text-ink-300"
                }`}
              >
                <span style={{ writingMode: "vertical-rl" }}>{active ? "● " : "○ "}{label.toUpperCase()}</span>
              </button>
            );
          })}
        </div>
        <div ref={viewport} onScroll={(event) => setScrollLeft(event.currentTarget.scrollLeft)} className="min-w-0 flex-1 overflow-x-auto" tabIndex={0} role="region" aria-label="Research timeline, scroll horizontally to browse years">
          <div className="w-max">
            {[activeLabel].map((category) => (
              <div key={category} id={`timeline-${category.toLowerCase()}`} aria-label={`${category} timeline`} className="relative grid h-[520px] bg-white/[0.035] before:pointer-events-none before:absolute before:inset-x-0 before:top-[192px] before:border-t before:border-white/8 after:pointer-events-none after:absolute after:inset-x-0 after:top-[376px] after:border-t after:border-white/8" style={{ gridTemplateColumns: columns }}>
                {years.map((year) => (
                  <div key={year ?? "undated"} className="flex gap-3 p-3">
                    {(category === "Work" ? work : papers).filter((entry) => entry.year === year).map((entry) => <TimelineCard key={entry.slug} entry={entry} peopleBySlug={peopleBySlug} />)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <footer className="border-t border-white/10 px-6 py-10 md:px-10 lg:px-20">
        <ContributionMatrix people={people} work={work} papers={papers} />
      </footer>
    </div>
  );
}


const contributionColors = ["#0b0e12", "#122a4a", "#1d4f86", "#287ec1", "#5abaff"];

function ContributionMatrix({ people, work, papers }: { people: Person[]; work: TimelineEntry[]; papers: TimelineEntry[] }) {
  const datedYears = [...work, ...papers].flatMap((entry) => entry.year === null ? [] : [entry.year]);
  const firstYear = datedYears.length ? Math.min(...datedYears) : null;
  const lastYear = datedYears.length ? Math.max(...datedYears) : null;
  const years = firstYear === null || lastYear === null ? [] : Array.from({ length: lastYear - firstYear + 1 }, (_, index) => lastYear - index);
  const hasUndated = [...work, ...papers].some((entry) => entry.year === null);
  const columns: (number | null)[] = hasUndated ? [...years, null] : years;
  const [detail, setDetail] = useState("");
  return <div className="mt-3">
    <div className="max-w-full overflow-x-auto">
      <table className="border-separate border-spacing-x-1 border-spacing-y-1 text-xs">
        <caption className="sr-only">Recorded contributions by member and year, one count per work or paper for each listed contributor.</caption>
        <thead><tr><th scope="col" className="text-left font-normal text-ink-300">Member Contribution</th>{columns.map((year) => <th scope="col" key={year ?? "undated"} className="min-w-9 font-mono text-[10px] font-normal text-ink-300">{year ?? "Undated"}</th>)}</tr></thead>
        <tbody>{people.map((person) => <tr key={person.slug}>
          <th scope="row" className="whitespace-nowrap pr-5 text-left font-normal leading-5 text-ink-200">{person.profileUrl ? <a href={person.profileUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white focus-visible:outline">{person.name}</a> : person.name}</th>
          {columns.map((year) => {
            const workCount = work.filter((entry) => entry.year === year && entry.peopleSlugs.includes(person.slug)).length;
            const paperCount = papers.filter((entry) => entry.year === year && entry.peopleSlugs.includes(person.slug)).length;
            const total = workCount + paperCount;
            const level = total === 0 ? 0 : total === 1 ? 1 : total <= 3 ? 2 : total <= 6 ? 3 : 4;
            const label = `${person.name}, ${year ?? "Undated"}: ${workCount} work, ${paperCount} papers. Total ${total}.`;
            return <td key={year ?? "undated"}><button type="button" title={label} aria-label={label} onClick={() => setDetail(label)} className="block h-7 w-full rounded-sm border border-white/10 transition-colors hover:border-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white" style={{ backgroundColor: contributionColors[level] }} /></td>;
          })}
        </tr>)}</tbody>
      </table>
    </div>
    <p aria-live="polite" className="mt-2 min-h-4 text-[11px] text-ink-300">{detail}</p>
  </div>;
}

function TimelineCard({
  entry,
  peopleBySlug,
}: {
  entry: TimelineEntry;
  peopleBySlug: Map<string, Person>;
}) {
  const entryPeople = entry.peopleSlugs.map((slug) => peopleBySlug.get(slug)).filter((p): p is Person => !!p);
  const venue = entry.venue?.trim();

  return (
    <div className="flex w-44 flex-shrink-0 flex-col gap-2">
      <div className="group relative rounded-4xl border border-white/8 bg-ink-900 p-1.5 transition-colors hover:border-white/20">
      {entry.href ? (
        <a
          href={entry.href}
          aria-label={entry.title}
          target="_blank"
          rel="noopener noreferrer"
          className="group/cover relative block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-000"
        >
          <CardImage entry={entry} />
        </a>
      ) : (
        <CardImage entry={entry} />
      )}
        <div className="pointer-events-none absolute right-4 top-4 text-white mix-blend-difference">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 origin-center transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:rotate-90 group-focus-within:translate-x-0.5 group-focus-within:rotate-90 motion-reduce:transition-none">
            <path d="M12 19V5m-6 6 6-6 6 6" />
          </svg>
        </div>
      </div>

      <div className="aspect-square w-full shrink-0 overflow-hidden rounded-3xl border border-white/8 bg-ink-900 p-3">
        <span className="mb-2 inline-block rounded border border-white/15 px-1.5 py-0.5 font-mono text-[10px] leading-4 text-ink-300">{entry.category ?? "Research"}</span>
        <h3 className="sr-only">{entry.title}</h3>
        <p title={[entry.title, venue].filter(Boolean).join(" — ")} className="line-clamp-7 font-body text-xs leading-4 text-ink-300">
          <span className="font-display font-semibold text-ink-000">{entry.title}</span>
          {venue && <><br /><span>{venue}</span></>}
        </p>
      </div>

      {entryPeople.length > 0 && (
        <div className="flex h-32 items-center rounded-3xl border border-white/8 bg-ink-900 p-2.5">
          <div className="isolate flex w-full items-center">
            {entryPeople.map((person, index) => (
              <span key={person.slug} title={person.name} style={{ marginLeft: index ? -Math.max(16, 64 - 88 / (entryPeople.length - 1)) : 0 }} className="relative shrink-0 rounded-full ring-2 ring-ink-900 transition-transform hover:z-10 hover:-translate-y-1 focus-within:z-10 motion-reduce:transition-none">
                <PersonAvatar person={person} size="lg" />
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CardImage({ entry }: { entry: TimelineEntry }) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-[1.4rem] bg-ink-800">
      {entry.coverImage && (
        <Image
          src={assetPath(entry.coverImage)}
          alt=""
          fill
          sizes="176px"
          loading="eager"
          className="object-cover"
        />
      )}
    </div>
  );
}
