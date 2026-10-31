# Teddy site

Next.js (App Router) site for Teddy's public brand, with English/Thai/Chinese
language support built in. Visual style: warm editorial portfolio (serif
display type, soft paper background, generous whitespace).

## Structure

- `app/[locale]/` — the localized pages. `/en`, `/th`, `/zh`.
- `middleware.ts` — redirects `/` to the visitor's preferred language (falls
  back to English) based on their browser's `Accept-Language` header.
- `dictionaries/{en,th,zh}.json` — all page copy, one file per language.
  Edit these to change wording; no code changes needed.
- `components/LangSwitcher.tsx` — the EN / TH / 中文 switcher in the header.
- `tailwind.config.ts` — the color palette and font tokens.

## Before you publish

The Thai and Chinese copy in `dictionaries/th.json` and `dictionaries/zh.json`
was machine-translated from the English original. **Have a native speaker
read through both before this goes live** — meaning and tone should be
right, but phrasing may read a little stiff in places.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000 — it will redirect to `/en` (or `/th`/`/zh`
depending on your browser's language setting).

## Deploy to Vercel

1. Create a new GitHub repo (e.g. `teddy-site`) and push this folder to it:
   ```bash
   git init
   git add .
   git commit -m "Initial Teddy site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/teddy-site.git
   git push -u origin main
   ```
2. In Vercel, "Add New Project" → import that GitHub repo. Vercel detects
   Next.js automatically — no config needed. Click Deploy.
3. Once it's live, add a custom domain under the Vercel project's Domains
   settings if you have one.

## Editing content later

- To change any text: edit the matching key in `dictionaries/en.json` /
  `th.json` / `zh.json` — all three files share the same shape.
- To change the follow-platform links: edit `PLATFORM_LINKS` at the top of
  `app/[locale]/page.tsx` with Teddy's real TikTok/Instagram/YouTube/
  Facebook/LINE URLs (currently placeholders).
- To add a new content pillar card: add an item to `pillars.items` in each
  of the three dictionary files (same index across all three).
