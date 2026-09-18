# CMS setup — the one step that needs your GitHub account

Everything about the CMS (`/admin`, `public/admin/config.yml`, all six
content collections) is already built and matches the schemas in `PRD.md`
section 5. What's left is registering the OAuth handshake GitHub Pages
can't host on its own (PRD section 8.2) — that step needs your own GitHub
login, so it can't be done from a local clone.

This is a one-time setup. After it's done, you and the lecturer just use
`/admin` like any other login form — no GitHub knowledge needed for either
of you day to day.

## Why this step exists

Decap CMS's GitHub backend needs something to complete GitHub's OAuth
handshake (exchange a login code for a token) before it can commit on your
behalf. GitHub Pages only serves static files, so that handshake needs a
tiny bit of server code living somewhere else. The good news: Cloudflare
Workers' free tier (100,000 requests/day) covers this without limit for a
site with two editors, so this costs nothing, same as the rest of the
stack.

## Steps

### 1. Push this repository to GitHub

If you haven't already:

```bash
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

Then in the repo's **Settings → Pages → Build and deployment → Source**,
select **GitHub Actions**. The workflow at `.github/workflows/deploy.yml`
takes it from there on every push to `main`.

### 2. Create a GitHub OAuth App

1. Go to **github.com/settings/developers → OAuth Apps → New OAuth App**.
2. **Application name**: anything, e.g. "Spatial Lab CMS".
3. **Homepage URL**: your Pages URL (e.g. `https://<your-username>.github.io/<repo-name>/`).
4. **Authorization callback URL**: `https://<your-worker-subdomain>.workers.dev/callback` —
   you'll get the exact worker URL in step 3, so come back and fill this in
   after that step if you don't have it yet.
5. Save, then note the **Client ID** and generate a **Client Secret**.

### 3. Deploy the OAuth worker (Cloudflare, free)

This project uses
[`ottmartens/decap-cms-github-oauth-provider-cloudflare`](https://github.com/ottmartens/decap-cms-github-oauth-provider-cloudflare),
a small, maintained, open-source worker built for exactly this.

```bash
# Fork that repo on GitHub, then clone your fork locally
git clone https://github.com/<your-username>/decap-cms-github-oauth-provider-cloudflare.git
cd decap-cms-github-oauth-provider-cloudflare

npm install --global wrangler
wrangler login

# Find your account id
wrangler whoami
# — paste it into wrangler.toml's account_id field

# Add your OAuth App's credentials as secrets (paste when prompted)
wrangler secret put CLIENT_ID
wrangler secret put CLIENT_SECRET

wrangler deploy
```

`wrangler deploy` prints your worker's URL, something like
`https://decap-cms-github-oauth-provider-cloudflare.<your-subdomain>.workers.dev`.

Go back to the OAuth App from step 2 and set the callback URL to
`<that-worker-url>/callback` if you hadn't yet.

### 4. Point config.yml at your repo and your worker

Edit `public/admin/config.yml` in this repo:

```yaml
backend:
  name: github
  repo: <your-username>/<repo-name>       # was REPLACE_WITH_OWNER/REPLACE_WITH_REPO_NAME
  branch: main
  base_url: https://<your-worker-url>     # was the placeholder .example.workers.dev one
  auth_endpoint: auth
```

Also update `site_url` and `display_url` a few lines above with your real
Pages URL. Commit and push — the next deploy picks it up.

### 5. Try it

Visit `https://<your-username>.github.io/<repo-name>/admin/`, click
**Login with GitHub**, authorize the OAuth App once. You should land in the
CMS with all six collections (Research Teams, People, Research Projects,
Publications, Research Products, Pages, Site settings) ready to edit.

## After this is done

- Both you and the lecturer log in with your own GitHub accounts — no
  shared password, no separate CMS account to manage.
- Any GitHub account can request access to the CMS this way, but only
  accounts with **write access to this repository** can actually save
  changes (GitHub enforces that, not Decap). Add the lecturer as a
  collaborator on the repo (**Settings → Collaborators**) so they can
  publish.
- Every save is a real Git commit. `git log` is your edit history, and
  reverting a bad edit is an ordinary `git revert`.
