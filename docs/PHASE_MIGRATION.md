# Phase migration plan — from ericsadhdexperience.com to podcast.chairapy.org

This document captures how the new Chairapy-branded podcast site replaces the
existing Podpage site over time. It exists so the plan isn't lost between
sessions.

## Current state (Phase 1 — soft launch)

- **ericsadhdexperience.com** — live on Podpage. Unchanged. Still the canonical
  URL in all existing podcast platform descriptions and past clip captions.
- **podcast.chairapy.org** — this repo. Launched as a parallel, owned site.
- RSS feed URL is **unchanged** — the show still publishes through its existing
  host. This new site is a listener-facing destination, not a feed change.

During Phase 1:

- Do NOT edit ericsadhdexperience.com.
- Do NOT submit the show to any new podcast directories.
- Do NOT claim the show on YouTube Podcasts yet.
- Social media bios, email signatures, and *new* clip captions can start
  pointing at podcast.chairapy.org.
- Old clip captions and existing platform descriptions stay as-is — migrating
  them is a batched operation for later.
- Launch is soft — do not announce via Eric's channels until Anthony gives the
  go-ahead.

## Phase 2 (month 2–3) — cutover

Triggered when podcast.chairapy.org has proven organic traffic. Anthony decides
when that threshold is met.

1. Add a 301 redirect from ericsadhdexperience.com to podcast.chairapy.org.
   - Podpage may or may not expose redirect configuration; if not, plan to
     point the domain at a minimal redirect service (Cloudflare worker or a
     Vercel project with a catch-all rewrite) before cancelling Podpage.
2. Update every podcast platform description (Spotify, Apple Podcasts, Amazon
   Music) to point at podcast.chairapy.org.
3. Update show-notes URLs in the most recent 10–20 episodes on the host side
   to link to the corresponding new episode page.
4. Claim the show on YouTube Podcasts and point its "show website" field at
   podcast.chairapy.org.
5. After 30 days with redirect in place, cancel the Podpage subscription.

## Pre-launch checklist (Phase 1)

Before declaring the site live:

- [ ] `npm run build` passes cleanly
- [ ] `npm run fetch-episodes` has been run with real Spotify credentials and
      `content/episodes.json` holds the full catalog
- [ ] ConvertKit form ID is set in Vercel env and signup round-trips end-to-end
      with a real inbox
- [ ] Spotify players play on homepage and on a sample of episode pages
- [ ] `sitemap.xml` is accessible at `/sitemap.xml` and lists every episode
- [ ] `robots.txt` is accessible at `/robots.txt`
- [ ] Per-episode JSON-LD validates via Google's Rich Results Test
- [ ] `PodcastSeries` JSON-LD on the homepage validates
- [ ] OpenGraph preview looks clean on Twitter/X, Facebook, LinkedIn
- [ ] Lighthouse ≥ 90 on Performance, Accessibility, Best Practices, SEO
- [ ] Mobile QA at 375px, tablet at 768px, desktop at 1200px
- [ ] Google Search Console: verify the domain, submit the sitemap
- [ ] Bing Webmaster Tools: verify the domain, submit the sitemap
- [ ] A backup of the current ericsadhdexperience.com content is saved
      (HTML/PDF archive) in case anything needs to be recovered later

## Environment variables (Vercel production)

Required:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL. `https://podcast.chairapy.org` in prod, a `*.vercel.app` URL if domain isn't live yet. |
| `SPOTIFY_CLIENT_ID` | Spotify app client ID — only used by `scripts/fetch-episodes.ts` locally, not at runtime. |
| `SPOTIFY_CLIENT_SECRET` | Spotify app client secret — local only. |
| `CONVERTKIT_API_KEY` | ConvertKit v3 API key. Server-only. |
| `CONVERTKIT_FORM_ID` | ConvertKit form ID that listeners are subscribed into. |

Optional:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | If set, loads the Plausible tracking script with this `data-domain`. Leave unset locally to disable analytics in dev. |

## DNS

Primary: add a CNAME at Namecheap for `podcast.chairapy.org` pointing at the
Vercel-provided deployment hostname. Verify in Vercel project → Domains.
Interim fallback is the default `*.vercel.app` URL — if we launch on that, set
`NEXT_PUBLIC_SITE_URL` to match so canonical URLs, sitemap, robots, and
OpenGraph all agree.

## Content operations that stay manual

- **Guest → episode mapping.** `scripts/suggest-guest-links.ts` surfaces
  candidates; Anthony reviews and hand-edits `content/guests.json` to avoid
  false positives.
- **Featured episode.** `featured: true` is set by hand on the episode that
  should anchor the homepage. The fetch script preserves the flag across
  re-pulls.

## Out of scope (explicitly)

- Transcripts
- Comments / social features
- In-browser clip cutting
- Paid acquisition
