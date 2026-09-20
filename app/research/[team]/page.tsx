import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { teams, getTeam } from "@/lib/content/teams";
import { people } from "@/lib/content/people";
import { publicationsByTeam } from "@/lib/content/publications";
import { projectsForTeam } from "@/lib/content/projects";
import { TeamTimeline, type TimelineEntry } from "@/components/team/TeamTimeline";
import logo from "@/public/brand/logo-white.png";

// Added 2026-09-20 (site owner's request): a real detail page per
// research team, reached by clicking that team's card in the homepage
// gallery (PublicationsShowcase.tsx's TeamFilterCard, which used to
// filter the gallery on click and now navigates here instead). Visual
// direction was a specific reference — https://senseabledb.mit.edu —
// though that site turned out to be a bespoke physics-driven scatter
// timeline with month-level placement, not the row/filter/card layout
// the site owner actually described in words; this builds what they
// wrote (a left Work/Papers switch, year-grouped cards), borrowing the
// reference's dark-plus-one-accent-colour mood rather than its exact
// interaction mechanic. Corners are deliberately rounder than that
// reference's own sharp grid ("buat kelengkungan / round nya agak
// lengkung yak, jadi ga terlalu kaku") — this site's own established
// rounded-4xl double-bezel language, not MIT's.
export function generateStaticParams() {
  return teams.map((team) => ({ team: team.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ team: string }>;
}): Promise<Metadata> {
  const { team: slug } = await params;
  const team = getTeam(slug);
  if (!team) return {};
  return { title: team.name };
}

function joinFocus(focus: string[]): string {
  if (focus.length <= 1) return focus.join("");
  return `${focus.slice(0, -1).join(", ")} and ${focus[focus.length - 1]}`;
}

// A publication/project "belongs" to whichever team member(s) it names
// — matched against each member's own surname (the last word of their
// full name) rather than an exact-string lookup, since author strings
// abbreviate given names inconsistently ("Nurlaela, S." vs "Nurlaela,
// Siti") but the surname itself is stable across every source this site
// pulled from (ORCID, Crossref, ITS Scholar).
function memberSlugsIn(text: string, candidates: typeof people): string[] {
  const lower = text.toLowerCase();
  return candidates.filter((p) => lower.includes(p.name.split(" ").pop()!.toLowerCase())).map((p) => p.slug);
}

export default async function TeamPage({ params }: { params: Promise<{ team: string }> }) {
  const { team: slug } = await params;
  const team = getTeam(slug);
  if (!team) notFound();

  const memberSlugs = [team.coordinatorSlug, ...team.memberSlugs];
  const members = people.filter((p) => memberSlugs.includes(p.slug));
  const memberNames = members.map((p) => p.name);

  const papers: TimelineEntry[] = publicationsByTeam(team.slug).map((pub) => ({
    slug: pub.slug,
    title: pub.title,
    subtitle: [pub.venue, String(pub.year)].filter(Boolean).join(" · "),
    year: pub.year,
    coverImage: pub.coverImage,
    href: pub.doi ? `https://doi.org/${pub.doi}` : undefined,
    peopleSlugs: memberSlugsIn(pub.authors, members),
  }));

  const work: TimelineEntry[] = projectsForTeam(memberNames).map((project) => ({
    slug: project.slug,
    title: project.name,
    subtitle: project.description ?? project.developer ?? "",
    year: project.year ?? null,
    coverImage: project.coverImage,
    href: undefined, // no project detail page yet — PRD 6.6's "no dead navigation"
    peopleSlugs: memberSlugsIn(project.developer ?? "", members),
  }));

  return (
    <div className="min-h-dvh bg-ink-900">
      {/* Minimal page header — just the two marks, no primary nav (site
          owner: "background nya tetep hitam, logo lab (home) di kiri
          dan logo ITS dikanan"), unlike Header.tsx's full nav pill,
          whose links are same-page anchors that only make sense on "/". */}
      <header className="flex items-center justify-between px-6 py-6 md:px-10">
        <Link
          href="/"
          aria-label="Spatial Analysis & Transportation Laboratory, home"
          className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink-000"
        >
          <Image src={logo} alt="" priority height={32} className="h-8 w-auto" />
        </Link>
        <img
          src="/brand/its-logo-white.svg"
          alt="Institut Teknologi Sepuluh Nopember"
          className="h-8 w-auto opacity-90"
        />
      </header>

      <div className="px-6 pb-16 pt-6 md:px-10 md:pb-24">
        {/* Title row — "TSAL" stays on the left (site owner: "Tittlenya
            tetep TSAL"), the team's own name takes the right, matching
            Footer.tsx's own TSAL styling rather than inventing a new one. */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <span className="font-display text-xl font-bold tracking-tight text-ink-000 md:text-2xl">
            TSAL
          </span>
          <h1 className="font-display text-xl font-semibold tracking-tight text-ink-000 sm:text-right md:text-2xl">
            {team.name}
          </h1>
        </div>

        {/* Centred focus description (site owner: "keterangan dibagian
            tengah page nya"), from lib/content/teams.ts's own `focus`
            array rather than retyped here. */}
        <p className="mx-auto mt-10 max-w-2xl text-center font-body text-sm text-ink-300 md:mt-16 md:text-base">
          {joinFocus(team.focus)}
        </p>

        <TeamTimeline work={work} papers={papers} people={members} />
      </div>
    </div>
  );
}
