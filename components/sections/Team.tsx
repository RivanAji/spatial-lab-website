import { Container } from "@/components/ui/Container";
import { people } from "@/lib/content/people";

// Keep the roster and profile URLs sourced from lib/content/people.ts to avoid duplicated names.
const head = people.find((p) => p.slug === "siti-nurlaela")!;
const members = people.filter((p) => p.slug !== "siti-nurlaela");

// Members without profileUrl render plain text to avoid dead links; linked names retain keyboard focus styles.
function PersonName({ person }: { person: (typeof members)[number] }) {
  if (!person.profileUrl) return <>{person.name}</>;
  return (
    <a
      href={person.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-000"
    >
      {person.name}
    </a>
  );
}

export function Team() {
  return (
    <section id="team" aria-label="Team" className="scroll-mt-24 py-8 md:py-10">
      <Container>
        <h2 className="font-display text-xl font-semibold tracking-tight text-ink-000 md:text-2xl">
          Team
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[1fr_2fr] md:gap-16">
          <p className="font-body text-sm text-ink-000">
            <PersonName person={head} />
            <span className="ml-2 font-body text-xs italic text-ink-300">{head.role}</span>
          </p>

          <ul className="flex flex-col gap-1.5">
            {members.map((person) => (
              <li key={person.slug} className="font-body text-sm text-ink-100">
                <PersonName person={person} />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
