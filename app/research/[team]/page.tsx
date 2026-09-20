import type { Metadata } from "next";
import Image from "next/image";
import { assetPath } from "@/lib/asset-path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { teams, getTeam } from "@/lib/content/teams";
import { people } from "@/lib/content/people";
import { publicationsByTeam } from "@/lib/content/publications";
import { projectsForTeam } from "@/lib/content/projects";
import { TeamTimeline, type TimelineEntry } from "@/components/team/TeamTimeline";
import logo from "@/public/brand/logo-white.png";

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

// Source author strings abbreviate given names inconsistently, so match stable surnames.
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
    category: pub.category ?? (/conference|proceedings/i.test(pub.venue) ? "Proceedings" : pub.venue ? "Journal" : "Paper"),
    year: pub.year,
    venue: pub.venue || null,
    coverImage: pub.coverImage,
    href: pub.url ?? (pub.doi ? `https://doi.org/${pub.doi}` : undefined),
    peopleSlugs: memberSlugsIn(pub.authors, members),
  }));

  const work: TimelineEntry[] = projectsForTeam(memberNames).map((project) => ({
    slug: project.slug,
    title: project.name,
    category: project.category ?? "Work",
    year: project.year ?? null,
    venue: project.description ?? null,
    coverImage: project.coverImage,
    href: undefined, // No project detail page yet; avoid dead navigation.
    peopleSlugs: memberSlugsIn(project.developer ?? "", members),
  }));

  return (
    <div className="min-h-dvh bg-ink-900">
      {/* Mobile: logo bar, then the title stacked below it — both in
          normal flow, nothing fixed. */}
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
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-6 pb-5 pt-4">
          <span className="font-display text-sm font-bold tracking-tight text-ink-000">TSAL</span>
          <h1 className="font-display text-sm font-semibold text-ink-000">{team.name}</h1>
          <span className="h-px w-6 bg-ink-600" aria-hidden="true" />
          <p className="font-body text-xs font-normal text-ink-300">{joinFocus(team.focus)}</p>
        </div>
      </header>

      {/* Desktop: the fixed bar itself carries only the logos, same as
          Home's own header — nothing in it moves on scroll. */}
      <div className="fixed inset-x-0 top-0 z-50 hidden h-20 items-center justify-between px-6 md:flex">
        <Link
          href="/"
          aria-label="Spatial Analysis & Transportation Laboratory, home"
          className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink-000"
        >
          <Image src={logo} alt="" priority height={32} className="h-8 w-auto" />
        </Link>
        <img
          src={assetPath("/brand/its-logo-white.svg")}
          alt="Institut Teknologi Sepuluh Nopember"
          className="h-8 w-auto opacity-90"
        />
      </div>

      {/* The title is regular body content, not the header — it only
          reads as one merged bar with the fixed logos above because the
          two elements above it contribute no layout height at md+ (one
          is md:hidden, the other position:fixed), so this is the first
          flowed element and lands at y:0 on its own, matching the fixed
          bar's own h-20. An invisible logo-sized spacer reserves the
          width the real (fixed) logo already occupies, so this text
          starts right after it instead of under it; scrolling moves
          this title away normally, leaving only the fixed logos in
          place, since it was never actually fixed. */}
      <div className="hidden md:flex md:h-20 md:items-center md:justify-between md:px-6">
        <div className="flex min-w-0 items-baseline gap-x-4">
          <span className="invisible shrink-0" aria-hidden="true">
            <Image src={logo} alt="" priority height={32} className="h-8 w-auto" />
          </span>
          <div className="flex min-w-0 items-baseline gap-x-3">
            <span className="shrink-0 font-display text-sm font-bold tracking-tight text-ink-000">TSAL</span>
            <h1 className="shrink-0 font-display text-sm font-semibold text-ink-000">{team.name}</h1>
            <span className="h-px w-6 shrink-0 bg-ink-600" aria-hidden="true" />
            <p className="truncate font-body text-xs font-normal text-ink-300">{joinFocus(team.focus)}</p>
          </div>
        </div>
        <span className="invisible h-8 w-10 shrink-0" aria-hidden="true" />
      </div>

      <TeamTimeline work={work} papers={papers} people={members} />
    </div>
  );
}
