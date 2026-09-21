# Content editing

Everything the website says comes from one folder: `lib/content/`. There is no separate admin
panel, so an edit here cannot drift out of sync with a second copy.

These files are TypeScript, but the parts you edit are plain lists. Copy an existing entry,
change the values, keep the punctuation. The rules that matter:

- Text goes inside `"double quotes"`.
- Each entry ends with a comma.
- Numbers (years) have no quotes.
- A field you have no real value for is left out entirely — never guessed.

After any edit:

```bash
npm run typecheck
npm run build
```

`typecheck` catches a missing comma or a misspelled field name and tells you the line. If both
commands pass, commit and push; the site republishes itself.

---

## Publications

File: `lib/content/publications.ts`

```ts
{
  slug: "example-publication",
  title: "Example publication",
  authors: "Author, A., Second, B.",
  year: 2026,
  venue: "Example Journal",
  team: "spatial-data-science-ai",
},
```

| Field | Required | Notes |
| --- | --- | --- |
| `slug` | yes | Lowercase, hyphens, no spaces. Must be unique. |
| `title` | yes | |
| `authors` | yes | Comma-separated, in the order printed on the paper. |
| `year` | yes | A number. If the year is genuinely unknown, leave the paper out rather than guessing. |
| `venue` | yes | Journal or conference name. |
| `team` | yes | One of `sustainable-urban-transportation`, `spatial-data-science-ai`, `decision-support-climate`. |
| `url` | no | Full `https://` link to the publisher page. |
| `doi` | no | Stored without the `https://doi.org/` prefix, e.g. `10.1016/j.example.2026.000001`. |
| `coverImage` | no | See [Images](#images). |
| `category` | no | `Journal`, `Proceedings`, `Report` or `Book chapter`. |
| `citations` | no | A number. Not displayed anywhere yet. |

The card links to `url` if present, otherwise to `doi`. With neither, the card still appears but
is not clickable — deliberately, so there are no links that lead nowhere.

## Projects

File: `lib/content/projects.ts`

```ts
{
  slug: "example-project",
  name: "Example Project",
  description: "Short factual description",
  year: 2026,
  developer: "Team member name",
  category: "Software",
},
```

Only `slug` and `name` are required. `category` is `Software` or `Study`. Write `developer`
using the person's full name as it appears in `people.ts` — the research group pages match
projects to groups by that name.

## People

File: `lib/content/people.ts`

```ts
{
  slug: "example-person",
  name: "Example Person",
  role: "Lecturer",
  expertise: ["Transport planning"],
  teams: ["sustainable-urban-transportation"],
  profileUrl: "https://scholar.its.ac.id/en/persons/example-person/",
},
```

| Field | Required | Notes |
| --- | --- | --- |
| `slug` | yes | Lowercase with hyphens, unique. |
| `name` | yes | Full name, spelled exactly as you want it shown. |
| `role` | yes | |
| `expertise` | yes | A list, even with one item. Not displayed yet. |
| `teams` | yes | A list of group slugs. Not displayed yet. |
| `profileUrl` | no | ITS Scholar page. Without it the name renders as plain text instead of a link. |
| `photo` | no | See [Images](#images). Without it the person shows as initials. |
| `orcidId` | no | Used by the automatic publication check to find new papers. |
| `scholarId` | no | Not used yet. |

Adding someone to a research group is a separate step — see below.

## Research groups

File: `lib/content/teams.ts`

There are three, and the site's layout assumes three. What you normally change here is the
wording and the membership:

- `name` — full name, shown on the group's own page
- `tagline` — the sentence revealed on the homepage card
- `focus` — the list shown at the top of the group page
- `coordinatorSlug` and `memberSlugs` — the people in the group, by their `slug` from
  `people.ts`

The group page collects its publications and projects automatically from the people listed
here, so adding a member can change what appears on that page.

## Images

1. Put the file in the matching folder:
   - people → `public/images/people/`
   - publications → `public/images/publications/`
   - projects → `public/images/projects/` (create this folder for the first one)
2. Reference it from the entry with a path starting at `/images/`:

```ts
coverImage: "/images/publications/example-publication.webp",
```

`.webp`, `.png`, `.jpg` and `.svg` all work. Use a real cover, first page, map, diagram or
screenshot of the actual output. Leave the field out when no suitable image exists — an entry
with no image renders a plain panel on purpose, rather than borrowing a stock photo.

## Text that is not in `lib/content/`

A few strings live in the component that draws them:

| Text | File |
| --- | --- |
| Hero title and tagline | `components/hero/Hero.tsx` |
| Hero button labels | `components/hero/HeroCtas.tsx`, `components/hero/ContactButton.tsx` |
| Top navigation labels | `components/layout/Header.tsx` |
| Roadmap section wording | `components/sections/Roadmap.tsx` |
| Address, email, phone | `components/layout/Footer.tsx` |

## Publications found automatically

`lib/content/publications.pending.json` holds candidates found by the weekly ORCID/Crossref
check. Nothing in that file is on the website. To publish one, read it, confirm it is real and
correct, then write a proper entry in `publications.ts` and delete it from the pending list.
