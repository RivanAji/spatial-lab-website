import Link from "next/link";
import { teams } from "@/lib/content/teams";
import { getPerson } from "@/lib/content/people";
import { publicationsByTeam } from "@/lib/content/publications";
import { Container } from "@/components/ui/Container";
import { Hairline } from "@/components/ui/Hairline";
import { cn } from "@/lib/cn";

// PRD 7.3 / 29.5 — deliberately NOT three equal cards, the single most
// common templated pattern. Team 01 gets a lead panel at roughly 60%
// width (achieved here with a 1.5fr/1fr grid), Teams 02/03 stack beside
// it. This has to look different from the Research Archive's card grid
// below it, not the same component reused with different text.
export function ResearchTeams() {
  const [team01, team02, team03] = teams;

  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.5fr_1fr] lg:grid-rows-2">
          <TeamPanel team={team01} lead className="lg:row-span-2" />
          <TeamPanel team={team02} />
          <TeamPanel team={team03} />
        </div>
      </Container>
    </section>
  );
}

function TeamPanel({
  team,
  lead = false,
  className,
}: {
  team: (typeof teams)[number];
  lead?: boolean;
  className?: string;
}) {
  const coordinator = getPerson(team.coordinatorSlug);
  const pubCount = publicationsByTeam(team.slug).length;

  return (
    <div
      className={cn(
        "flex flex-col justify-between border border-ink-500 p-8",
        lead ? "md:p-12" : "p-7",
        className,
      )}
    >
      <div>
        <p
          className={cn(
            "font-mono text-ink-300",
            lead ? "text-base" : "text-sm",
          )}
        >
          {String(team.number).padStart(2, "0")}
        </p>
        <h3
          className={cn(
            "mt-3 font-display font-semibold uppercase leading-[1.1] text-ink-000",
            lead ? "text-3xl md:text-4xl" : "text-xl md:text-2xl",
          )}
        >
          {team.displayName}
        </h3>
        <p
          className={cn(
            "mt-4 max-w-[42ch] font-body text-ink-300",
            lead ? "text-base" : "text-sm",
          )}
        >
          {team.tagline}
        </p>
      </div>

      <div className="mt-8">
        <Hairline className="mb-5" />
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            {coordinator && (
              <p className="font-body text-sm text-ink-100">
                {coordinator.name}
                <span className="text-ink-300"> · Coordinator</span>
              </p>
            )}
            {pubCount > 0 && (
              <p className="mt-1 font-mono text-xs text-ink-300">
                {pubCount} publications
              </p>
            )}
          </div>
          <Link
            href={`/research/${team.slug}`}
            className="font-body text-sm font-semibold text-blue-400 transition-colors hover:text-blue-300"
          >
            Explore Team →
          </Link>
        </div>
      </div>
    </div>
  );
}
