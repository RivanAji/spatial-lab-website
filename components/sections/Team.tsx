import { Container } from "@/components/ui/Container";
import { people } from "@/lib/content/people";

// Added 2026-09-20 (site owner's request): a plain-text team section
// below Roadmap, styled after a reference screenshot the site owner
// sent (name + a small italic grey role, same line) — but the actual
// STRUCTURE below is the site owner's own written spec, not a copy of
// that screenshot's single-column list: the lab head sits alone in a
// left column, the rest of the team in a list on the right (no
// numbering — a follow-up request; plain names read tighter without
// it, which is also why the row gap and heading-to-content gap below
// are both smaller than the first pass).
//
// Sourced from lib/content/people.ts, not retyped — that file is
// already the verified real roster (PRD 3.1/3.2), so pulling from it
// instead of hand-typing the same nine names again here is what keeps
// a spelling fix or a new member from ever needing to happen twice.
const head = people.find((p) => p.slug === "siti-nurlaela")!;
const members = people.filter((p) => p.slug !== "siti-nurlaela");

export function Team() {
  return (
    <section id="team" aria-label="Team" className="scroll-mt-24 py-16 md:py-20">
      <Container>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-000 md:text-4xl">
          Team
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[1fr_2fr] md:gap-16">
          <p className="font-body text-base text-ink-000 sm:text-lg">
            {head.name}
            <span className="ml-2 font-body text-sm italic text-ink-300">{head.role}</span>
          </p>

          <ul className="flex flex-col gap-1.5">
            {members.map((person) => (
              <li key={person.slug} className="font-body text-base text-ink-100">
                {person.name}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
