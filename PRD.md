# PRD - Spatial Analysis & Transportation Laboratory Website

**Status:** Draft for execution
**Owner:** Rivan Aji Wahyu Dyan Syafitri
**Organisation:** Laboratory of Transportation and Spatial Analysis, Department of Urban and Regional Planning, Institut Teknologi Sepuluh Nopember (ITS), Surabaya
**Last updated:** 2026-09-19
**Supersedes:** `spatial lab_brief.md` (that document remains the design rationale reference; this PRD is the build contract)

---

## 0. How to use this document

This PRD is written to be executed in order. Section 9 is the phased build plan. Every phase has:

- a scope statement (what gets built)
- a definition of done (what must be true to move on)
- a validation step (how it gets checked before the next phase starts)

Do not start a phase before the previous phase passes its validation. Sections 1 to 8 are the reference material that the phases draw on.

---

## 1. Product Overview

### 1.1 Problem

The laboratory's current web presence is a single page inside the ITS department WordPress site. It has the following concrete problems:

- Lecturer profiles are a flat list of names and topic keywords. No publications, no projects, no output.
- The sections that would carry the lab's actual work (`COLABORATION AND RESEARCH`, `COMMUNITY SERVICES`, `PUBLICATIONS`, `PRODUCT`) are empty headings with no content behind them.
- The roadmap on that page is outdated and is explicitly out of scope for reuse.
- Research output exists and is substantial (roughly 2,200 combined citations across the team, real software products, dozens of indexed publications), but none of it is visible or connected.
- There is no way for a prospective student, a collaborator, or a funder to understand what the lab does, who does it, and what it has produced.

### 1.2 Goals

1. Make the lab's actual research output visible and browsable in one place.
2. Communicate the lab's identity in seconds: spatial analysis and transportation, based in Surabaya, three research teams.
3. Connect projects, publications, people, and products so that one entry appears everywhere it belongs.
4. Be maintainable by two non-technical editors with no Git knowledge.
5. Cost nothing to run.

### 1.3 Non-goals

- Not a replacement for the ITS department site.
- Not a GIS dashboard or a live data portal.
- Not a course or teaching platform.
- Not a student portal or LMS.
- No reuse of the existing ITS roadmap slides.

### 1.4 Success criteria

| Criterion | Target |
|---|---|
| A visitor can state what the lab does after 5 seconds on the homepage | Verified in informal testing with 3 people outside the department |
| A new research project is published by a non-technical editor without assistance | Under 10 minutes, no help needed |
| Time from editor pressing Save to content live on the site | Under 2 minutes |
| Lighthouse Performance (mobile) | 90 or above |
| Lighthouse Accessibility | 95 or above |
| Recurring running cost | 0 |

---

## 2. Audience and user stories

### 2.1 Primary audiences

