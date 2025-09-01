# ChatbotComparison.com

Current chat: https://chatgpt.com/g/g-p-688895f9e6c08191bb07600eb0f01e06-1m-4month-plan/c/68a4719b-6484-8321-a452-e0b6497a94c8

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