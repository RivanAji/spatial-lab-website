"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { assetPath } from "@/lib/asset-path";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "motion/react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { teams } from "@/lib/content/teams";
import { publications } from "@/lib/content/publications";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { YearFilterMenu } from "@/components/ui/YearFilterMenu";
import { TEAM_SCENES, type SceneProps } from "@/components/sections/TeamScenes";
import { cn } from "@/lib/cn";

const EASE = [0.22, 1, 0.36, 1] as const;

export function PublicationsShowcase(): ReactNode {
  const [activeYear, setActiveYear] = useState<string>("all");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const reducedMotion = useReducedMotion();
  const autoDrift = !reducedMotion;
  const interactingRef = useRef(false);
  const pauseUntilRef = useRef(0);

  const years = useMemo(
    () => Array.from(new Set(publications.map((p) => p.year))).sort((a, b) => b - a),
    [],
  );

  const filtered = useMemo(
    () =>
      publications
        .filter((p) => activeYear === "all" || String(p.year) === activeYear)
        .sort((a, b) => b.year - a.year),
    [activeYear],
  );

  function updateScrollButtons() {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollPrev(el.scrollLeft > 4);
    setCanScrollNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }

  // Batch geometry reads before writes to avoid layout thrashing.
  function updateCoverflow() {
    const el = scrollerRef.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>("[data-coverflow-card]");
    if (reducedMotion) {
      cards.forEach((card) => {
        card.style.transform = "";
        card.style.opacity = "";
      });
      return;
    }

    const containerRect = el.getBoundingClientRect();
    const centerX = containerRect.left + containerRect.width / 2;
    const halfWidth = containerRect.width / 2 || 1;

    const reads: { card: HTMLElement; distance: number }[] = [];
    cards.forEach((card) => {
      const r = card.getBoundingClientRect();
      reads.push({ card, distance: Math.abs(r.left + r.width / 2 - centerX) });
    });

    for (const { card, distance } of reads) {
      const t = Math.min(distance / halfWidth, 1);
      const scale = 1.08 - t * 0.22;
      const opacity = 1 - t * 0.55;
      card.style.transform = `scale(${scale.toFixed(3)})`;
      card.style.opacity = opacity.toFixed(3);
    }
  }

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: 0 });
    updateScrollButtons();
    requestAnimationFrame(updateCoverflow);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeYear]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => updateCoverflow());
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  // A measured rAF loop preserves native scrolling and avoids duplicated cards.
  useEffect(() => {
    if (!autoDrift) return;
    const el = scrollerRef.current;
    if (!el) return;

    const SPEED_PX_PER_SEC = 26;
    let raf = 0;
    let last = performance.now();
    // Keep sub-pixel position outside scrollLeft because browsers may round writes.
    let pos = el.scrollLeft;
    let direction: 1 | -1 = 1;

    function tick(now: number) {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(now - last, 100);
      last = now;

      const max = el!.scrollWidth - el!.clientWidth;
      if (max <= 4) return;

      const paused = interactingRef.current || now < pauseUntilRef.current;
      if (paused) {
        pos = el!.scrollLeft;
        return;
      }

      pos += (direction * SPEED_PX_PER_SEC * dt) / 1000;
      if (pos >= max) {
        pos = max;
        direction = -1;
      } else if (pos <= 0) {
        pos = 0;
        direction = 1;
      }
      el!.scrollLeft = pos;
      updateCoverflow();
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoDrift, filtered.length]);

  function scrollByPage(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    pauseUntilRef.current = performance.now() + 700;
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: "smooth" });
  }

  return (
    <section id="research" aria-label="Publications" className="scroll-mt-24 pb-8 pt-2 md:pb-10 md:pt-4">
      <Container>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {teams.map((team, index) => (
            <TeamFilterCard key={team.slug} team={team} Scene={TEAM_SCENES[index]} />
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <YearFilterMenu years={years} activeYear={activeYear} onChange={setActiveYear} />

          {filtered.length > 0 && (
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Scroll publications left"
                disabled={!canScrollPrev}
                onClick={() => scrollByPage(-1)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-500 md:h-8 md:w-8 text-ink-100 transition-colors hover:border-ink-000 hover:text-ink-000 disabled:opacity-30 disabled:hover:border-ink-500 disabled:hover:text-ink-100"
              >
                <CaretLeft size={13} weight="bold" />
              </button>
              <button
                type="button"
                aria-label="Scroll publications right"
                disabled={!canScrollNext}
                onClick={() => scrollByPage(1)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-500 md:h-8 md:w-8 text-ink-100 transition-colors hover:border-ink-000 hover:text-ink-000 disabled:opacity-30 disabled:hover:border-ink-500 disabled:hover:text-ink-100"
              >
                <CaretRight size={13} weight="bold" />
              </button>
            </div>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-8 flex flex-col items-start gap-4 border border-ink-500 p-10">
            <p className="font-body text-ink-100">No publications match this year yet.</p>
            <Button variant="secondary" onClick={() => setActiveYear("all")}>
              Reset filter
            </Button>
          </div>
        ) : (
          <div className="mt-8 rounded-4xl border border-white/8 bg-ink-900 p-4 md:p-6">
            <div
              ref={scrollerRef}
              onScroll={() => {
                updateScrollButtons();
                updateCoverflow();
              }}
              onMouseEnter={() => {
                interactingRef.current = true;
              }}
              onMouseLeave={() => {
                interactingRef.current = false;
              }}
              onFocus={() => {
                interactingRef.current = true;
              }}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  interactingRef.current = false;
                }
              }}
              onPointerDown={() => {
                interactingRef.current = true;
              }}
              onPointerUp={() => {
                interactingRef.current = false;
                pauseUntilRef.current = performance.now() + 600;
              }}
              onPointerCancel={() => {
                interactingRef.current = false;
                pauseUntilRef.current = performance.now() + 600;
              }}
              style={{
                maskImage:
                  "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
              }}
              className="flex items-center gap-5 overflow-x-auto py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {filtered.map((pub) => (
                <PublicationCard key={pub.slug} publication={pub} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}

function PublicationCard({ publication }: { publication: (typeof publications)[number] }) {
  const href = publication.url ?? (publication.doi ? `https://doi.org/${publication.doi}` : undefined);
  const className =
    "group flex w-36 flex-shrink-0 flex-col gap-2 [will-change:transform,opacity] sm:w-40 lg:w-[190px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-000";
  const content = (
    <>
      <div className="rounded-4xl border border-white/8 bg-ink-900 p-1.5 transition-colors group-hover:border-white/20">
        <div className="relative aspect-square overflow-hidden rounded-[1.4rem] bg-ink-800">
          {publication.coverImage && (
            <Image
          src={assetPath(publication.coverImage)}
              alt=""
              fill
              sizes="190px"
              className="object-cover"
            />
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-900 via-ink-900/75 to-transparent px-2 pb-1.5 pt-5 backdrop-blur-[1.5px]">
            <h3 className="line-clamp-1 font-display text-[11px] font-semibold leading-snug text-ink-000">
              {publication.title}
            </h3>
          </div>
        </div>
      </div>

      <div className="flex items-baseline gap-1.5">
        <p className="shrink-0 font-mono text-[10px] text-ink-300">{publication.year}</p>
        <p className="line-clamp-1 font-body text-[10px] text-ink-300">{publication.authors}</p>
      </div>
    </>
  );

  if (!href) {
    return (
      <article data-coverflow-card="" className={className}>
        {content}
      </article>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-coverflow-card=""
      className={className}
    >
      {content}
    </a>
  );
}

function TeamFilterCard({
  team,
  Scene,
}: {
  team: (typeof teams)[number];
  Scene: (props: SceneProps) => ReactNode;
}): ReactNode {
  const [hovered, setHovered] = useState(false);
  // Starts true so the first paint matches the server's. Both branches
  // render the scene collapsed anyway, so correcting this after mount
  // changes nothing on screen.
  const [canHover, setCanHover] = useState(true);
  const reducedMotion = useReducedMotion();
  const glowRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const inView = useInView(cardRef, { amount: 0.55 });

  useEffect(() => {
    const query = window.matchMedia("(hover: hover)");
    const sync = () => setCanHover(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const revealed = hovered;
  // A touch device never fires hover, so the scene would otherwise be
  // dead weight on a phone: there it plays when the card scrolls in.
  const sceneShown = canHover ? hovered : inView;

  function handlePointerMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    glowRef.current?.style.setProperty("--mx", `${px}px`);
    glowRef.current?.style.setProperty("--my", `${py}px`);

    if (parallaxRef.current && !reducedMotion) {
      const nx = px / rect.width - 0.5;
      const ny = py / rect.height - 0.5;
      parallaxRef.current.style.transform = `translate3d(${nx * 10}px, ${ny * 8}px, 0)`;
    }
  }

  function handleLeave() {
    setHovered(false);
    if (parallaxRef.current) parallaxRef.current.style.transform = "translate3d(0,0,0)";
  }

  return (
    <Link
      ref={cardRef}
      href={`/research/${team.slug}/`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      onMouseMove={handlePointerMove}
      onFocus={() => setHovered(true)}
      onBlur={handleLeave}
      className={cn(
        "relative block h-32 w-full cursor-pointer overflow-hidden rounded-4xl border border-white/8 bg-ink-900 text-left transition-[border-color] duration-300 hover:border-ink-000 hover:bg-white/4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-000",
      )}
    >
      {/* Text column. The scene sits to its right at every width, so the
          two never overlap and nothing has to reflow on hover. */}
      <div className="absolute inset-y-0 left-0 right-[7rem] sm:right-[5.5rem] md:right-[7rem] lg:right-[8rem]">
        <motion.div
          className="absolute inset-0 flex flex-col justify-center gap-1 p-3"
          initial={false}
          animate={{ opacity: revealed ? 0 : 1 }}
          transition={{ duration: reducedMotion ? 0 : 0.25, ease: EASE }}
        >
          <p className="font-mono text-[10px] text-ink-300">
            {String(team.number).padStart(2, "0")}
          </p>
          <h3 className="font-display text-sm font-semibold leading-snug text-ink-000 sm:text-base">
            {team.name}
          </h3>
        </motion.div>

        <motion.div
          className="absolute inset-0 flex flex-col justify-center p-3"
          initial={false}
          animate={{ opacity: revealed ? 1 : 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.25, ease: EASE }}
        >
          <p className="line-clamp-4 font-body text-xs leading-snug text-ink-300">
            {team.tagline}
          </p>
        </motion.div>
      </div>

      <div
        ref={parallaxRef}
        aria-hidden="true"
        className="absolute inset-y-0 right-0 w-[7rem] p-1.5 text-ink-100 transition-transform duration-300 ease-out sm:w-[5.5rem] md:w-[7rem] lg:w-[8rem]"
      >
        <Scene shown={sceneShown} animated={!reducedMotion} />
      </div>

      <div
        ref={glowRef}
        aria-hidden="true"
        className="card-spotlight pointer-events-none rounded-4xl"
        style={{ opacity: hovered ? 1 : 0 }}
      />
    </Link>
  );
}