1. **Prospective students** (undergraduate final-year, master's applicants) looking for a thesis topic or a supervisor.
2. **Academic peers and collaborators** (domestic and international) evaluating the lab for joint research or a visit.
3. **Institutional stakeholders** (ITS management, funders, government partners) assessing output and impact.

### 2.2 User stories

| As a | I want to | So that |
|---|---|---|
| Prospective student | see what topics each lecturer actually works on, with real papers | I can pick a supervisor whose work matches my interest |
| Prospective student | see recent projects with pictures of the actual fieldwork and analysis | I can tell whether this lab does the kind of work I want to do |
| Academic peer | find the lab's publications grouped by theme with DOIs | I can cite them and assess research fit |
| Academic peer | see which software and methods the lab produces | I can evaluate a possible collaboration |
| Funder or partner | see the lab's output over time and its direction | I can judge whether to fund or partner |
| Lab editor (lecturer) | upload a photo and a caption and have it appear on the site | I can keep the site current without asking a developer |
| Lab editor | enter a project once and have it appear in the archive, on the group page, on member profiles, and under its year | I do not have to enter the same thing five times |

---

## 3. Content inventory (real data, collected 2026-09-19)

This is the actual content the site launches with. Sources: the ITS lab page and each member's Google Scholar profile.

### 3.1 Members

Eight lecturers. Photos exist on the ITS site and can be reused (permission to be confirmed in Phase 0).

| # | Name | Role | Stated expertise (from ITS page) | Scholar metrics | Scholar ID |
|---|---|---|---|---|---|
| 1 | Siti Nurlaela, S.T., M.Com., Ph.D. | Head of Laboratory | Urban Transportation Management; Spatial Analysis; Methods of analysis in spatial planning; Transportation management and modelling | 314 citations, h-index 8 | `BYOW-fMAAAAJ` |
| 2 | Cahyono Susetyo, S.T., M.Sc., Ph.D. | Lecturer | Evaluation and Method Development in Urban and Regional Planning; Urban Modelling and Scenario Testing; Spatial Engineering | 404 citations, h-index 12 | `NoF6s4gAAAAJ` |
| 3 | Ketut Dewi Martha Erli Handayeni, S.T., M.T. | Lecturer | Urban transportation planning and modelling; Urban infrastructure and transportation planning; Transportation modelling | 526 citations, h-index 11 | `SI7zbOsAAAAJ` |
| 4 | Nursakti Adhi Pratomoatmojo, S.T., M.Sc. | Lecturer | Urban Modelling and Scenario Testing; Transportation Modelling; Spatial modelling; Land use planning | 301 citations, h-index 10 | `bxZEsvwAAAAJ` |
| 5 | Fendy Firmansyah, S.T., M.T. | Lecturer | Spatial Analysis and Machine Learning; Spatial data analysis; Remote Sensing | 187 citations | `n5SIxGUAAAAJ` |
| 6 | Ummi Fadlilah Kurniawati, S.T., M.T., M.Sc. | Lecturer | Climate change and Sustainable modeling; Risk Management (climate change); Environmental Management | 197 citations, h-index 7 | `qB5qFscAAAAJ` |
| 7 | Anoraga Jatayu, S.T., M.Si. | Lecturer | Spatial Statistics and Modeling; Sustainable urban form modeling; Spatial econometrics | Publications in Sustainability and Land (MDPI) | to confirm |
| 8 | Rivan Aji Wahyu Dyan Syafitri, S.PWK., M.Ars. | Lecturer | Spatial Data Science; Spatial Data Mining; Spatial Data Infrastructure; Spatial Data-Driven Transport Analysis | to confirm | to confirm |
| 9 | Caesario Arif Wibowo | Lecturer (new) | To be supplied. Not yet listed on the ITS department page and no public Scholar record found as of 2026-09-19 | - | - |

Existing photo assets on the ITS site:

```
Bu-Siti-scaled.jpg              Siti Nurlaela
Pak-Ono-scaled.jpg              Cahyono Susetyo
Bu-Erli.jpg                     Ketut Dewi Martha Erli Handayeni
Pak-Sakti-scaled.jpg            Nursakti Adhi Pratomoatmojo
Pak-Fendy-scaled.jpg            Fendy Firmansyah
Bu-Ummi.jpg                     Ummi Fadlilah Kurniawati
photo_aga_pwk-copy.png          Anoraga Jatayu
photo_rivan_pwk.png             Rivan Aji Wahyu Dyan Syafitri
```

Base path: `https://www.its.ac.id/pwk/wp-content/uploads/sites/35/`

No photo exists yet for Caesario Arif Wibowo. Until one is supplied, his card renders as an initials block per 7.7.

### 3.2 Research teams (confirmed by the lab, 2026-09-19)

The lab organises into three teams. These names, coordinators, and memberships are authoritative and replace the earlier working assumption.

**Team 01 - Sustainable Urban Transportation**
Slug: `sustainable-urban-transportation`

| Member | Role |
|---|---|
| Siti Nurlaela | Coordinator |
| Ketut Dewi Martha Erli Handayeni | Member |
| Anoraga Jatayu | Member |
| Caesario Arif Wibowo | Member |

Focus: policy; planning, modelling and integration of transport, spatial and economic systems; transit-oriented development; GEDSI (gender equality, disability and social inclusion).

**Team 02 - Spatial Data Science and AI for Urban Analytics**
Slug: `spatial-data-science-ai`

| Member | Role |
|---|---|
| Nursakti Adhi Pratomoatmojo | Coordinator |
| Fendy Firmansyah | Member |
| Rivan Aji Wahyu Dyan Syafitri | Member |
| Anoraga Jatayu | Member |

Focus: machine learning, big data, and spatial data infrastructure.

**Team 03 - Decision Support and Climate Change**
Slug: `decision-support-climate`

| Member | Role |
|---|---|
| Cahyono Susetyo | Coordinator |
| Ummi Fadlilah Kurniawati | Member |
| Siti Nurlaela | Member |
| Ketut Dewi Martha Erli Handayeni | Member |
| Fendy Firmansyah | Member |

Focus: climate resilience; scenario building and policy or decision evaluation.

#### 3.2.1 Membership matrix

| Member | 01 Transport | 02 Data Science and AI | 03 Decision and Climate |
|---|---|---|---|
| Siti Nurlaela | **Coordinator** | | Member |
| Cahyono Susetyo | | | **Coordinator** |
| Ketut Dewi Martha Erli Handayeni | Member | | Member |
| Nursakti Adhi Pratomoatmojo | | **Coordinator** | |
| Fendy Firmansyah | | Member | Member |
| Ummi Fadlilah Kurniawati | | | Member |
| Anoraga Jatayu | Member | Member | |
| Rivan Aji Wahyu Dyan Syafitri | | Member | |
| Caesario Arif Wibowo | Member | | |

#### 3.2.2 Design implications

Four of nine members sit in two teams at once. This is not an edge case, it is the normal state, and it drives three decisions:

1. **No per-team accent colour.** Colour-coding teams would imply exclusive membership that does not exist. Teams are differentiated by numbering, typography, and layout instead. See 6.2.
2. **`teams` is an array on people**, with a separate `coordinator_of` field. A member card must be able to show two team affiliations without looking broken.
3. **Team names are long.** "Spatial Data Science and AI for Urban Analytics" is six words, where the earlier draft assumed short two-word names that broke cleanly onto two lines. The content model therefore carries both a `name` (full, used on the team page) and a `display_name` (short, used on the homepage and in navigation):

```
01   SUSTAINABLE URBAN TRANSPORTATION      full and display are the same
02   SPATIAL DATA SCIENCE & AI             full: ...and AI for Urban Analytics
03   DECISION SUPPORT & CLIMATE            full: Decision Support and Climate Change
```

#### 3.2.3 Naming note

The lab uses "Tim 1 / 2 / 3" internally. On the site these become `01 / 02 / 03`, which is consistent with the numbering already specified in the brief and is not decorative section numbering.

The word used for a team in the URL and in the interface is **"Research Team"**, not "Research Group", to match how the lab actually describes itself.

### 3.3 Seed publications

Launch target: at least 8 publications per team. The following are confirmed real and can be entered immediately.

Because members sit in more than one team, some publications legitimately belong to two teams. The grouping below is a starting assignment by subject matter, not an exclusive claim.

**Team 01 - Sustainable Urban Transportation**

| Year | Title | Authors | Venue | Cites |
|---|---|---|---|---|
| 2012 | Modeling household residential location choice and travel behavior and its relationship with public transport accessibility | Nurlaela, Curtis | Procedia Social and Behavioral Sciences 54 | 73 |
| 2014 | Concept of carrying capacity: Challenges in spatial planning | Handayeni, Santoso, Aulia, Ghozali | Procedia Social and Behavioral Sciences | 72 |
| 2014 | TOD best practice: Lesson learned for GHG mitigation | Handayeni | Procedia Social and Behavioral Sciences | 31 |
| 2014 | Assessing the impact of accessibility improvement on property value capitalization post Perth-Mandurah railway opening | Nurlaela, Pamungkas | Procedia Social and Behavioral Sciences 135 | 8 |
| 2020 | Evaluasi kualitas pelayanan commuter line berdasarkan perspektif gender | Nurlaela, Laia | Jurnal Teknik ITS 9(2) | 16 |
| 2020 | Impact of elevated outdoor MRT station towards passenger thermal comfort: Jakarta MRT | Nurlaela et al. | Scientific Review Engineering and Environmental Sciences | 7 |
| 2021 | Analisis faktor kecelakaan lalu lintas Surabaya berdasarkan perspektif tata ruang melalui pemodelan spasial | Nurlaela, Adlina | Jurnal Teknik ITS 10(1) | 11 |
| 2022 | Analisis Keterjangkauan Fasilitas Halte pada Koridor Ruas Jalan Kota | Larasati, Nurlaela, Susetyo | Jurnal Penelitian Transportasi Darat 24(1) | 9 |
| 2023 | TransJakarta Service Evaluation in Controlling COVID-19 Transmission Using Twitter Sentiment Analysis | Nurlaela, William | Journal of Regional and City Planning 34(2) | 4 |

**Team 02 - Spatial Data Science and AI for Urban Analytics**

| Year | Title | Authors | Venue | Cites |
|---|---|---|---|---|
| 2011 | Model kerentanan wilayah pesisir berdasarkan perubahan garis pantai dan banjir pasang | Pratomoatmojo, Marfai, Hidayatullah, Nirwansyah | - | 38 |
| 2012 | Land use change modelling under tidal flood scenario by means of Markov-Cellular Automata | Pratomoatmojo | - | 25 |
| 2014 | LanduseSim sebagai aplikasi pemodelan dan simulasi spasial perubahan penggunaan lahan | Pratomoatmojo | - | 33 |
| 2018 | LanduseSim algorithm: land use change modelling by means of cellular automata and GIS | Pratomoatmojo | IOP Conf. Series: Earth and Environmental Science | 39 |
| 2018 | LanduseSim Methods: Land use class hierarchy for simulations of multiple land use growth | Pratomoatmojo | - | 18 |
| 2020 | A Quantitative Approach to Characterizing the Changes and Managing Urban Form for Sustaining the Suburb of a Mega-Urban Region: North Cianjur | Jatayu et al. | Sustainability 12(19) | - |
| 2022 | Urban Form Dynamics and Modelling towards Sustainable Hinterland Development in North Cianjur, Jakarta-Bandung Mega-Urban Region | Jatayu et al. | Sustainability 14(2) | - |
| 2023 | Metric-Based Approach for Quantifying Urban Expansion Impact on Urban Form Changes in the JBMUR South Conurbation Corridor | Jatayu et al. | Land 12(4) | - |
| 2021 | Dampak perubahan penggunaan lahan terhadap besaran stok karbon di Kota Surabaya | Kurniawati | Jurnal Penataan Ruang | 24 |

**Team 03 - Decision Support and Climate Change**

| Year | Title | Authors | Venue | Cites |
|---|---|---|---|---|
| 2013 | Computer-mediated e-negotiation support system | Susetyo | CUPUM 2013 | - |
| 2016 | Comparison of Digital Elevation Modelling Methods for Urban Environment | Susetyo | ARPN Journal of Engineering and Applied Sciences 11(5) | 19 |
| 2016 | Problematic determination of sustainable food land policy in East Java | Kurniawati, Siswanto | Procedia Social and Behavioral Sciences | 8 |
| 2021 | Land use change trend of paddy field and its influence on food security in Gerbangkertosusila Region | Firmansyah, Susetyo, Pratomoatmojo, Kurniawati, Yusuf | IOP Conf. Series 778(1) | 16 |
| 2022 | Spatial planning concept for flood prevention in the Kedurus River watershed | Susetyo et al. | Open Geosciences | 2 |
| 2022 | The role of spatial data to support strategic environmental assessment for general spatial planning | Susetyo et al. | IOP Conf. Series | 3 |
| 2022 | Spatial analysis of health facility service coverage in handling of COVID-19 patients in Surabaya City Settlement | Susetyo et al. | IOP Conf. Series | 2 |
| 2020 | Carrying capacity and environmental capacity analysis based on ecosystem services in Surabaya | Pratomoatmojo, Firmansyah, Umilia, Yusuf | - | 10 |
| 2026 | Integration of photogrammetry data and 3D modelling GIS for analyzing spatial utilization intensity, Jambi City | Susetyo et al. | BIO Web of Conferences | - |

Note: "Orthogonal strategy-based computer-mediated negotiation: Principles and example" by Susetyo appears in *Environment and Planning B: Urban Analytics and City Science*. Year and volume still to be confirmed.

### 3.4 Research products

| Product | Owner | Description | Status |
|---|---|---|---|
| **LanduseSim** | Nursakti Adhi Pratomoatmojo | Land use change modelling and simulation software using cellular automata and GIS. Backed by at least three indexed publications (2014, 2018 algorithm paper, 2018 methods paper). | Real, established. Needs a product page with screenshots, download or access link, and citation guidance. |

This is currently the only confirmed lab software product. Additional products, datasets, and WebGIS outputs to be collected from the team in Phase 0.

### 3.5 Content gaps to fill before launch

These must be supplied by the lab. They are Phase 0 blockers where marked.

| Gap | Owner | Blocker? | Status |
|---|---|---|---|
| Official lab logo file | Rivan | Phase 2 | **Resolved 2026-09-19.** Brand values sampled: `#273669`, `#445EA5` |
| Confirmation of team structure (3.2) | Head of Lab | Phase 4 | **Resolved 2026-09-19.** Three teams confirmed with coordinators and overlapping membership |
| Caesario Arif Wibowo: full name with titles, expertise keywords, photo, Scholar or SINTA link | Rivan | Phase 6 | Open. No public record found |
| Permission to reuse ITS lecturer photos | Rivan | Phase 6 | Open |
| Scholar profile IDs for Jatayu and Syafitri | Rivan | No | Open |
| Real project imagery: fieldwork photos, GIS outputs, model results | All members | No, but at least 6 needed before launch | Open |
| Lab mission and short history for the About page | Head of Lab | No | Open |
| Social media handles (Instagram, LinkedIn, YouTube) | Rivan | No | Open |
| Current roadmap (the ITS one is out of scope) | Head of Lab | No, can launch without it | Open, deferred to Phase 9 |
| Logo in vector form (`.svg`) for crisp rendering at all sizes | Rivan | No | Open. A raster PNG works at launch |

---

## 4. Information architecture

```
/                                            Homepage
/research/sustainable-urban-transportation   Team 01 page
/research/spatial-data-science-ai            Team 02 page
/research/decision-support-climate           Team 03 page
/research-projects/[slug]                    Project detail
/publications                       Publication index
/publications/[slug]                Publication detail
/products                           Product index
/products/[slug]                    Product detail (e.g. LanduseSim)
/people                             Member index
/people/[slug]                      Member profile
/about                              Mission, history, affiliation, contact
/roadmap                            Lab roadmap (deferred, see 7.9)
/admin                              Decap CMS editor interface
```

### 4.1 Navigation

Primary, single line, desktop height 64 to 72px:

```
[Lab mark]        Research    Projects    People    About
```

`Roadmap` joins the primary nav only once real roadmap content exists. `Publications` and `Products` live in the footer and are reachable from group pages and project pages.

Rationale: five primary items maximum. The brief listed six. `Roadmap` is dropped from launch nav because the content does not exist yet, and shipping an empty nav item is worse than not having it.

---

## 5. Content model

Stored as Markdown with YAML frontmatter in the Git repository. Managed through Decap CMS.

### 5.1 Collections

```
content/
  projects/     [slug].md
  publications/ [slug].md
  products/     [slug].md
  people/       [slug].md
  teams/        sustainable-urban-transportation.md
                spatial-data-science-ai.md
                decision-support-climate.md
  pages/        about.md
  settings/     site.yml (nav, socials, footer)
```

### 5.1.1 Team schema

```yaml
number: number                 # 1, 2, 3 - drives the 01 / 02 / 03 display
name: string                   # full name, used on the team page
display_name: string           # short name, used on homepage and nav
slug: string
tagline: text                  # the homepage description, max 140 chars
focus: [string]                # the focus keywords from 3.2
coordinator: ref -> people     # required, exactly one
members: [ref -> people]       # required, excludes the coordinator
body: markdown                 # team overview for the team page
```

### 5.2 Project schema

```yaml
title: string                  # required
slug: string                   # auto from title
year: number                   # required
team: enum                     # required, primary team. Drives filtering and the card label
also_teams: [enum]             # optional. Cross-listing for work spanning two teams
status: enum                   # active | completed | ongoing
short_description: text        # required, max 200 chars
cover_image: image             # required
gallery: [image]               # optional
location: string               # optional, e.g. "Surabaya, Indonesia"
study_area: string             # optional
members: [ref -> people]       # required, min 1
publications: [ref -> publications]
products: [ref -> products]
doi: string                    # optional
external_link: url             # optional
partner: string                # optional
funding: string                # optional
methods: [string]              # optional
software: [string]             # optional
dataset: string                # optional
tags: [string]                 # optional
body: markdown                 # optional long description
```

### 5.3 Publication schema

```yaml
title: string                  # required
authors: string                # required, full author string as cited
year: number                   # required
venue: string                  # required, journal or conference
team: enum                     # required, primary team
also_teams: [enum]             # optional
doi: string                    # optional
url: url                       # optional
citations: number              # optional, manually updated
abstract: text                 # optional
members: [ref -> people]       # lab members among the authors
```

### 5.4 Person schema

```yaml
name: string                   # required, full name with titles
slug: string
role: string                   # e.g. "Head of Laboratory", "Lecturer"
photo: image                   # optional, falls back to an initials block
expertise: [string]            # required
teams: [enum]                  # required, one or more. Four of nine members are in two
coordinator_of: enum           # optional, set only for the three coordinators
scholar_id: string             # optional
scholar_url: url               # optional
orcid: string                  # optional
sinta_url: url                 # optional
email: string                  # optional
bio: markdown                  # optional
```

### 5.5 Product schema

```yaml
name: string                   # required
slug: string
type: enum                     # software | webgis | dataset | model | tool
short_description: text        # required
cover_image: image             # required
gallery: [image]
team: enum
owners: [ref -> people]
access_link: url               # optional, download or demo
citation: text                 # optional, how to cite it
related_publications: [ref -> publications]
body: markdown
```

### 5.6 Relationship rule

One project entered once must surface automatically in:

- Homepage Research Archive
- Its primary team page, and any team listed in `also_teams`
- Each listed member's profile
- Each linked publication's detail page
- Each linked product's detail page
- Its year filter

This is the single most important functional requirement of the CMS layer.

---

## 6. Design system

### 6.1 Direction

Technical-editorial, spatial-intelligence. Closer to a research studio portfolio than a university site or a SaaS landing page. Both of those defaults are to be actively avoided.

Dials:

```
DESIGN_VARIANCE   6/10
MOTION_INTENSITY  5/10
VISUAL_DENSITY    4/10
```

### 6.2 Colour

Direction set by the user: **black and blue**, anchored to the lab logo.

**Brand anchors, sampled from the logo file (locked):**

```
#273669   deep navy      the inner strips of the mark
#445EA5   royal blue     the outer strips of the mark
```

Both are muted and violet-leaning rather than saturated cyan-blue. That is fortunate: this is a distinctive blue pair, not the generic tech blue the anti-slop rules warn about. It should be used unmodified wherever it can be.

**The constraint that shapes the whole palette.** Measured against the near-black ground, the brand colours cannot carry small text:

| Colour on `#08090B` | Ratio | Verdict |
|---|---|---|
| `#273669` brand navy | 1.72:1 | Fails. Surface and fill only, never text |
| `#445EA5` brand royal | 3.22:1 | Large text (24px+), borders, and UI only. Fails body text |
| `#5B78BE` derived | 4.62:1 | Passes AA body |
| `#7E97DC` derived | 6.97:1 | Passes AA body, comfortable |

So the brand values stay exact for the logo and for fills, and a derived ramp at the same hue carries text and interactive states. This is normal practice: brand colours are picked for print and for a white ground, and rarely survive unmodified as dark-mode text.

**Tokens:**

```
Neutral ground
--ink-900   #08090B    page ground (near-black, never pure #000)
--ink-800   #0D0F14    raised surface
--ink-700   #141821    card / panel
--ink-600   #1E2430    strong hairline
--ink-500   #2A313B    hairline
--ink-300   #8A929C    muted text           6.33:1  AA
--ink-100   #E8EBEF    body text           16.66:1  AA
--ink-000   #F7F9FB    display text

Blue, anchored to the logo
--blue-900  #141C35    blue-tinted surface wash
--blue-800  #273669    BRAND NAVY, exact. Fills, panels, button grounds
--blue-600  #445EA5    BRAND ROYAL, exact. Locator, borders, large text, button grounds
--blue-400  #5B78BE    interactive text at body size        4.62:1  AA
--blue-300  #7E97DC    link hover, focus ring, small labels 6.97:1  AA
```

**Verified control combinations:**

| Combination | Ratio | Use |
|---|---|---|
| `--ink-000` on `--blue-600` | 5.87:1 | Primary CTA |
| `--ink-000` on `--blue-800` | 10.95:1 | Secondary button, panel text |
| `--blue-400` on `--ink-900` | 4.62:1 | Links, active filter label |
| `--blue-300` on `--ink-900` | 6.97:1 | Hover and focus |

Note: the primary CTA uses **near-white text on the brand royal blue**, not near-black. Near-black on that blue measures 3.22:1 and fails at body size.

Rules:

- One accent family only. Blue appears on: the Surabaya locator, the primary CTA, the active filter state, link and hover states, focus rings, and roadmap markers. Nowhere else.
- No per-group accent colours. With four of nine members sitting in two teams at once (see 3.2), colour-coding groups would imply an exclusivity that does not exist. Groups are differentiated by typography, numbering, and layout.
- Never pure `#000000` or pure `#FFFFFF`.
- The site locks to a single dark theme. No section inverts mid-page.
- Blue is a brand constraint here, so it overrides the usual "avoid generic tech blue" guidance. Executing it with intent means: these two exact values used consistently, a genuinely near-black ground, no gradient washes, no glows.

### 6.3 Typography

```
Display    Space Grotesk (600)          headlines, group titles, numerals
Body       Public Sans (400 / 500)      paragraphs, nav, captions
Mono       IBM Plex Mono (400 / 500)    coordinates, metadata, ASCII map, years, DOIs
```

Rules:

- No serif anywhere. "Academic therefore serif" is a cliche and is banned here.
- Inter is not used at display size.
- The mono family carries the technical register and ties the ASCII hero to the rest of the site. Use it for years, coordinates, DOIs, filter labels, and metadata rows.
- Self-hosted via `next/font` or `@font-face`. No render-blocking Google Fonts `<link>` in production.

### 6.4 Shape and elevation

- One corner radius scale: `3px` for interactive elements, `4px` for cards and images. No pills, no 16px soft cards.
- No drop shadows on the dark ground. Depth comes from surface value steps (`--ink-900` to `--ink-700`) and 1px hairlines (`--ink-500`).

### 6.5 Motion

Every animation must be justifiable in one sentence. Approved list:

| Element | Motion | Justification |
|---|---|---|
| Hero ASCII map | Resolve from noise, idle pulse, slow scan line, subtle pointer parallax | Storytelling: spatial data resolving into clarity, which is the lab's own work |
| Research card | Hover scale to 1.02, visual brightens | Feedback: confirms the card is interactive |
| Section entry | Fade and 24px rise, staggered 60ms | Hierarchy: guides reading order |
| Filter change | Layout transition on the card grid | State transition: shows what changed |
| Roadmap tracks | Fade in per track on scroll | Storytelling: progression left to right |

Banned: scroll hijacking, horizontal pan sections, infinite decorative loops outside the hero, parallax on anything except the hero map, custom cursors, marquees.

Everything above `MOTION_INTENSITY 3` collapses to static under `prefers-reduced-motion: reduce`.

### 6.6 Anti-slop rules (binding)

- Zero em-dash characters anywhere in site copy. Use a period, a comma, or a regular hyphen.
- No eyebrow labels above section headings beyond one on the entire homepage.
- No decorative section numbering (`00 /`, `001 ·`, `03 ·`). The `01 / 02 / 03` on research teams is allowed because those are the lab's real team identifiers.
- No scroll cues (`Scroll`, `↓ Scroll to explore`).
- No decorative status dots.
- No locale, time, or weather strips.
- No version footers.
- No decorative text strips at the hero bottom.
- No `border-t` plus `border-b` on every row of any list.
- No three equal feature cards. The research teams section must be asymmetric.
- No stock photography. Every project visual is real lab output or it stays an honest empty state.
- No div-built fake dashboards or fake screenshots.
- No invented numbers. Citation counts, project counts, and years must be real or absent.
- No filler verbs: elevate, unleash, seamless, revolutionize, next-gen.
- Quotes, if any, maximum 3 lines, attribution with name and role.

---

## 7. Page specifications

### 7.1 Homepage

Section order and layout family, chosen so that no two adjacent sections share a family:

| # | Section | Layout family |
|---|---|---|
| 1 | Hero | Asymmetric split, content left, ASCII map right |
| 2 | Research Teams | Asymmetric trio, not three equal cards |
| 3 | Research Archive | Filtered card grid |
| 4 | Lab Roadmap | Horizontal timeline (deferred, see 7.9) |
| 5 | Footer | Multi-column index |

### 7.2 Hero

**Content (fixed, from the brief):**

```
Headline    SPATIAL ANALYSIS &
            TRANSPORTATION LABORATORY

Subtext     Exploring cities through space, mobility, data
            and intelligent systems.

CTA         Explore Research
```

**Stack discipline:** exactly three text elements. No eyebrow, no trust strip, no tagline under the CTA, no bottom decoration strip.

**Visual:** a single static composition showing Asia, with Indonesia highlighted and Surabaya as the focal locator. No camera zoom or pan. All motion happens inside elements.

**Rendering:** Canvas 2D, character-matrix (ASCII) style.

```
Simplified Asia GeoJSON
  -> rasterise to a brightness grid
  -> map each cell to a monospace glyph by density
  -> draw to <canvas> as a character grid
  -> Indonesia: heavier glyph weight
  -> Surabaya: blue locator, crosshair, coordinate label 07°15'S / 112°45'E
  -> GSAP drives resolve, pulse, scan, pointer parallax
```

MapLibre and deck.gl are explicitly not used. A full map engine is unnecessary weight for a static non-interactive composition, and it conflicts with the performance budget.

**Acceptance criteria:**

- Headline fits 2 lines at 1440px and does not exceed 3 lines at 1024px.
- CTA visible without scrolling at 1440x900 and at 390x844.
- Hero top padding does not exceed 96px at desktop.
- Canvas renders at device pixel ratio without blur.
- Canvas animation loop stops when the hero scrolls out of view.
- Under `prefers-reduced-motion`, the map renders once in its resolved state with no animation.
- Mobile: map simplifies to a reduced grid, stacked below the headline.
- Hero JavaScript is code-split and does not block first paint.

### 7.3 Research Teams

Three teams. **Must not be three equal cards.** Required composition: one lead panel at roughly 60% width with two stacked panels beside it. Order is fixed at 01, 02, 03.

Each panel carries:

```
01
SUSTAINABLE URBAN
TRANSPORTATION

Policy, planning and modelling for transport,
spatial and economic integration.

Siti Nurlaela, Coordinator

Explore Team
```

Requirements:

- Use `display_name`, not the full team name, or the type wraps to four lines and the composition collapses. See 3.2.2.
- Show the coordinator's name. This is what a prospective student actually needs in order to know who to approach, and it is the single most useful piece of information in this section.
- A live count from the CMS, for example `12 projects · 9 publications`. Real, computed at build time, omitted entirely if zero. Never a placeholder number.
- The CTA label is identical across all three panels. Three different phrasings for the same intent is a duplicate-CTA failure.

Mobile: single column, full width, in order.

**Handling overlapping membership.** A member card on a team page shows that member's other team affiliation as a small mono label, for example `also: 03 Decision Support & Climate`. This is factual and useful, and it prevents the site from implying that the teams are separate silos when four of nine members work across two.

### 7.4 Research Archive

- Header: `RESEARCH ARCHIVE` as a plain heading. No small label above it.
- Filters: team (All, 01 Transport, 02 Data Science & AI, 03 Decision & Climate) and year. Mono type, active state in `--blue-400`.
- Search field: ships in Phase 6, not at first launch. Add it once the archive passes roughly 24 entries.
- Card: large visual on top, then title, location, then `Group · Year` in mono.
- Grid: 3 columns desktop, 2 tablet, 1 mobile.
- Hover: scale 1.02, visual brightness lift, no shadow.
- Empty state for a filter combination with no results: a composed message plus a reset action, never a blank area.
- Filtering is client-side over a build-time JSON index. No server needed.

### 7.5 Research team page

```
Team hero (number, full name, tagline, coordinator)
Overview
Research focus (the focus keywords from section 3.2)
Research projects (cards, primary team plus cross-listed)
Publications (list, primary team plus cross-listed)
Research products
Members (coordinator first, then members, each showing other team affiliations)
```

### 7.6 Project detail page

```
Title, year, group, status
Cover image
Short description
Body
Metadata panel: location, study area, methods, software, dataset, partner, funding
Members (linked)
Publications (linked)
Products (linked)
Gallery
External link and DOI
```

### 7.7 People

Index: grid of members with photo, name, role, and expertise keywords. Profile page adds publications by that person, projects they are on, products they own, and outbound links to Scholar, SINTA, and ORCID.

Where a photo is missing, use an initials block in `--ink-700` with `--ink-100` text. Never a stock headshot, never a generic avatar icon.

### 7.8 About

Mission, short history, ITS affiliation, location, contact, and a short "how to join" note for prospective students. Single page, no homepage section, so it does not compete with the archive.

### 7.9 Roadmap (deferred)

The ITS roadmap is out of scope and the replacement does not exist yet. Therefore:

- The roadmap section is **not** built at launch.
- The homepage ships with four sections: Hero, Research Teams, Research Archive, Footer.
- The roadmap is built in a later phase once the lab supplies real 2026 to 2030 content.
- When built, it follows the three-track horizontal timeline converging on `URBAN INTELLIGENCE`, with a vertical stack on mobile, and no scroll hijacking.

Shipping a placeholder roadmap with invented milestones would violate the no-invented-content rule in 6.6.

### 7.10 Footer

```
SPATIAL ANALYSIS &
TRANSPORTATION LABORATORY

Institut Teknologi Sepuluh Nopember
Surabaya, Indonesia

Research    People    Publications    Products
Instagram   LinkedIn  YouTube

© 2026 Spatial Analysis & Transportation Laboratory
```

Social links are omitted entirely if the accounts do not exist. No dead links.

---

## 8. Technical architecture

### 8.1 Stack

```
Framework    Next.js, App Router, static export (output: 'export')
UI           React, Tailwind CSS v4
Animation    GSAP (hero canvas), Motion (section reveals)
Hero render  Canvas 2D
Content      Markdown + YAML frontmatter in the repo
CMS          Decap CMS at /admin, GitHub backend, GitHub OAuth
Hosting      GitHub Pages
CI/CD        GitHub Actions, build and deploy on push to main
Domain       Custom domain via CNAME, free SSL
Cost         0
```

### 8.2 Constraints from GitHub Pages

- Static files only, no server runtime. All interactivity is client-side. This is compatible with every feature in this PRD.
- `next/image` optimisation is unavailable at runtime, so images are optimised at build time with `sharp` and served as pre-generated `webp` at defined widths.
- Decap CMS with the GitHub backend needs an OAuth handler. GitHub Pages cannot host one. Resolution options, decided in Phase 5:
  1. A free external OAuth relay (Netlify's, or a small Cloudflare Worker).
  2. Decap's GitHub App based auth if available for the repo.
  3. Fallback: run the CMS locally with `npx decap-server` and have editors use a local admin. Least convenient, so this is the fallback only.

This is the one genuine risk in the all-GitHub approach and it is scheduled explicitly in Phase 5.

### 8.3 Image pipeline

Editors upload photos from phones and cameras at full size. Without a pipeline the repository grows unmanageably.

- On commit, a GitHub Action resizes and converts uploads to `webp` at 480, 960, and 1600px.
- Originals above 2MB are not committed; the Action replaces them with the optimised set.
- Target: no single committed image above 400KB.

### 8.4 Performance budget

| Metric | Target |
|---|---|
| LCP | under 2.5s on 4G |
| CLS | under 0.1 |
| INP | under 200ms |
| Hero JS (GSAP plus canvas) | under 60KB gzipped, code split, not blocking |
| Total homepage transfer | under 900KB |

### 8.5 SEO

- Per-page metadata from frontmatter.
- `schema.org/ScholarlyArticle` JSON-LD on publication pages, `Person` on member pages, `Organization` on the homepage. This matters for academic discoverability.
- Sitemap and `robots.txt` generated at build.
- Open Graph images per project and publication.

---

## 9. Execution plan

Nine phases. Each is a stopping point with a validation gate.

### Phase 0 - Inputs and confirmation

**Status: complete for the blocking items, 2026-09-19.**

| Item | Status |
|---|---|
| Logo file obtained, brand values sampled | Done. `#273669` and `#445EA5`, tokens locked in 6.2 |
| Team structure confirmed | Done. Three teams with coordinators, recorded in 3.2 |
| New member identified | Done. Caesario Arif Wibowo, Team 01. Details still needed |
| Photo reuse permission | Open, needed by Phase 6 |
| Repository name and domain decision | Open, needed by Phase 1 |

**Remaining before Phase 1:** repository name only. Everything else is scheduled against a later phase and does not block the scaffold.

---

### Phase 1 - Scaffold and deployment pipeline

**Scope:** an empty but deploying site.

- Initialise the Next.js project with static export and Tailwind v4.
- Set up the repository, `.github/workflows/deploy.yml`, and GitHub Pages.
- Configure `basePath` correctly for the Pages URL.
- Deploy a placeholder page.

**Done when:** a commit to `main` results in a live updated page at the Pages URL within 2 minutes, with no manual steps.

**Validation:** push a trivial text change, confirm it appears live. Confirm the Action is green.

Deploying before building anything is deliberate. Path and `basePath` problems on GitHub Pages are far cheaper to fix on an empty site than on a finished one.

---

### Phase 2 - Design system

**Scope:** tokens and primitives, no page content.

- CSS custom properties for the full palette in 6.2.
- Self-hosted fonts via `next/font`.
- Type scale, spacing scale, radius scale.
- Base primitives: button, link, card shell, filter chip, section wrapper, hairline.
- A `/styleguide` route rendering every token and primitive. Not deployed to production nav, used for review only.

**Done when:** the styleguide renders and every colour pair passes WCAG AA.

**Validation:**
- Run an automated contrast check across every token pair actually used.
- Confirm the CTA passes at body size: near-white text on `--blue-600`, measured at 5.87:1.
- Visual review of the styleguide against section 6.

---

### Phase 3 - Hero

The highest-risk and highest-value piece. Built alone so it gets full attention.

**Scope:**

- Source and simplify an Asia GeoJSON outline, with Indonesia as a separate feature.
- Build the rasterise-to-character-grid renderer on Canvas 2D.
- Indonesia weighting, Surabaya locator, crosshair, coordinate label.
- GSAP: resolve from noise on load, idle pulse, slow scan line, pointer parallax.
- Ambient character-noise background layer.
- Hero copy, CTA, and layout per 7.2.
- Mobile simplification.
- Reduced-motion static path.
- Visibility-based animation pause.

**Done when:** every acceptance criterion in 7.2 passes.

**Validation:**
- Load the real page in a browser at 1440x900, 1024x768, and 390x844.
- Confirm the headline stays within its line limits and the CTA is above the fold at all three.
- Measure hero JS transfer size against the 60KB budget.
- Toggle `prefers-reduced-motion` and confirm the static path.
- Confirm the animation loop stops when scrolled away, checked in the performance panel.
- Screenshot review against the design direction, then a taste pass: asymmetry, type scale, accent restraint, no AI tells.

---

### Phase 4 - Homepage sections

**Scope:** Research Teams, Research Archive, Footer, and the primary nav. Built against hardcoded fixtures drawn from the real content in section 3, not invented data. The CMS wiring comes in Phase 5.

- Research Teams with the asymmetric composition in 7.3.
- Research Archive grid, group filter, year filter, hover states, empty state.
- Footer per 7.10.
- Nav per 4.1.

**Done when:** the full homepage renders end to end with real seed content and no placeholder text.

**Validation:**
- Confirm no two adjacent sections share a layout family.
- Confirm the research teams are not three equal cards.
- Confirm each team panel shows its coordinator and uses `display_name`, not the full name.
- Run the section 6.6 anti-slop checklist item by item against the rendered page.
- Count eyebrow labels on the page. Must be at most one.
- Search the rendered output for the em-dash character. Must return zero.
- Test filters at all three breakpoints.

---

### Phase 5 - Content layer and CMS

**Status: partially complete, 2026-09-19. Blocked on one step that needs the site owner's own GitHub account.**

**Done:**
- `public/admin/config.yml` — all six collections (Research Teams, People, Research Projects, Publications, Research Products, Pages, Site settings), matching the schemas in section 5 exactly, including the relation widgets between them.
- `public/admin/index.html` — the CMS entry point (Decap CMS via CDN, no build step of its own).
- Seed content committed for the three "files"-type collections that don't need an OAuth session to exist as real files: `content/teams/*.md` (real team data, matching `lib/content/teams.ts`), `content/pages/about.md` (fields present, explicitly marked `[TODO]` rather than filled with invented mission copy), `content/settings/site.yml` (social links left blank on purpose).
- `docs/cms-setup.md` — the exact remaining steps, verified against the current README of the actual Cloudflare Worker OAuth provider this points to (`ottmartens/decap-cms-github-oauth-provider-cloudflare`), not written from memory.
- Verified the whole `public/admin/` directory survives the static export unchanged (`out/admin/config.yml` and `out/admin/index.html` both present after a clean build) and that every YAML file (`config.yml`, the three team files' frontmatter, `site.yml`) parses without error.

**Not done, and why it's not a shortcut to skip:**
- **The OAuth handshake itself.** GitHub Pages serves static files only; Decap's GitHub backend needs *something* to complete GitHub's OAuth flow before it can commit on the editors' behalf. That something needs a real GitHub account to register (an OAuth App under Settings → Developer settings) and a Cloudflare account to deploy the small proxy worker to. Neither can be done from a local clone with no credentials — this is the one step in the entire build that is *not* a coding task. `docs/cms-setup.md` has the exact commands.
- **`config.yml`'s `repo:` field is still a placeholder** (`REPLACE_WITH_OWNER/REPLACE_WITH_REPO_NAME`) because the repository doesn't have a real GitHub remote yet either (Phase 1 built and verified the deploy pipeline locally; pushing it was left to the site owner for the same credentials reason).
- **The content-loading layer** (section 5.6's relationship rule, actually reading `content/*.md` at build time instead of the hardcoded fixtures `lib/content/*.ts` that Phase 4 used) is genuinely unbuilt. This is real, separate work — a frontmatter parser, a content index, and rewiring every Phase 4 component to read from files instead of imports — not something to rush through at the tail end of a long session. Attempting it now, untested, would risk quietly breaking the four homepage sections that are currently verified and working.
- The image-optimisation Action (PRD 8.3) and the full "unassisted lecturer" validation test are consequently also not yet possible.

**Revised done-when, given the above:** once the repo exists on GitHub and the OAuth worker is deployed (both require the site owner), `/admin` should be reachable and editable immediately — that's what's been built and is ready. The content-loading layer that makes an edit *appear on the live site* without a code change is the remaining work, tracked here rather than glossed over.

---

### Phase 6 - Inner pages

**Scope:** every route in section 4 except `/roadmap`.

- Research group pages (7.5)
- Project detail (7.6)
- Publications index and detail
- Products index and detail, with LanduseSim as the first real product page
- People index and profiles (7.7)
- About (7.8)
- Archive search field

**Done when:** no route 404s, and every link in the nav and footer resolves.

**Validation:**
- Crawl the built output for broken internal links.
- Confirm every member profile shows their real publications.
- Confirm the LanduseSim product page carries real screenshots and citation guidance.

---

### Phase 7 - Quality pass

**Scope:** accessibility, performance, SEO, and a design refinement pass.

- Keyboard navigation across every interactive element, visible focus rings throughout.
- Screen reader pass on the hero canvas, which needs a meaningful text alternative rather than being announced as an empty canvas.
- Alt text on every image.
- Lighthouse on homepage, a group page, and a project page.
- JSON-LD per 8.5, sitemap, robots, Open Graph images.
- Design refinement: re-read every visible string, tighten spacing rhythm, verify accent discipline across all pages.

**Done when:** the targets in 1.4 and 8.4 are met.

**Validation:**
- Lighthouse Performance 90 or above mobile, Accessibility 95 or above.
- Full keyboard traversal with no traps.
- Copy audit: every string re-read for grammar, clarity, and AI tells.
- Full anti-slop checklist from 6.6 re-run across all page types, not just the homepage.

---

### Phase 8 - Launch

**Scope:** go live.

- Custom domain and DNS if used.
- Editor handover: a one-page guide for `/admin`, no Git terminology.
- Final content pass with the lab.

**Done when:** the site is live at its final URL and both editors have published something themselves.

**Validation:** both editors independently publish one real item without help.

---

### Phase 9 - Roadmap (deferred)

Triggered only when the lab supplies real roadmap content. Builds the three-track timeline and converging vision per 7.9, then adds `Roadmap` to the primary nav.

---

## 10. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Decap OAuth cannot run on GitHub Pages | Editors cannot use the CMS, which defeats goal 4 | Scheduled explicitly in Phase 5 with three fallback options in 8.2. If all fail, move hosting to Cloudflare Pages, still free, still Git-backed |
| Photo permission denied | People pages have no portraits | Initials blocks are already specified in 7.7, so the design does not break |
| Repository bloat from image uploads | Slow clones, hitting Pages limits | Build-time optimisation Action in 8.3, enforced 400KB ceiling |
| Hero canvas is heavy on low-end mobile | Poor LCP, bad first impression | Mobile simplified grid, visibility-based pause, 60KB budget, reduced-motion static path |
| Content goes stale after launch | The site becomes as dead as the current ITS page | Editing must be genuinely easy. This is why Phase 5's validation is an unassisted real-user test, not a developer demo |
| ~~Group assignment is wrong~~ | - | **Resolved 2026-09-19.** Corrected against the lab's own team chart |
| Brand blues are too dark for text on a dark ground | Illegible interface, failed accessibility target | Resolved in 6.2 with a derived ramp. The exact brand values are reserved for fills and the logo, and never carry small text |
| Caesario Arif Wibowo has no public record | An incomplete member card at launch | Initials block plus expertise keywords is enough to ship. Needs his details from the lab before Phase 6 |

---

## 11. Open decisions

| # | Question | Default if unanswered |
|---|---|---|
| 1 | English only, or English and Indonesian? | English only at launch. Bilingual doubles the content model and every editor action, so it should be a deliberate later decision |
| 2 | ~~Exact brand blue~~ | **Resolved.** `#273669` and `#445EA5`, sampled from the logo |
| 3 | Custom domain, or the default `github.io` URL? | Default Pages URL at launch, custom domain later, since it costs money |
| 4 | Do Instagram, LinkedIn, and YouTube accounts exist? | Omit the links entirely rather than ship dead ones |
| 5 | Should students and alumni appear under People? | Lecturers only at launch, students later |
| 6 | The brief's core concept triad, `Space, Movement, Intelligence`, was written against the old team names and no longer maps. Team 02 is now data science and AI rather than "space", and Team 03 adds climate. A closer triad would be `Movement, Intelligence, Resilience`. | Drop the triad from the site rather than ship one that does not match the teams. It was a brand device, not a requirement, and a mismatched mapping is worse than none |
| 7 | Does the lab have an English-language name it prefers? The ITS page says "Transportation and Spatial Analisys Laboratory", which contains a spelling error in "Analisys" | Use "Spatial Analysis and Transportation Laboratory" per the brief, and do not reproduce the typo |

---

## 12. Reference

- Design rationale and visual direction: `spatial lab_brief.md`
- Existing lab page: https://www.its.ac.id/pwk/en/transportation-and-spatial-analisys-laboratory/
- Hero interaction reference: https://www.contentarchitecture.dev/#showcase
- Archive approach references: MIT Senseable City Lab, Felt, Vizzuality, Development Seed
