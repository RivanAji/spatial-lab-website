import { Button, Card, Container, FilterChip, Hairline } from "@/components/ui";

// Review-only route (PRD Phase 2). Not linked from the production nav —
// reached directly at /styleguide during development and design review.
export const metadata = { robots: { index: false, follow: false } };

const swatches: Array<{ name: string; hex: string; note: string }> = [
  { name: "ink-900", hex: "#08090B", note: "page ground" },
  { name: "ink-800", hex: "#0D0F14", note: "raised surface" },
  { name: "ink-700", hex: "#141821", note: "card / panel" },
  { name: "ink-500", hex: "#2A313B", note: "hairline" },
  { name: "ink-300", hex: "#8A929C", note: "muted text, 6.33:1 on ink-900" },
  { name: "ink-100", hex: "#E8EBEF", note: "body text, 16.66:1 on ink-900" },
  { name: "ink-000", hex: "#F7F9FB", note: "display text, 18.87:1 on ink-900 — now also the accent" },
];

// The former blue-* ramp (brand navy/royal + a derived interactive pair)
// is kept defined in globals.css but unused since the monochrome pivot
// (2026-09-19) — listed here for reference, not as active tokens.
const retiredSwatches: Array<{ name: string; hex: string; note: string }> = [
  { name: "blue-800", hex: "#273669", note: "brand navy, exact — unused" },
  { name: "blue-600", hex: "#445EA5", note: "brand royal, exact — unused" },
  { name: "blue-400", hex: "#5B78BE", note: "derived interactive text — unused" },
  { name: "blue-300", hex: "#7E97DC", note: "derived hover / focus — unused" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-12">
      <h2 className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-ink-300">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function StyleguidePage() {
  return (
    <main className="min-h-[100dvh] pb-24">
      <Container>
        <div className="py-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-300">
            PRD section 6, internal review
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-ink-000">
            Design system
          </h1>
        </div>

        <Hairline />

        <Section title="Colour (PRD 6.2)">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {swatches.map((s) => (
              <div key={s.name} className="rounded-panel border border-ink-500">
                <div
                  className="h-20 rounded-t-panel"
                  style={{ backgroundColor: s.hex }}
                  aria-hidden="true"
                />
                <div className="p-3">
                  <p className="font-mono text-xs text-ink-100">{s.name}</p>
                  <p className="font-mono text-xs text-ink-300">{s.hex}</p>
                  <p className="mt-1 text-xs text-ink-300">{s.note}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-ink-300">
            Full contrast table checked automatically: <code className="font-mono text-ink-100">npm run check:contrast</code>
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {retiredSwatches.map((s) => (
              <div key={s.name} className="rounded-panel border border-ink-600 opacity-50">
                <div className="h-20 rounded-t-panel" style={{ backgroundColor: s.hex }} aria-hidden="true" />
                <div className="p-3">
                  <p className="font-mono text-xs text-ink-100">{s.name}</p>
                  <p className="font-mono text-xs text-ink-300">{s.hex}</p>
                  <p className="mt-1 text-xs text-ink-300">{s.note}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Hairline />

        <Section title="Typography (PRD 6.3)">
          <div className="flex flex-col gap-6">
            <div>
              <p className="mb-2 font-mono text-xs text-ink-300">Sans / Geist 600 (font-display, font-body)</p>
              <p className="font-display text-5xl font-semibold leading-[1.05] text-ink-000">
                Spatial Analysis &amp; Transportation
              </p>
            </div>
            <div>
              <p className="mb-2 font-mono text-xs text-ink-300">Sans / Geist 400 (font-body)</p>
              <p className="max-w-[40ch] font-body text-lg leading-relaxed text-ink-100">
                Exploring cities through space, mobility, data and intelligent systems.
              </p>
            </div>
            <div>
              <p className="mb-2 font-mono text-xs text-ink-300">Serif / Fraunces 500 (font-serif) — selective use only, see Research Archive</p>
              <p className="font-serif text-4xl font-medium leading-[1.05] text-ink-000">
                Research archive
              </p>
            </div>
            <div>
              <p className="mb-2 font-mono text-xs text-ink-300">Mono / Geist Mono 500</p>
              <p className="font-mono text-sm tracking-wide text-ink-100">
                07°15&apos;S / 112°45&apos;E, SURABAYA, 2026
              </p>
            </div>
          </div>
        </Section>

        <Hairline />

        <Section title="Buttons">
          <div className="flex flex-wrap items-center gap-4">
            <Button href="#">Explore Research</Button>
            <Button variant="secondary" href="#">
              Secondary action
            </Button>
          </div>
        </Section>

        <Hairline />

        <Section title="Filter chips">
          <div className="flex flex-wrap gap-3">
            <FilterChip active>All</FilterChip>
            <FilterChip>01 Transport</FilterChip>
            <FilterChip>02 Data Science &amp; AI</FilterChip>
            <FilterChip>03 Decision &amp; Climate</FilterChip>
          </div>
        </Section>

        <Hairline />

        <Section title="Card">
          <Card className="max-w-sm p-6">
            <p className="font-mono text-xs text-ink-300">Urban Analytics · 2026</p>
            <p className="mt-2 font-display text-xl font-semibold text-ink-000">
              Urban Expansion Analysis
            </p>
            <p className="mt-2 text-sm text-ink-300">Malang Raya</p>
          </Card>
        </Section>
      </Container>
    </main>
  );
}
