# Hosting

- Production: https://gratis.sh
- Cloudflare Worker: gratis-landing (pre-existing placeholder).
- GitHub: actuallymentor/gratis-landing; main branch.
- Credentials: ignored .env.local. Never expose contents.
- Supplied token can read/update the specific Worker and read gratis.sh zone. Account domain listing and DNS listing are denied; do not assume token invalid from those endpoints or /user/tokens/verify.
- CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID GitHub Actions secrets configured on 2026-09-30.
- Repository push requires explicit user instruction. Local commits alone do not activate Actions.
- Direct deployment succeeded on 2026-09-30; existing gratis.sh binding serves the new landing page. Wrangler reports no configured targets because domain ownership stays outside this repo.
