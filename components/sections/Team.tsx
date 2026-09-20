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
// Same source for each name's link (site owner, 2026-09-20: "untuk
// masing masing nama saya sertakan URL risetnya") — profileUrl on the
// Person type, mostly ITS Scholar profile pages, one Google Scholar.
const head = people.find((p) => p.slug === "siti-nurlaela")!;
const members = people.filter((p) => p.slug !== "siti-nurlaela");

// A name with no profileUrl on file (not the case for anyone right
// now, but the type keeps it optional for a future member added
// without one yet) renders as plain text instead of a dead link. Only
// the underline/hover/focus styling lives here — size and colour come
// from the surrounding text (a plain <a> inherits both once Tailwind's
// preflight clears the browser's default link styling), so the same
// component reads correctly at the head's larger size and the list's
// smaller one without needing its own font classes.
function PersonName({ person }: { person: (typeof members)[number] }) {
  if (!person.profileUrl) return <>{person.name}</>;
  return (
    <a
      href={person.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="underline decoration-ink-500 underline-offset-4 transition-colors hover:decoration-ink-000 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-000"
    >
      {person.name}
    </a>
  );
}

export function Team() {
  return (
    <section id="team" aria-label="Team" className="scroll-mt-24 py-16 md:py-20">
      <Container>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-000 md:text-4xl">
          Team
        </h2>

        {/* Head's name was text-base sm:text-lg while every member
            below was a flat text-base — a size bump with no
            equivalent on the list it's meant to read alongside (site
            owner's font-consistency pass, 2026-09-20). Flat text-base
            on both now; the head still reads as distinct through
            layout (alone in its own column) and the role beside it,
            not through being a different font size. */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[1fr_2fr] md:gap-16">
          <p className="font-body text-base text-ink-000">
            <PersonName person={head} />
            <span className="ml-2 font-body text-sm italic text-ink-300">{head.role}</span>
          </p>

          <ul className="flex flex-col gap-1.5">
            {members.map((person) => (
              <li key={person.slug} className="font-body text-base text-ink-100">
                <PersonName person={person} />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
