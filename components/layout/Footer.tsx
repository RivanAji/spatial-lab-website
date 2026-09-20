import { Container } from "@/components/ui/Container";
import { FooterMapBackdrop } from "./FooterMapBackdrop";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-ink-600 py-20 md:py-28">
      <FooterMapBackdrop />

      <Container className="relative flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-start gap-3">
            <span className="font-display text-xl font-bold tracking-tight text-ink-000 md:text-2xl">
              TSAL
            </span>
            <p className="font-body text-[11px] leading-snug text-ink-300">
              Transportation and
              <br />
              Spatial Analysis Lab
            </p>
          </div>
          <p className="mt-3 font-body text-xs text-ink-300">
            Urban and Regional Planning
            <br />
            Department - ITS
          </p>
        </div>

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
                className="inline-block py-2 -my-2 transition-colors hover:text-ink-000"
              >
                pwkitslabkom@gmail.com
              </a>
            </p>
            <p>
              <a href="tel:+62315922425" className="inline-block py-2 -my-2 transition-colors hover:text-ink-000">
                (031) 5922425
              </a>
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
