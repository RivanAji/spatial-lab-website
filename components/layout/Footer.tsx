import { Container } from "@/components/ui/Container";
import { FooterMapBackdrop } from "./FooterMapBackdrop";

// Rebuilt again 2026-09-20 (site owner's direct request), replacing the
// 2026-09-19 pass:
//
// 1. Left side is now a proper wordmark lockup instead of the full name
//    as the headline: "TSAL" itself is the large text, with the full
//    name as a small parenthetical explainer beside it (split onto two
//    lines after "and", the site owner's own wording verbatim —
//    "Transportation and Spatial Analysis Lab", not the "&"/"Laboratory"
//    phrasing used elsewhere on the page; this is a deliberately
//    different, shorter footer treatment, not an inconsistency to fix).
//    The department affiliation line sits below in a lighter tone.
// 2. Right side gained a country + postal-code line and swapped the
//    department's general address (pwk@its.ac.id) for the lab's own
//    (pwkitslabkom@gmail.com) — the site owner's own contact details,
//    not a guess. Copyright moved from a page-wide line under both
//    columns into the bottom of this column specifically, with its own
//    spacing above.
// 3. The flat "TSAL" watermark text is gone, replaced by
//    FooterMapBackdrop — the same ASCII character-grid map technique
//    as the hero, filling the section behind the content instead of
//    one static word.
export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-ink-600 py-16">
      <FooterMapBackdrop />

      <Container className="relative flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-start gap-3">
            <span className="font-display text-4xl font-bold tracking-tight text-ink-000 md:text-5xl">
              TSAL
            </span>
            <p className="mt-1.5 max-w-[9.5rem] font-body text-xs leading-snug text-ink-300">
              (Transportation and
              <br />
              Spatial Analysis Lab)
            </p>
          </div>
          {/* text-ink-300 at full opacity, not a lighter/60 variant:
              checked the math (rgba blend against ink-900 lands at
              ~2.9:1, well under WCAG AA's 4.5:1 for body text) —
              ink-300 on its own already reads as the muted line next
              to the bright ink-000 "TSAL" above it without needing to
              go below a passing contrast ratio to get there. */}
          <p className="mt-3 font-body text-sm text-ink-300">
            Urban and Regional Planning Department - ITS
          </p>
        </div>

        <div className="flex flex-col gap-1 font-body text-sm text-ink-300 md:items-end md:text-right">
          <p>Jalan Raya ITS, Kampus ITS Sukolilo, Surabaya, Jawa Timur, Indonesia</p>
          <p>60111</p>

          <div className="mt-4">
            <p>
              <a
                href="mailto:pwkitslabkom@gmail.com"
                className="transition-colors hover:text-ink-000"
              >
                pwkitslabkom@gmail.com
              </a>
            </p>
            <p>
              <a href="tel:+62315922425" className="transition-colors hover:text-ink-000">
                (031) 5922425
              </a>
            </p>
          </div>

          <p className="mt-6 font-mono text-xs text-ink-300">
            © {new Date().getFullYear()}
          </p>
        </div>
      </Container>
    </footer>
  );
}
