# gratis.sh

Mentor’s AI playground. Seven verified projects with factual descriptions, a restrained responsive directory with light/dark themes, and locally hosted Montserrat/Nunito typography.

## Local

```sh
nvm use
npm ci
npm run dev
```

## Verify

```sh
npm run lint
npm run build
xvfb-run -a npm test
```

Browser tests use sandboxed, headful Chrome. They check navigation, desktop/mobile layouts, dark theme, accessibility, persistent text sizing, and prerendered content without JavaScript. Screenshots land in ignored `artifacts/`.

## Projects

Edit `src/projects.js`; array order is display order. Each project's `art` picks a motif in `src/components/atoms/ProjectArt.jsx`. Confirm destinations and access requirements before listing them. Current live projects use `*.gratis.sh`; tested `*.gratis.ai` equivalents did not resolve (2026-09-30).

## Deployment

Cloudflare Workers Static Assets; existing Worker `gratis-landing` serves `https://gratis.sh`.

- `.github/workflows/deploy.yml`: PR verification; deploy on `main` push or manual dispatch from `main`.
- GitHub Actions secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` (configured).
- Production deployment waits for lint, build, and browser tests.
- Existing domain binding is managed in Cloudflare; Wrangler updates assets without recreating domains.
- `.env.local` is ignored and never bundled. Only Cloudflare account/token credentials are needed for deployment.

Manual deployment from a verified build:

```sh
node --env-file=.env.local node_modules/wrangler/bin/wrangler.js deploy
```

The workflow becomes available only after its commit reaches GitHub. No repository push is implied by a local commit.
