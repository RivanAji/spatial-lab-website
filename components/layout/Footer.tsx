import { Container } from "@/components/ui/Container";

// Rebuilt 2026-09-19, site owner's direct request, three changes at once:
//
// 1. Brand name now matches the Hero's own treatment exactly — font
//    family, weight and case (font-display, semibold, tracking-tight,
//    title case, no uppercase transform), and the same word order the
//    hero H1 and the TSAL acronym use ("Transportation & Spatial
//    Analysis Laboratory", not the reversed "Spatial Analysis &
//    Transportation" this footer had been carrying since launch — a
//    pre-existing mismatch with the hero, not something new).
// 2. The secondary nav (Research / People / Publications / Products)
//    is gone — Research was the only one with a real destination
//    (`#research`, since ResearchArchive.tsx's removal); the other
//    three were dead links to routes that don't exist, and a footer nav
//    that's mostly dead links is worse than no nav (this project's "no
//    dead navigation" rule).
// 3. Real identity block, sourced from the department's own site
//    (pwk.its.ac.id) and cross-checked against its Google Maps listing
//    (same phone number, and GPS coordinates matching the hero
//    locator's own -7.2796/112.7941) rather than the placeholder
//    "Surabaya, Indonesia" line this used to carry — PRD 6.6's "no
//    invented content" rule cuts both ways: a real address is exactly
//    what belongs here, not a vaguer stand-in for one.
export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-ink-600 py-16">
      {/* Giant "TSAL" wordmark, bleeding off the bottom edge — decorative
          only (aria-hidden, no text content lost to assistive tech: the
          full name and acronym are both spelled out in the real content
          below). Kept to the monochrome single-neutral-emphasis rule
          (PRD 6.2) via a very low white opacity rather than any tint,
          so it reads as texture/identity, not a second competing
          headline. */}
      <p
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[-0.22em] select-none text-center font-display text-[clamp(5rem,22vw,14rem)] font-bold leading-none tracking-tight text-white/[0.05]"
      >
        TSAL
      </p>

      <Container className="relative">
        <div>
          <p className="font-display text-xl font-semibold tracking-tight text-ink-000">
            Transportation &amp; Spatial Analysis Laboratory
          </p>
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.08em] text-ink-300">
            TSAL — Departemen Perencanaan Wilayah dan Kota, ITS
          </p>

          <div className="mt-5 flex flex-col gap-1 font-body text-sm text-ink-300">
            <p>Jalan Raya ITS, Kampus ITS Sukolilo</p>
            <p>Keputih, Kec. Sukolilo, Surabaya, Jawa Timur 60111</p>
            <p className="mt-2">
              <a
                href="mailto:pwk@its.ac.id"
                className="transition-colors hover:text-ink-000"
              >
                pwk@its.ac.id
              </a>
              <span aria-hidden="true"> · </span>
              <a href="tel:+62315922425" className="transition-colors hover:text-ink-000">
                (031) 5922425
              </a>
            </p>
          </div>
        </div>

        <p className="mt-16 font-mono text-xs text-ink-300">
          © {new Date().getFullYear()} Transportation &amp; Spatial Analysis
          Laboratory
        </p>
      </Container>
    </footer>
  );
}
