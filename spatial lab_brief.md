# Spatial Analysis & Transportation Laboratory — Website Brief (v2)

## 1. Project Overview

This website is designed as the main landing page for the **Spatial Analysis and Transportation Laboratory**.

Design direction:

- Minimalist
- Contemporary
- Spatial / geospatial-oriented
- Research-driven
- Visual-heavy, but should not feel like a GIS dashboard
- Academic, but not rigid like a conventional institutional website
- Uses motion and spatial visualization as its core identity

Primary reference for hero interaction:

- Content Architecture — https://www.contentarchitecture.dev/#features

Reference for research archive approach:

- MIT Senseable City Lab
- Felt
- Vizzuality
- Development Seed
- Foursquare Spatial Studio

---

# 2. Main Landing Page Structure

The landing page consists of:

1. Hero
2. Research Groups
3. Research Archive
4. Lab Roadmap
5. Footer

Keep additional sections minimal so the page stays clean and focused.

---

# 3. Hero Section

## 3.1 Main Concept

The hero uses a **map of Asia** as its main visual.

Geographic hierarchy:

- Asia as the main spatial context
- Indonesia highlighted
- Surabaya marked with a locator / scanning effect as the lab's primary location

No long zoom animation from Asia → Indonesia → Surabaya is needed.

All geographic information should be visible at once, in a single composition.

---

## 3.2 Visual Direction

The map should be minimal — not styled like Google Maps or a WebGIS tool.

**Rendering style: ASCII / character-matrix**, following the treatment used in The Content Architecture's showcase (https://www.contentarchitecture.dev/#showcase). Instead of smooth vector shapes, the map geometry is rendered as a grid of monospace characters (`.`, `:`, `+`, `#`, digits, coordinate glyphs), with character density/weight mapped to "brightness" — denser characters where the shape is (coastlines, borders, the highlighted country/city), sparser characters fading into the background noise. This reinforces the "technical interface / terminal" identity already targeted for the hero, and gives Section 3.3's interactions (pulse, scan, resolve) a natural visual language to animate.

A thin layer of ambient ASCII noise (randomized low-contrast characters, slowly drifting or flickering) can sit behind/around the map as page texture — subtle, not distracting, similar to the dark background texture on contentarchitecture.dev.

Elements used:

- Asia outline (as ASCII character density map)
- Indonesia highlight
- Surabaya locator
- Latitude / longitude lines
- Grid
- Node
- Scan line
- Concentric pulse
- Thin technical annotation
- Subtle particles
- Minimal animated flow

Simple visual example:

```text
                               ASIA

                      ─────────────────

                           INDONESIA
                               ◉
                            SURABAYA

                         ╱─────────╲
                        │   ◉       │
                        │ ───────   │
                        │    │      │
                        ╲───────────╱

                   07°15'S / 112°45'E
```

Surabaya is the focal point of the entire hero.

---

## 3.3 Interaction

The hero avoids cyberpunk or excessive neon effects.

Motion direction:

- subtle
- scientific
- spatial intelligence
- technical interface
- slow and controlled

Note: "slow and controlled" applies to on-screen elements (pulse, scan, particles, subtle parallax) — **not** to camera/viewport movement. There is no camera zoom or pan sequence; the composition is static and all motion happens within individual elements.

Possible interactions:

### Mouse Movement

- slight parallax on the Asia map
- subtle movement on the grid
- Surabaya locator stays as the anchor point

### Surabaya Locator

Effects:

- pulse
- scan
- radial circle
- crosshair
- thin coordinate label

### Indonesia

Indonesia can be rendered slightly brighter than other Asian countries — in the ASCII rendering, this means denser/heavier characters for Indonesia's shape versus lighter, sparser characters for the rest of Asia.

### ASCII Resolve Effect

Borrowed directly from the showcase reference: elements can sit in a "noisy/unresolved" ASCII state by default, then resolve into a sharper, denser character pattern (or reveal a cleaner underlying shape) on hover or on a slow ambient cycle. Suggested use:

