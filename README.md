# Chairapy Podcast

The public website for *Eric's ADHD Experience*, hosted by Eric Falgout. Produced by Chairapy Media in New Orleans.

Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and static generation for every episode and guest page.

## Local development

```bash
npm install
cp .env.example .env.local
# Fill in .env.local with real values
npm run dev
```

The site runs at http://localhost:3000.

## Project structure

```
/app              Next.js App Router pages and API routes
/components       UI components (layout, podcast-specific, primitives)
/content          JSON content files (episodes, guests, show info)
/lib              Shared types and site-wide constants
/public           Static assets (favicon, OG image, etc.)
/scripts          One-off scripts (episode fetch, guest linking)
/styles           Global CSS and design tokens
/docs             Phase migration plan and ops documentation
```

## Content updates

Content lives in three JSON files:

- `content/show-info.json` — show metadata, host bio, distribution links
- `content/episodes.json` — episode catalog (pulled from Spotify, can be hand-edited)
- `content/guests.json` — guest roster with episode links

### Refreshing the episode catalog

Episodes are pulled from the public Spotify Web API.

```bash
npm run fetch-episodes
```

Requires `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` in `.env.local`. The script writes to `content/episodes.json` and backs up the previous version to `content/episodes.backup.json`. Review the diff, commit if it looks correct.

### Linking guests to their episodes

After a fresh episode pull, run the guest-linker to see which episodes mention which guests:

```bash
npm run suggest-guest-links
```

Suggestions print to console. The script does NOT modify `content/guests.json` — update it by hand to avoid false positives.

## Deployment

Deployed to Vercel. Production URL: `https://podcast.chairapy.org`.

Environment variables are configured in the Vercel project dashboard. See `.env.example` for the full list.

Phase migration from the legacy ericsadhdexperience.com site is documented in [`docs/PHASE_MIGRATION.md`](./docs/PHASE_MIGRATION.md).

## Brand notes

This is Phase 1 of a multi-phase engagement. During Phase 1, the show retains its original name (*Eric's ADHD Experience*) and the legacy Podpage site remains live at ericsadhdexperience.com. This site launches as a parallel destination at podcast.chairapy.org and will replace the legacy site in Phase 2.

See [`docs/PHASE_MIGRATION.md`](./docs/PHASE_MIGRATION.md) for the full cutover plan.

## License

Proprietary. All content and branding belongs to Eric Falgout and Chairapy Media. Code is not licensed for public reuse.
