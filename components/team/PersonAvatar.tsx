// Added 2026-09-20 for the new team detail page (app/research/[team]/
// page.tsx) — the first place this site renders an actual person photo.
// Person.photo has existed on the type since the very first team roster
// (lib/content/people.ts) but stayed unset for everyone: reuse
// permission for the ITS-hosted portraits was an open item, so every
// member rendered as an initials block (PRD 7.7) instead. That's still
// true for most of the team; this component is what makes the
// difference visible per-person rather than site-wide, once a real
// photo exists (Nursakti Adhi Pratomoatmojo's, sent directly by the
// site owner this same day, is the first).
//
// Circular (site owner: "menurut saya dibuat lingkaran akan proper
// fotonya"), and always a link to the person's own research-profile
// page — an avatar with nothing behind it would be exactly the kind of
// decorative-looking-but-dead control this project avoids (PRD 6.6 "no
// dead navigation"); a person with no profileUrl on file renders the
// same circle without the link instead.
import Image from "next/image";
import type { Person } from "@/lib/content/types";
import { cn } from "@/lib/cn";

const SIZES = {
  sm: "h-8 w-8 text-[10px]",
  md: "h-11 w-11 text-xs",
  // Roughly double `sm` (site owner, 2026-09-20, on the team timeline
  // cards specifically: "fotonya tetep lingkaran tapi agar besar
  // dikit... mungkin 2x lipat lebih besar dari ukuran yang sekarang" —
  // the "sekarang" being the sm size those cards used before).
  lg: "h-16 w-16 text-base",
} as const;

const IMAGE_SIZES: Record<keyof typeof SIZES, string> = {
  sm: "32px",
  md: "44px",
  lg: "64px",
};

function initials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return `${first}${last}`.toUpperCase();
}

function Circle({ person, size }: { person: Person; size: keyof typeof SIZES }) {
  return (
    <span
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-ink-700 font-mono font-medium text-ink-300",
        SIZES[size],
      )}
    >
      {person.photo ? (
        // object-top, not the object-cover default centre crop: a
        // circular crop of a portrait photo centred by height cuts
        // straight through the face on anything taller than a tight
        // headshot (site owner, specifically about this: "posisinya
        // muka/wajanya terlihat jangan sampai ter crop") — biasing
        // toward the top keeps the face in frame for the standing
        // portrait this site actually has, and is still a reasonable
        // default for any future close headshot (top-biased and
        // centred agree when the face already fills the top).
        <Image
          src={person.photo}
          alt=""
          fill
          sizes={IMAGE_SIZES[size]}
          className="object-cover object-top"
        />
      ) : (
        initials(person.name)
      )}
    </span>
  );
}

export function PersonAvatar({
  person,
  size = "md",
}: {
  person: Person;
  size?: keyof typeof SIZES;
}) {
  if (!person.profileUrl) return <Circle person={person} size={size} />;
  return (
    <a
      href={person.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={person.name}
      title={person.name}
      className="rounded-full transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-000"
    >
      <Circle person={person} size={size} />
    </a>
  );
}
