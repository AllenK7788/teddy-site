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

## Teddy's Progress dashboard (`/dashboard`)

A private, Google-sign-in-gated page backed by a Neon Postgres database —
replaces the earlier Claude-artifact version. Three skill-tracker cards plus
a dated log that anyone signed in can add notes to.

### One-time setup

1. **Database**: open your Neon project in the [Neon console](https://console.neon.tech) →
   **SQL Editor**, paste the contents of `db/schema.sql`, and run it. This
   creates the `skills` and `updates` tables and seeds the three skills plus
   a kickoff log entry.
2. **Google sign-in**: go to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials),
   create an **OAuth client ID** (type: Web application). Add this redirect URI:
   - `http://localhost:3000/api/auth/callback/google` (for local testing)
   - `https://<your-vercel-domain>/api/auth/callback/google` (once deployed — add this after your first deploy, when you know the domain)

   Copy the generated **Client ID** and **Client Secret**.
3. **Environment variables**: copy `.env.local.example` to `.env.local` and fill in:
   - `DATABASE_URL` — already set for you (the Neon pooled connection string)
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — from step 2
   - `ALLOWED_EMAILS` — comma-separated list of Google accounts allowed in (you + the teacher)
   - `NEXTAUTH_SECRET` — already generated for you
   - `NEXTAUTH_URL` — `http://localhost:3000` locally; update to your real domain in Vercel's env settings once deployed
4. **On Vercel**: add all of the above (except `NEXTAUTH_URL`, which you set to your production URL instead) under Project Settings → Environment Variables. Never commit `.env.local` — it's gitignored.

### Day to day

Anyone in `ALLOWED_EMAILS` can sign in at `/dashboard` with Google and add a
log entry. Moving a skill to "in progress" or "done" also nudges that
skill's official progress bar forward (never backward) — the skill
descriptions themselves can only be edited directly in the database.

## Content calendar browser (`/posts`)

A single page showing all 30 days of the content calendar as cards — search
by topic/caption/day, filter by Core vs. Repurpose or by platform, and copy
any caption to the clipboard with one click. Not indexed by search engines
(it's a working tool, not a public page).

- Data lives in `data/posts.json` (30 entries: day, date, weekday, type,
  pillar, format, platforms, caption, notes). Edit this file to update a
  caption or add notes — the page reads straight from it, no rebuild logic
  needed beyond redeploying.
- UI lives in `app/posts/PostsClient.tsx`.

## Editing content later

- To change any text: edit the matching key in `dictionaries/en.json` /
  `th.json` / `zh.json` — all three files share the same shape.
- To change the follow-platform links: edit `PLATFORM_LINKS` at the top of
  `app/[locale]/page.tsx` with Teddy's real TikTok/Instagram/YouTube/
  Facebook/LINE URLs (currently placeholders).
- To add a new content pillar card: add an item to `pillars.items` in each
  of the three dictionary files (same index across all three).
