# Karst Insights — firm and marketing site (karstinsights.com)

React 19 + Vite + Tailwind 4 + Framer Motion. Deploys via Cloudflare Pages on
push to `main` (repo: `anyra27/PFwebsite.main`).

```bash
npm run dev      # dev server
npm run build    # production build → dist/
npx tsc -b       # type-check (run before every commit)
```

## Pages

| Route | File | Purpose |
|---|---|---|
| `/` | `src/pages/Landing.tsx` | Homepage — workshop-first offering order |
| `/frame` | `src/pages/Frame.tsx` | Karst Frame product page |
| `/contact` | `src/pages/Contact.tsx` | Direct email introduction via `mailto:` |
| `/from-anyra`, `/anyra` | `src/pages/Note.tsx` | "Anyra is now Karst" transition note |
| `/briefings` | `src/pages/Briefings.tsx` | Briefings index (React, in nav) |
| `/briefings/<slug>/` | `public/briefings/<slug>/index.html` | Individual briefing (static) |

## Briefings

Plain, considered reads on what changes in AI and what it means for the work —
in the top nav, browsable, and built to be shared on LinkedIn/email. The
**index** is a React page (`src/pages/Briefings.tsx`, newest first); each
**briefing** is a rich standalone static page under `public/briefings/<slug>/`
that Cloudflare Pages serves before the SPA router, so it lives at a real URL
like `karstinsights.com/briefings/fable-5/`. The reframe vs. "Karst does not
advertise": a quiet library you can browse and share is word of mouth, not a
churning content feed — placement (no blog-spam energy) keeps it on-brand.

**To add one:**
1. Copy an existing folder under `public/briefings/` (the Fable 5 chassis is the
   current best), rename the slug, edit the copy.
2. Drop a hero photo from `../../media/library/nature/` into
   `public/briefings/assets/`; set it as the `.tropical-bg` background with the
   legibility scrim (see any existing briefing's CSS).
3. Generate a 1200×630 OG card: open `scripts/briefing-og.html?img=<asset>&eyebrow=<…>&title=<…>`
   at 1200×630, screenshot → `public/briefings/assets/og-<slug>.png`. Wire the
   `og:image` + `twitter:image` + canonical in the page `<head>`.
4. Add a card to the `BRIEFINGS` array in `src/pages/Briefings.tsx` and a `<url>`
   to `public/sitemap.xml`.

A daily cloud routine watches for major AI releases and emails kevin@anyra.ai
when something is briefing-worthy (see `/schedule` routines).

## House rules for this surface

- Voice: `../marketing/karst-voice.md` — every headline clears that bar.
- **No pricing on the site.** The day is scoped by conversation; proposals run
  through Proposal Engine v2.
- **No retainer / advisor / on-call language anywhere public.** Durable rule.
- The platform URL (`leadership.anyra.ai` until the platform moves to a Karst
  domain) lives in `src/config/brand.ts` as `PLATFORM_URL` — one-line swap.
- OG card: regenerate from `scripts/og-card.html` (1200×630 viewport
  screenshot → `public/og-card.png`).

## Analytics — one-time setup (dashboard, no code)

Web Analytics is wired through Cloudflare Pages' built-in toggle:

1. Cloudflare dashboard → Workers & Pages → the karstinsights.com Pages project
2. Metrics / Web Analytics → **Enable**

Cloudflare auto-injects the cookieless beacon at the edge — no consent banner
needed, no script in the repo. Contact messages stay in the visitor's normal email
system; the site does not store form submissions.
