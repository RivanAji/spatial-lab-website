import { Container } from "@/components/ui/Container";
import { FooterMapBackdrop } from "./FooterMapBackdrop";

// Rebuilt again 2026-09-20 (site owner's direct request), replacing the
// 2026-09-19 pass:
//
// 1. Left side is now a proper wordmark lockup instead of the full name
//    as the headline: "TSAL" itself is the large text, with the full
//    name as an explainer beside it (no parentheses — the site owner's
//    follow-up dropped those — sized closer to TSAL's own scale
//    instead of a tiny disconnected caption, so the pairing reads as
//    one deliberate lockup rather than a label bolted onto a
//    logotype). The department affiliation line sits below in a
//    lighter tone, with its own explicit line break rather than
//    whatever width happens to wrap it.
// 2. Right side gained a country + postal-code line (postal code folded
//    onto the end of the address itself, not its own line — a site
//    owner follow-up) and swapped the department's general address
//    (pwk@its.ac.id) for the lab's own (pwkitslabkom@gmail.com) — the
//    site owner's own contact details, not a guess. The page-wide
//    copyright line this used to end with is gone outright (another
//    site owner follow-up), not just moved. Every multi-word line on
//    this side breaks at an explicit, chosen point (site owner: "atur
//    kapan harus enter agar rapi") instead of an arbitrary browser
//    wrap, which reads especially ragged on right-aligned text.
// 3. The flat "TSAL" watermark text is gone, replaced by
//    FooterMapBackdrop — the same ASCII character-grid map technique
//    as the hero, filling the section behind the content instead of
//    one static word.
// Vertical padding widened 2026-09-20 (site owner: "kasih space
// padding yang agak luas... biar tidak terlalu sempit") from a flat
// py-16 to a responsive py-20/py-28 — noticeably more breathing room
// top and bottom, matching how other sections on this page (Hero,
// Roadmap) step their own padding up at `md` rather than staying flat
// across every viewport.
export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-ink-600 py-20 md:py-28">
      <FooterMapBackdrop />

      <Container className="relative flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div>
          {/* TSAL's own size history, 2026-09-20: text-4xl/5xl ->
              text-2xl/3xl (first pass, "terlalu besar") -> text-lg/xl
              (second pass, "konsisten dengan ukuran teks team", after
              Team.tsx's own text dropped to text-sm) -> text-xl/2xl
              now (fourth pass: "perbesar 2pt font TSAL nya" — the only
              increase in this whole run of otherwise-shrinking
              passes, so it's a deliberate small bump back up, not a
              reversal of the size-down work around it). */}
          <div className="flex items-start gap-3">
            <span className="font-display text-xl font-bold tracking-tight text-ink-000 md:text-2xl">
              TSAL
            </span>
            {/* Third size-down pass (site owner, same day: "...masih
                terlalu besar, coba kecilin" naming this line plus the
                department/address/email/phone below it) — text-xs/sm
                (12/14px) -> a flat text-[11px], dropping the md bump
                too. Realignment against TSAL follows below. */}
            <p className="font-body text-[11px] leading-snug text-ink-300">
              Transportation and
              <br />
              Spatial Analysis Lab
            </p>
          </div>
          {/* text-ink-300 at full opacity, not a lighter/60 variant:
              checked the math (rgba blend against ink-900 lands at
              ~2.9:1, well under WCAG AA's 4.5:1 for body text) —
              ink-300 on its own already reads as the muted line next
              to the bright ink-000 "TSAL" above it without needing to
              go below a passing contrast ratio to get there. Sized
              down with the rest of this third pass, text-sm -> text-xs. */}
          <p className="mt-3 font-body text-xs text-ink-300">
            Urban and Regional Planning
            <br />
            Department - ITS
          </p>
        </div>

        {/* Address/email/phone: text-sm -> text-xs, same third-pass
            request as the explainer and department line above. */}
        <div className="flex flex-col gap-1 font-body text-xs text-ink-300 md:items-end md:text-right">
          <p>
            Jalan Raya ITS, Kampus ITS Sukolilo,
            <br />
            Surabaya, Jawa Timur, Indonesia 60111
          </p>

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
        </div>
      </Container>
    </footer>
  );
}
