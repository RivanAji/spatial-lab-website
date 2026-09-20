// Avatars fall back to initials when no permitted photo exists; linked avatars point to the person's research profile.
import Image from "next/image";
import { assetPath } from "@/lib/asset-path";
import type { Person } from "@/lib/content/types";
import { cn } from "@/lib/cn";

const SIZES = {
  sm: "h-8 w-8 text-[10px]",
  md: "h-11 w-11 text-xs",
  // Timeline cards use a larger avatar for contributor visibility.
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
        // Top-bias portrait crops so faces remain visible in circular frames.
        <Image
          src={assetPath(person.photo)}
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
