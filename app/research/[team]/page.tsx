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
// filter the gallery on click and now navigates here instead).
//
// Rebuilt the same day, second pass, after the site owner sent a much
// clearer screenshot of the reference (https://senseabledb.mit.edu):
// "saya mau tampilannya menyamping seperti ini, ubah layoutnya" — a
// wide horizontal timeline with a rotated, colour-accented row label on
// the left (WORK / PAPERS here, matching MIT's WORK / WRITE / PEOPLE...
// sidebar), and a thin, small-type info bar up top instead of the
// large centred title block the first pass had. See TeamTimeline.tsx
// for the timeline itself.
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
    year: pub.year,
    venue: pub.venue || null,
    coverImage: pub.coverImage,
    href: pub.doi ? `https://doi.org/${pub.doi}` : undefined,
    peopleSlugs: memberSlugsIn(pub.authors, members),
  }));

  const work: TimelineEntry[] = projectsForTeam(memberNames).map((project) => ({
    slug: project.slug,
    title: project.name,
    year: project.year ?? null,
    venue: project.description ?? project.developer ?? null,
    coverImage: project.coverImage,
    href: undefined, // no project detail page yet — PRD 6.6's "no dead navigation"
    peopleSlugs: memberSlugsIn(project.developer ?? "", members),
  }));

  return (
    <div className="min-h-dvh bg-ink-900">
      {/* Same fixed-header recipe as Header.tsx (site owner: "usahakan
          logo labkom dan juga logo ITSnya berada di posisi yang sama
          dengan halaman Home") — h-20, the same px-6, the same logo
          heights — just without the centre nav pill, whose links are
          same-page hash anchors that only resolve on "/". Mobile mirrors
          Header.tsx's own mobile bar too: in-flow (not fixed), lab mark
          only, no ITS mark — that one is desktop-only there as well. */}
      <header className="border-b border-white/8 bg-ink-900 md:hidden">
        <div className="flex h-16 items-center px-6">
          <Link
            href="/"
            aria-label="Spatial Analysis & Transportation Laboratory, home"
            className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink-000"
          >
            <Image src={logo} alt="" priority height={36} className="h-9 w-auto" />
          </Link>
        </div>
      </header>
      <div className="fixed inset-x-0 top-0 z-50 hidden h-20 items-center justify-between px-6 md:flex">
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
      </div>

      {/* Thin info bar (site owner: "bagian atasnya kecil aja fontnya
          seperti MIT... TSAL dipinggirnya tulisan [team name] kecil
          saja, di bagian tengahnya lebih ke abu abu dan light/normal
          [tagline] biar ga terlalu banyak makan tempat") — one small,
          wrapping line instead of the large centred title block the
          first pass had, echoing how little vertical space MIT's own
          reference gives this same information. */}
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-6 pt-6 md:px-10 md:pt-24">
        <span className="font-display text-sm font-bold tracking-tight text-ink-000">TSAL</span>
        <h1 className="font-display text-sm font-semibold text-ink-000">{team.name}</h1>
        <span className="text-ink-600" aria-hidden="true">
          —
        </span>
        <p className="font-body text-xs font-normal text-ink-300">{joinFocus(team.focus)}</p>
      </div>

      <TeamTimeline work={work} papers={papers} people={members} />
    </div>
  );
}
