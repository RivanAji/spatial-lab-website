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
      {/* Logos only — a real fixed header, mirroring Header.tsx exactly
          (same px-6, same h-20/h-16, same logo sizes) so both land in the
          same position as Home. */}
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
          src={assetPath("/brand/its-logo-white.svg")}
          alt="Institut Teknologi Sepuluh Nopember"
          className="h-8 w-auto opacity-90"
        />
      </div>

      {/* The title, not the header — plain in-flow content (site owner:
          "jangan buat statis, dinamis aja... ikut ke scroll"), so it
          scrolls away with the page instead of staying pinned. Padding
          matches Home's own Container (px-6 md:px-10 lg:px-20, max-w
          1400px), not the logo bar's tighter edge-to-edge px-6 — the
          site owner: "sesuaikan dengan home pagenya padding kanan dan
          kiri untuk judul ini". pt-28 on md+ clears the 80px fixed
          header with room to breathe (site owner: "posisinya kurang
          tinggi"). */}
      <div className="mx-auto w-full max-w-[1400px] px-6 pb-5 pt-5 md:px-10 md:pb-6 md:pt-28 lg:px-20">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-display text-sm font-bold tracking-tight text-ink-000">TSAL</span>
          <h1 className="font-display text-sm font-semibold text-ink-000">{team.name}</h1>
          <span className="h-px w-6 bg-ink-600" aria-hidden="true" />
          <p className="font-body text-xs font-normal text-ink-300">{joinFocus(team.focus)}</p>
        </div>
      </div>

      <TeamTimeline work={work} papers={papers} people={members} />
    </div>
  );
}
