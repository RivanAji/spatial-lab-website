# Content editing

Website content has one active source: `lib/content/`.

Run these checks after an edit:

```bash
npm run typecheck
npm run build
```

## Publications

Edit `lib/content/publications.ts`.

Add a publisher or journal page with `url`. Use the full `https://` address:

```ts
{
  slug: "example-publication",
  title: "Example publication",
  authors: "Author, A.",
  year: 2026,
  venue: "Example Journal",
  team: "spatial-data-science-ai",
  url: "https://www.sciencedirect.com/science/article/pii/EXAMPLE",
}
```

Link priority is `url`, then `doi`. A card with neither stays non-interactive, preventing a broken
page. A DOI is stored without the `https://doi.org/` prefix:

```ts
doi: "10.1016/j.example.2026.000001",
```

To add a cover:

1. Put the image in `public/images/publications/`.
2. Add its public path to the record:

```ts
coverImage: "/images/publications/example-publication.webp",
```

Use a real paper cover, first page, map, diagram, or research output. Leave the field absent when
no suitable image exists.

## Projects

Edit `lib/content/projects.ts`. Missing information may remain absent.

```ts
{
  slug: "example-project",
  name: "Example Project",
  description: "Short factual description",
  year: 2026,
  developer: "Team member name",
  coverImage: "/images/projects/example-project.webp",
}
```

Project images belong in `public/images/projects/`. Create that directory when adding its first
image. Supported browser formats include `.webp`, `.png`, `.jpg`, and `.svg`.

## People and teams

- People: `lib/content/people.ts`
- Research teams: `lib/content/teams.ts`
- Shared field definitions: `lib/content/types.ts`

Keep slugs lowercase with hyphens. Do not invent a year, URL, image, or attribution when the real
value is unknown.
