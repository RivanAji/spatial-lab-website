# Spatial Analysis & Transportation Laboratory — website

Next.js static site for the Laboratory of Transportation and Spatial Analysis, Department of Urban and Regional Planning, ITS. See [`PRD.md`](./PRD.md) for the full build contract and [`spatial lab_brief.md`](./spatial%20lab_brief.md) for design rationale.

## Local development

```bash
npm install
npm run dev
```

## Production build (static export)

```bash
npm run build
```

Output goes to `out/`. This is a static export (`output: 'export'` in `next.config.mjs`) — there is no Node server in production.

## Deploying to GitHub Pages

One-time setup on GitHub, after this repo is pushed:

1. Repo **Settings → Pages → Build and deployment → Source**: select **GitHub Actions**.
2. Push to `main`. The workflow at [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) builds and publishes automatically, no further steps needed.

The workflow reads the correct base path from GitHub's own `actions/configure-pages` action, so it works unchanged whether this ends up as a project site (`username.github.io/repo-name`), an org/user site, or a custom domain. Nothing about the repository name is hardcoded anywhere in the app.

## Stack

Next.js (static export), React, Tailwind CSS v4. See `PRD.md` section 8 for the full architecture and section 6 for the design system.