- Surabaya locator: resolves from scattered noise into a clean crosshair + coordinate label on load, then idles with pulse/scan.
- Indonesia outline: slightly resolves/sharpens on hover, reinforcing it as the focal country within Asia.
- Should stay subtle and slow (matching Section 3.3's "slow and controlled" direction) — this is a technical/scientific reveal, not a flashy glitch effect.

---

## 3.4 Hero Content

Example:

```text
SPATIAL ANALYSIS &
TRANSPORTATION LABORATORY

Exploring cities through
space, mobility, data
and intelligent systems.
```

Keep CTAs minimal.

Possible CTA:

```text
Explore Research
```

---

# 4. Research Groups

Research Groups are placed directly after the Hero.

There are three main groups:

```text
01 Sustainable Transport
02 Urban Analytics
03 Decision Support System
```

Each research group links to its own dedicated page.

URLs:

```text
/research/sustainable-transport
/research/urban-analytics
/research/decision-support-system
```

---

# 5. Research Group Presentation

On the homepage, each research group only shows a brief overview.

## 5.1 Sustainable Transport

Focus:

- Sustainable Mobility
- Public Transportation
- Accessibility
- Transport Network
- Travel Behaviour
- Mobility Analytics
- Low-Carbon Transport

Homepage example:

```text
01

SUSTAINABLE
TRANSPORT

Understanding sustainable urban mobility,
transport networks, accessibility,
and movement systems.

Explore Research →
```

---

## 5.2 Urban Analytics

Focus:

- Spatial Analysis
- Urban Dynamics
- Remote Sensing
- GIS
- Spatial Statistics
- GeoAI
- Urban Modelling
- Urban Growth

Example:

```text
02

URBAN
ANALYTICS

Understanding cities through
spatial data, modelling,
urban dynamics and GeoAI.

Explore Research →
```

---

## 5.3 Decision Support System

Focus:

- Spatial Decision Support System
- Multi-Criteria Analysis
- Scenario Planning
- Planning Support System
- AI-assisted Planning
- Spatial Optimization
- Decision Intelligence

Example:

```text
03

DECISION
SUPPORT SYSTEM

Developing intelligent systems
for spatial planning,
scenario analysis and decision support.

Explore Research →
```

---

# 6. Research Group Detail Page

Every research group follows the same structure.

```text
Research Group Hero

↓

Overview

↓

Research Focus

↓

Research Projects

↓

Publications

↓

Research Products

↓

Members

↓

Research Archive
```

---

# 7. Research Archive

The Research Archive is the main section after Research Groups.

Purpose:

- showcase the laboratory's research journey
- act as a visual archive
- connect projects, publications, members and products
- show research continuity across years

---

## 7.1 Archive Header

```text
RESEARCH ARCHIVE
```

Filter:

```text
ALL
SUSTAINABLE TRANSPORT
URBAN ANALYTICS
DSS
```

Year filter:

```text
2026
2025
2024
2023
2022
...
```

A free-text **search field** should be added alongside the filters once the archive grows beyond a couple dozen entries — filtering by group/year alone will not scale for finding a specific project or publication by name.

---

# 8. Research Card

Research is displayed using a visual card.

Cards must have a large visual.

The visual can be:

- research photo
- field survey
- map
- GIS analysis
- dashboard
- simulation
- diagram
- network analysis
- remote sensing image
- conference
- workshop
- research product

Example:

```text
┌───────────────────────────────┐
│                               │
│       RESEARCH VISUAL         │
│                               │
│                               │
├───────────────────────────────┤
│                               │
│ Urban Expansion Analysis      │
│ Malang Raya                   │
│                               │
│ Urban Analytics · 2026        │
│                               │
└───────────────────────────────┘
```

---

# 9. Research Card Metadata

Minimal fields:

```text
Title
Year
Research Group
Short Description
Cover Image
Location
Members
Publication
Research Product
External Link
DOI
Status
Gallery
```

Optional:

```text
Partner
Funding
Research Method
Software
Dataset
Study Area
Tags
```

---

# 10. Content Management: Git-based CMS on GitHub

The website content must be manageable by non-technical staff (a lecturer and the site owner) without touching code or Git commands directly.

## 10.1 Chosen Approach

**Decap CMS**, backed directly by the GitHub repository — no external database, no separate hosted CMS service.

How it works:

```text
Editor logs into /admin (GitHub login)
     ↓
Fills a simple form (title, year, group, photo, caption, ...)
     ↓
Decap CMS commits the new content + image file to the GitHub repo
     ↓
GitHub Actions rebuilds the static site
     ↓
GitHub Pages serves the updated site (live within ~1 minute)
```

This means:

- A photo + caption uploaded through the admin form appears live on the website automatically, with no manual deployment step.
- Every content change is a Git commit — full version history and rollback come for free.
- No separate backend, database, or paid CMS subscription is needed.

## 10.2 Content Structure

Each research project, publication, product, and member profile is stored as a single structured file (Markdown + YAML frontmatter, or JSON) in the repo, matching the fields defined in Section 9.

```yaml
title: Surabaya Public Transport Accessibility
year: 2026
research_group: Sustainable Transport
location: Surabaya
status: Active

members:
  - Researcher A
  - Researcher B

publications:
  - Accessibility Analysis of Public Transport in Surabaya

products:
  - Accessibility WebGIS

cover_image:
  surabaya-accessibility.jpg
```

Once saved, the project automatically appears in:

- Homepage Research Archive
- Sustainable Transport page
- Member profile
- Publication page
- Product page
- Year filter 2026

## 10.3 Editor Roles

Only two editors are expected (the lecturer and the site owner). No multi-role permission system, approval workflow, or draft/publish states are needed at this scale — every save publishes directly.

---

# 11. Content Relationship

```text
                     RESEARCH
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ↓               ↓               ↓

 Sustainable        Urban Analytics      DSS
 Transport

        │               │               │
        └───────────────┼───────────────┘
                        ↓

                     PROJECT
                        │
       ┌────────────────┼────────────────┐
       ↓                ↓                ↓

 Publications        Products          Members

       │                │                │
       └────────────────┼────────────────┘
                        ↓

                 Research Archive
```

---

# 12. Research Archive Interaction

Recommended interaction:

### Filter by Research Group

```text
ALL
Transport
Urban Analytics
DSS
```

### Filter by Year

```text
2026
2025
2024
2023
```

### Search

Free-text search across project titles and descriptions (see Section 7.1).

### Hover

On hover:

- card slightly expands
- visual can move subtly
- title becomes more visible
- research group appears
- year appears
- cursor changes

### Click

Navigates to the research detail page.

URL example:

```text
/research-projects/surabaya-public-transport-accessibility
```

---

# 13. Lab Roadmap

The Lab Roadmap is placed after the Research Archive.

The roadmap has three tracks, one per research group.

Example:

```text
LAB RESEARCH ROADMAP


                2026           2028           2030

TRANSPORT       ●──────────────●──────────────●
                Mobility       Integrated     Sustainable
                Analysis       Transport      Mobility


URBAN           ●──────────────●──────────────●
ANALYTICS       Spatial        GeoAI          Urban
                Analysis       Modelling      Intelligence


DSS             ●──────────────●──────────────●
                GIS DSS        AI DSS         Integrated
                                               Urban DSS
```

---

# 14. Roadmap Convergence

The roadmap can converge toward a single main vision.

Example:

```text
Sustainable Transport ───────╲
                              ╲
Urban Analytics ───────────────● URBAN INTELLIGENCE
                              ╱
Decision Support System ─────╱
```

Possible future theme:

```text
Urban Intelligence
GeoAI
Digital Twin
Integrated Urban Decision Platform
```

---

# 15. Footer

The footer should be very minimal.

Example:

```text
SPATIAL ANALYSIS &
TRANSPORTATION LABORATORY

Institut Teknologi Sepuluh Nopember
Surabaya, Indonesia


Research
People
Publications
Products


Instagram
LinkedIn
YouTube


© 2026 Spatial Analysis & Transportation Laboratory
```

---

# 16. Website Information Architecture

```text
/
│
├── research
│   │
│   ├── sustainable-transport
│   ├── urban-analytics
│   └── decision-support-system
│
├── research-projects
│   └── [project-slug]
│
├── publications
│   └── [publication-slug]
│
├── products
│   └── [product-slug]
│
├── people
│   └── [member-slug]
│
├── about
│
└── roadmap
```

An **About** page has been added (see Section 16.1) — an academic lab typically needs a place for its mission, affiliation, and history that doesn't fit into the Hero or Footer.

## 16.1 About Page (New)

Minimal content:

```text
Lab mission / vision
Short history
Affiliation (Institut Teknologi Sepuluh Nopember)
Contact / how to join (for prospective students or collaborators)
```

Kept as a single simple page — not a full section on the homepage — so it doesn't compete with the Research Archive as the main homepage focus.

---

# 17. Recommended Main Navigation

Navigation should stay concise.

```text
LAB LOGO

Research
Projects
Roadmap
People
About
```

Possible secondary navigation:

```text
Publications
Products
```

---

# 18. Visual Style

## Color

Recommended:

```text
Background:
Off-white
or
Charcoal / near-black

Primary Text:
Black / White

Accent:
1 dominant color only
```

Possible accent:

- electric lime
- cyan
- orange
- transit red
- bright blue

Avoid using too many colors.

Each research group can have its own accent, but it should stay subdued.

**Accessibility note:** whichever background/text/accent combination is chosen, verify text and UI contrast against WCAG AA (4.5:1 for body text, 3:1 for large text) before finalizing — especially where accent color is used on top of charcoal or off-white backgrounds.

---

# 19. Typography

Typography direction:

- modern grotesk
- geometric sans
- high readability
- strong editorial hierarchy

The hero uses large typography.

Example:

```text
SPATIAL ANALYSIS
& TRANSPORTATION
LABORATORY
```

---

# 20. Spatial Visual Language

The website uses spatial analysis as part of its visual identity.

Possible assets:

### Spatial Analysis

```text
Raster
Polygon
Grid
Hexagon
Contour
Point Cloud
Satellite
Heatmap
```

### Transportation

```text
Network
Origin–Destination
Trajectory
Accessibility
Isochrone
Flow
Transit Line
Node
```

### Decision Support

```text
Scenario
Model
Decision Tree
MCDA
Ranking
Optimization
System Diagram
```

---

# 21. Technology Stack

## 21.1 Frontend

```text
Next.js (static export)
React
Tailwind CSS
```

## 21.2 Hero Rendering

The hero map is a **static, non-interactive composition** (Section 3.1–3.3) — it does not need panning, zooming, or real-time GIS data. A full WebGIS engine is unnecessary weight for this.

Recommended: **Canvas + GSAP**, using a simplified GeoJSON outline of Asia converted into an ASCII/character-density map (see Section 3.2), animated with GSAP for pulse/scan/particle/resolve effects.

```text
GeoJSON Asia
     ↓
Simplified Geometry
     ↓
Rasterize shape to a brightness/density grid
     ↓
Map each grid cell to a monospace character (ASCII/halftone)
     ↓
Canvas rendering (character grid, not smooth vectors)
     ↓
Indonesia Highlight (denser character weight)
     ↓
Surabaya Locator (resolves from noise → crosshair)
     ↓
GSAP Motion (pulse, scan, ASCII resolve, parallax — no camera movement)
```

Canvas is preferred over SVG here because character-grid/ASCII rendering with per-frame density changes (noise, resolve, scan line) is cheaper to redraw on a `<canvas>` than manipulating hundreds/thousands of individual SVG text nodes. Reference implementation pattern: The Content Architecture showcase (https://www.contentarchitecture.dev/#showcase) — image/shape brightness sampled into a character grid, with a noise ↔ resolved crossfade on interaction.

MapLibre GL JS and deck.gl are **not required** for the hero. Only introduce them if a future feature genuinely needs real interactive map data (e.g. an interactive project-location map elsewhere on the site with pan/zoom/many points) — evaluate that separately from the hero when it comes up.

## 21.3 Motion

```text
GSAP
Motion (Framer Motion)
```

## 21.4 Optional Advanced Visual

```text
Three.js
React Three Fiber
```

Three.js should not be used excessively, and is not needed for the hero itself.

## 21.5 Content & Hosting

```text
Content:  Decap CMS (Git-based, see Section 10)
Hosting:  GitHub Pages (static export)
CI/CD:    GitHub Actions (build + deploy on every commit)
Domain:   custom domain via GitHub Pages CNAME, free SSL
```

This keeps the entire stack — code, content, and hosting — inside GitHub, with no separate paid services, databases, or backend infrastructure to maintain. Editors never need to use Git directly; the CMS handles commits on their behalf.

Note: GitHub Pages serves static files only (no server-side runtime). This is not a limitation here, since all interactivity (map rendering, filters, animation) runs client-side in the browser.

---

# 22. Performance Principle

The website must stay lightweight.

Avoid:

- excessive 3D
- heavy shaders
- unnecessary video backgrounds
- very long intro animations
- excessive scroll hijacking

Target:

- fast first load
- smooth animation
- responsive
- mobile friendly

---

# 23. Mobile Behaviour

On mobile:

The hero map remains visible but simplified.

Example:

```text
SPATIAL ANALYSIS &
TRANSPORTATION LAB

          ASIA
            ◉
         SURABAYA

01 Sustainable Transport
02 Urban Analytics
03 DSS
```

Research cards become:

```text
1 column
```

The roadmap can switch from horizontal to vertical.

---

# 24. Final Landing Page Flow

```text
01

HERO

Spatial Analysis &
Transportation Laboratory

Asia Map
Indonesia Highlight
Surabaya Spatial Locator


↓

02

RESEARCH GROUPS

01 Sustainable Transport
02 Urban Analytics
03 Decision Support System


↓

03

RESEARCH ARCHIVE

Research Group Filter
Year Filter
Search

Visual Research Cards


↓

04

LAB ROADMAP


↓

05

FOOTER
```

---

# 25. Main Design Principle

The website should not look like:

```text
University Website
Corporate Website
GIS Dashboard
SaaS Landing Page
```

Target identity:

```text
Research Laboratory
+
Spatial Intelligence
+
Contemporary Data Visualization
+
Academic Research Archive
```

Spatial visualization must come from the laboratory's identity and actual work, not just be decorative graphics.

---

# 26. Key UX Principle

A user should understand within a few seconds:

1. What field this lab works in.
2. That the lab is based in Surabaya.
3. That there are three research groups.
4. What research has been done.
5. Where the lab's research is heading.
6. Who is involved in each research group.
7. What publications and products have been produced.

---

# 27. Core Concept

> **Space, Movement, Intelligence**

These three concepts represent:

```text
SPACE
→ Urban Analytics

MOVEMENT
→ Sustainable Transport

INTELLIGENCE
→ Decision Support System
```

The three research groups converge into one vision:

```text
URBAN INTELLIGENCE
```

---

# 28. Open Items / Recommendations for Discussion

Items worth deciding before or during implementation, surfaced during review of this brief:

- **Language toggle (EN/ID):** an academic lab publishing internationally often benefits from bilingual content. Decide whether this is in scope now or a later phase — it affects the CMS content model (single-language fields vs. per-language fields) from the start.
- **SEO metadata for publications:** publication detail pages should carry proper meta tags (title, description, structured data if feasible) to support academic discoverability and citation.
- **Image handling in the CMS workflow:** since photos are committed directly into the Git repo, plan for automatic image compression/optimization in the build step to avoid repo bloat over time as more photos are added year over year.

---

# 29. Design System & Anti-Slop Baseline (Implementation Guardrails)

This section is the design contract for whoever implements this brief. It exists because the two most common failure modes for a site like this are: (a) it drifts into a generic university/institutional template, or (b) it drifts into a generic AI-generated SaaS-landing-page template. Both are equally wrong for this brief.

## 29.1 Design Read

Reading this as: an academic spatial-analysis and transportation research lab profile site, for three audiences (prospective students/researchers, academic peers and collaborators, institutional stakeholders), with a technical-editorial, spatial-intelligence visual language. This sits closer to a research-studio portfolio than a SaaS landing page or a conventional university site. Both of those default aesthetics must be actively avoided, not accidentally defaulted into.

## 29.2 Design Dials

```text
DESIGN_VARIANCE: 6/10
MOTION_INTENSITY: 5/10
VISUAL_DENSITY:   4/10
```

- **Variance 6**: asymmetric enough to feel deliberate and contemporary, not a grid of identical boxes, but not chaotic. Academic credibility needs some restraint.
- **Motion 5**: matches the brief's own "subtle, scientific, slow and controlled" hero direction (Section 3.3). No cinematic parallax or aggressive scroll-hijacking outside the hero.
- **Density 4**: the Research Archive is data-rich but should read closer to a well-organized daily app than a GIS cockpit. No dense dashboard tables.

Mobile: every asymmetric layout collapses to a single column below 768px (Research Groups, Research Cards, Roadmap tracks going vertical, per Section 23).

## 29.3 Typography Direction

Avoid the generic Inter-everywhere combination that most AI-generated and SaaS sites default to. Equally avoid defaulting to a serif "because academic" — that is its own cliché; a research lab is not a law firm or a publishing house.

Recommended pairing:

```text
Display / Headline:  Neue Montreal, General Sans, or Söhne
                      (geometric grotesk with character, not sterile)

Body:                 Inter Tight or Public Sans
                      (neutral is a feature at body size, not display size)

Mono (coordinates,
metadata, technical
annotation):          JetBrains Mono or IBM Plex Mono
                      (ties directly into the hero's ASCII / technical
                      annotation language, Section 3.2-3.3)
```

No serif anywhere on the site by default. If a publication/abstract block ever needs visual distinction from surrounding body text, use weight or the mono family, not a serif switch.

## 29.4 Color Calibration

Sharpens Section 18. Two failure modes to avoid, not one:

- The generic AI "purple/blue glow" default. The brief already rejects this by specifying off-white/charcoal + one accent.
- The generic academic-institutional look: navy + gold ("university crest"), or the flattened all-gray enterprise-SaaS look. Both read as templated, for opposite reasons.

**Lock rule:** pick exactly one accent and use it identically everywhere it appears — hero locator pulse, primary CTA, active filter state, link hover, roadmap track markers. Do not let a research group's subdued sub-accent (Section 18) become a de facto second "real" accent by appearing more often than the main one.

Recommended accent pool (already shortlisted in Section 18): **transit red** or **electric lime** read most distinctly "transportation and spatial tech" without tipping into generic-startup blue. Cyan is the safer fallback if a warmer, higher-visibility accent doesn't fit the final visual system.

## 29.5 Section-Variety Rule

The homepage has five sections (Hero, Research Groups, Research Archive, Roadmap, Footer). Applied here:

- **Research Groups (Section 4-5):** must NOT render as three equal generic feature cards side by side — this is the single most common templated pattern. Use an asymmetric composition instead: one group larger/full-width with the other two stacked smaller, or a horizontal scroll-snap of three unequal-width panels. This should look visibly different from the Research Archive's card grid, not the same card component reused.
- **Research Archive (Section 7-9):** a uniform card grid is appropriate here since browsing many items benefits from consistency — but let the large visual (Section 8) carry the differentiation between cards, not identical shadow/radius treatment repeated with different text.
- **Roadmap (Section 13-14):** keep the horizontal timeline as specified. Do not add a matching eyebrow or a decorative "TRACK 01 / 02 / 03" numbering on top of it — the track names (TRANSPORT, URBAN ANALYTICS, DSS) are already sufficient labels on their own.

## 29.6 Eyebrow & Label Discipline

Rule of thumb: at most one small uppercase tracked label per three sections. With five main sections, that means at most one or two on the entire homepage. The brief's own "RESEARCH ARCHIVE" header (Section 7.1) is already correct as a plain heading, not a small label sitting above a bigger one — keep it that way. Do not later "enhance" it with numbering like "00 / RESEARCH ARCHIVE" or "03 · Research Archive."

## 29.7 Motion Discipline

Sharpens Section 3.3 and Section 22. Every motion effect needs a one-sentence justification:

- Hero ASCII resolve / pulse / scan: justified by storytelling (spatial data resolving into clarity, mirroring the lab's own analytical work). Keep.
- Research card hover-expand (Section 12): justified by feedback (confirms the card is clickable). Keep it subtle, roughly a 1.02 scale, not a dramatic lift.
- Roadmap: a simple scroll-reveal fade-in per track is enough (storytelling: progression left to right). Do not add scroll-hijacked horizontal panning here — the brief already explicitly rejects long zoom/scroll-hijack behavior elsewhere (Section 3.1, Section 22), and the roadmap should follow the same restraint.
- No infinite decorative loops outside the hero. One section that moves with intent is stronger than every section moving a little.

## 29.8 Image & Visual Asset Strategy

Sharpens Section 8-9. Research Card visuals must be real: actual field photos, actual GIS output, actual dashboards, diagrams, or remote-sensing imagery produced by the lab's own work. Never generic stock photography ("person pointing at a map," "generic city skyline"). If a project genuinely has no visual yet, mark it as an explicit placeholder in the CMS rather than filling the slot with unrelated stock imagery — an honest empty state reads better than a fake one.

No div-based fake dashboard mockups anywhere on the site (e.g. do not fabricate a fake "WebGIS preview" out of styled boxes for a product that has no real screenshot yet).

## 29.9 Content & Copy Discipline

Applies the brief's own plain, concrete voice (already correct in Section 5.1-5.3's example taglines) consistently going forward:

- No em-dash anywhere on the site — headlines, card captions, roadmap labels, footer. Use periods or commas.
- No filler verbs ("Elevate," "Unleash," "Revolutionize") in research group taglines or CTAs.
- No fake-precise numbers in the roadmap or anywhere else unless the figure is real and citable (do not invent "92% accuracy" for an unpublished result).
- Member names and photos (Section 6, People) must be real lab members. Never placeholder names or generic stock headshots. If a photo isn't available yet, use a plain initials avatar rather than a generic stock face.

## 29.10 Pre-Flight Checklist for This Project

Before implementation is considered ready to build from this brief:

- [ ] Hero has at most one small label (if any), headline stays within 2 lines on desktop.
- [ ] Research Groups section is not three equal generic cards; an asymmetric or scroll-snap layout is used instead.
- [ ] No decorative section-numbering added anywhere beyond the plain "01 / 02 / 03" group numerals already specified in Section 4-5, which label actual sequential groups, not a decorative counter.
- [ ] One accent color locked and used identically in the hero locator, CTAs, active filters, and roadmap markers.
- [ ] No em-dash anywhere in any copy.
- [ ] Every Research Card visual is real project imagery, never stock photography or a fabricated dashboard mockup.
- [ ] Motion budget respected: the hero carries the most motion; the Archive and Roadmap use only subtle hover/reveal, no scroll-hijacking.
- [ ] Typography avoids Inter at display size and avoids a serif switch anywhere on the site.
- [ ] Mobile collapse is explicit for Research Groups, Research Cards (1 column), and Roadmap (vertical).
