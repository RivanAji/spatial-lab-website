import { Hero } from "@/components/hero/Hero";
import { HeroBackdrop } from "@/components/hero/HeroBackdrop";
import { PublicationsShowcase } from "@/components/sections/PublicationsShowcase";
import { Project } from "@/components/sections/Project";
import { Roadmap } from "@/components/sections/Roadmap";
import { Team } from "@/components/sections/Team";

// Homepage. Hero, Publications showcase, Footer (the last lives in the
// root layout). Publications showcase added 2026-09-19 directly under
// the hero, no hairline between them, so it reads as one continuous unit
// with the now-compact hero rather than a separate page section — that's
// what makes it reachable without a full scroll, which was the point of
// shrinking the hero in the first place.
//
// ResearchArchive.tsx removed the same day it was superseded (2026-09-19,
// site owner's direct request): its own team/year filters plus a static
// card grid duplicated exactly what PublicationsShowcase's team-filter
// cards + gallery already do above, on the same page — two filtered
// publication lists was redundant, not two different features. The
// header's "Research" nav link now points at PublicationsShowcase's
// `#research` directly (components/layout/Header.tsx) instead of the
// dead `/research` route ResearchArchive briefly stood in for.
//
// Hero and Publications share one wrapper (2026-09-19, second pass): the
// site owner's own words were that the team-card row and the publications
// slider are "juga masih bagian dari hero" (still part of the hero) —
// visually one continuous unit with the flag backdrop running behind
// both, matching how rbp-portfolio.vercel.app's own backdrop fills the
// whole first screen rather than just the headline area. `relative
// overflow-hidden` here (not on Hero's own <section> any more) is what
// lets HeroBackdrop's `absolute inset-0` size itself against the two
// sections' real combined height instead of a guessed pixel value — see
// HeroBackdrop.tsx's own comment for the fuller story of why a fixed
// height kept being wrong.
//
// The separate Research Teams section (asymmetric trio panel, PRD 7.3)
// was removed the same day per the site owner's direct request — its job
// (team identity, coordinator, publication count) had become redundant
// once the Publications showcase's own team cards carried the same
// information as an interactive filter. `#research`, the "Explore
// Research" hero CTA's scroll target (HeroCtas.tsx), moved onto the
// Publications showcase section since that's what a visitor following
// that link actually wants to land on now.
//
// Lab Roadmap (2026-09-20, site owner's correction): PRD 7.9 had this
// deferred entirely — old ITS roadmap out of scope, no real replacement
// content yet, so the reasoning was "don't ship rather than ship
// invented milestones". The site owner's actual ask was to ship the
// section itself, reachable from the nav, with an honest empty canvas
// in place of real content (components/sections/Roadmap.tsx) — "don't
// ship" and "ship an honest placeholder" both satisfy PRD 6.6's ban on
// invented content; this is the site owner choosing the second one.
//
// No Hairline between Publications and Roadmap any more (2026-09-20,
// site owner's follow-up: "garisnya mengganggu... cukup space padding
// dan margin aja") — the two sections' own vertical padding (Publications-
// Showcase's pb-16/pb-20, Roadmap's pt-16/pt-20) already reads as a
// clear break without a drawn line on top of it. Team.tsx follows the
// same no-hairline convention, for the same reason.
//
// Team (2026-09-20, site owner's request): a plain-text roster below
// Roadmap — the lab head alone on the left, the rest of the team in a
// numbered list on the right. The header's "People" nav link is
// "Team" now and points at this section's `#team` directly
// (components/layout/Header.tsx), the same same-page-anchor pattern
// Research and Roadmap already use, instead of the dead `/people`
// route it used to carry.
//
// Project (2026-09-20, site owner's request): replaces "About" in the
// nav outright, and sits directly below PublicationsShowcase's gallery
// — heading and spacing only for now, real content still to come
// (components/sections/Project.tsx). Nav order now matches document
// order top to bottom: Research, Project, Roadmap, Team.
export default function Home() {
  return (
    <main>
      <div className="relative overflow-hidden">
        <HeroBackdrop />
        <Hero />
        <PublicationsShowcase />
      </div>
      <Project />
      <Roadmap />
      <Team />
    </main>
  );
}
