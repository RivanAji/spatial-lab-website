# Spatial Analysis & Transportation Laboratory — website

Next.js static site for the Laboratory of Transportation and Spatial Analysis, Department of
Urban and Regional Planning, ITS. See [`PRD.md`](./PRD.md) for the full build contract and
[`spatial lab_brief.md`](./spatial%20lab_brief.md) for design rationale.

To change what the site says, you almost always want [`CONTENT_EDITING.md`](./CONTENT_EDITING.md)
and the `lib/content/` folder, not the components.

## Local development

```bash
npm install
npm run dev
```

The dev server prints a local URL. Edits reload automatically.

## Checks before publishing

```bash
npm run typecheck
npm run build
```

`npm run build` writes a static export to `out/`. There is no Node server in production — the
whole site is plain HTML, CSS, JS files.

## Deploying to GitHub Pages

Already set up on this repository. Every push to `main` triggers
[`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml), which builds the site and
publishes it. Nothing else to do.

If you ever set this up on a fresh repository: **Settings → Pages → Build and deployment →
Source → GitHub Actions**, then push to `main`. The workflow reads the correct base path from
GitHub's own `actions/configure-pages` action, so it works whether the site ends up at
`username.github.io/repo-name`, at a user/org domain, or on a custom domain. The repository
name is not hardcoded anywhere.

## What is on the page, and which file controls it

The homepage is assembled in [`app/(site)/page.tsx`](./app/%28site%29/page.tsx), top to bottom:

| What you see | Component | Where its content comes from |
| --- | --- | --- |
| Logos and nav bar at the top | `components/layout/Header.tsx` | Nav labels are in that file (`NAV_ITEMS`) |
| Title and tagline | `components/hero/Hero.tsx` | Text is in that file |
| Contact / Explore buttons | `components/hero/HeroCtas.tsx`, `ContactButton.tsx` | Labels are in those files |
| Moving map behind the hero | `components/hero/HeroCanvas.tsx`, `HeroBackdrop.tsx` | Generated, no content to edit |
| Three research group cards | `components/sections/PublicationsShowcase.tsx` | `lib/content/teams.ts` |
| Isometric animation inside those cards | `components/sections/TeamScenes.tsx` | Drawn in code, no content to edit |
| Publications slider + year filter | `components/sections/PublicationsShowcase.tsx` | `lib/content/publications.ts` |
| Project slider | `components/sections/Project.tsx` | `lib/content/projects.ts` |
| Roadmap ("Soon") | `components/sections/Roadmap.tsx` | Text is in that file |
| Team roster | `components/sections/Team.tsx` | `lib/content/people.ts` |
| Address, email, phone, map backdrop | `components/layout/Footer.tsx` | Text is in that file |

Clicking a research group card opens its own page at `/research/<team-slug>/`, built by
[`app/research/[team]/page.tsx`](./app/research/%5Bteam%5D/page.tsx) with the timeline in
`components/team/TeamTimeline.tsx`. That page needs no separate content: it collects the
publications and projects that already name the team's members.

## Folder map

```
app/                    Pages and routes
  (site)/               The homepage, and the header/footer wrapper it shares
  research/[team]/      One detail page per research group, generated from lib/content
  styleguide/           Internal colour and type reference, not linked from the site
  globals.css           Colour tokens, fonts, base styles
  layout.tsx            Wraps every page (fonts, metadata, smooth scrolling)

components/             All UI, grouped by what it belongs to
  hero/                 Homepage hero and its animated map background
  sections/             The main homepage blocks, one file per section
  team/                 Pieces used by the research group detail pages
  layout/               Header, footer, smooth scrolling
  ui/                   Small shared pieces (Button, Card, Container, filters)
  shaders/              The WebGL gradient behind the hero

lib/
  content/              ← ALL EDITABLE CONTENT LIVES HERE
    people.ts           Team members
    teams.ts            The three research groups
    publications.ts     Published papers
    projects.ts         Software and studies
    types.ts            Which fields each of the above may have
    publications.pending.json   Candidates found automatically, not yet on the site
  asset-path.ts         Prefixes image paths so they work on GitHub Pages
  cn.ts                 Small helper for combining CSS classes

public/                 Files served as-is
  brand/                Lab and ITS logos
  images/people/        Member photos
  images/publications/  Publication cover images
  images/projects/      Project images (create it when you add the first one)

scripts/                Maintenance tools, run by hand or by CI
.github/workflows/      Automatic deploy, and the weekly publication check
```

## Adding or changing content

Full instructions with copy-paste examples: [`CONTENT_EDITING.md`](./CONTENT_EDITING.md).
The short version:

- **A new publication** → add an entry to `lib/content/publications.ts`
- **A new project** → add an entry to `lib/content/projects.ts`
- **A new team member, or a changed name/photo/profile link** → `lib/content/people.ts`
- **A research group's name, tagline or focus list** → `lib/content/teams.ts`
- **Address, email, phone** → `components/layout/Footer.tsx`
- **Hero title or tagline** → `components/hero/Hero.tsx`
- **An image** → put the file in the matching folder under `public/images/`, then reference it
  from the content entry as `/images/<folder>/<filename>`

After editing, run `npm run typecheck` and `npm run build`. If both pass, commit and push — the
site republishes on its own.

## Maintenance scripts

| Command | What it does |
| --- | --- |
| `npm run check:contrast` | Verifies the colour pairs used in the UI meet WCAG contrast. Run it if a colour token changes. |
| `npm run check:new-publications` | Searches ORCID and Crossref for new papers by team members and writes candidates to `publications.pending.json`. Also runs weekly in CI, which opens a pull request when it finds something. Candidates never go live on their own — you review them and write a proper entry in `publications.ts`. |
| `npm run build:map` | Regenerates the dot-grid coordinates for the map graphics. Only needed if that artwork changes. |

## Stack

Next.js (static export), React, Tailwind CSS v4, Motion for animation, OGL for the hero
background. See `PRD.md` section 8 for the full architecture and section 6 for the design
system.

## Fields that exist but are not shown yet

Some content fields are filled in but no part of the site displays them yet: `expertise`,
`scholarId`, `teams` and `coordinatorOf` on people, `citations` on publications, and
`displayName` on teams. They are kept because they hold real, researched information — they are
simply waiting for a part of the interface that uses them.
