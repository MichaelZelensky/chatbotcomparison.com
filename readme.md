# ChatbotComparison.com

Nuxt 3 site (SSR build, statically generated) deployed to S3. Mirrors your `liteed.com` tech choices for zero learning overhead.

## Scripts
- `pnpm dev` — local dev
- `pnpm generate` — output to `./.output/public`
- Deploy: `aws s3 sync ./.output/public s3://<your-bucket> --delete`

## Structure
- `pages/` — main routes
- `components/` — layout & UI
- `assets/styles/main.scss` — Tailwind + base styles
- `public/` — static assets

## Notes
- Add actual comparison data later (tables, filters, pinning behavior).
- Consider MD content for guides (`content/` + @nuxt/content) if desired.
- Update analytics ID and social images.