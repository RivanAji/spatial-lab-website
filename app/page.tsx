// Placeholder — Phase 1 scope is the deploy pipeline, not page content.
// Real homepage sections land in Phase 4 (PRD section 9).
export default function Home() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-300">
        Phase 1 — pipeline check
      </p>
      <h1 className="font-display text-3xl font-semibold text-ink-000">
        Spatial Analysis &amp; Transportation Laboratory
      </h1>
      <p className="max-w-md font-body text-sm text-ink-300">
        If this deployed automatically after a push to main, the pipeline works.
      </p>
    </main>
  );
}
