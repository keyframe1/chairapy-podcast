/**
 * Fetches the full episode catalog for Eric's ADHD Experience from the public
 * Spotify Web API using the client-credentials flow (no user auth required)
 * and writes the result to /content/episodes.json.
 *
 * Run with:   npm run fetch-episodes
 *
 * Requires SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local.
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import type { Episode } from "../lib/types";

const SHOW_ID = "7js9w3OGKcx153xlh9rBId";
const MARKET = "US";
const OUTPUT_PATH = path.resolve(
  process.cwd(),
  "content",
  "episodes.json",
);
const BACKUP_PATH = path.resolve(
  process.cwd(),
  "content",
  "episodes.backup.json",
);

type SpotifyEpisode = {
  id: string;
  name: string;
  description: string;
  release_date: string;
  duration_ms: number;
};

type SpotifyEpisodesPage = {
  items: SpotifyEpisode[];
  total: number;
  next: string | null;
};

function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf-8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    const value = line
      .slice(eq + 1)
      .trim()
      .replace(/^['"]|['"]$/g, "");
    if (!(key in process.env)) process.env[key] = value;
  }
}

function die(message: string): never {
  console.error(`\n[fetch-episodes] ${message}\n`);
  process.exit(1);
}

async function getAccessToken(
  clientId: string,
  clientSecret: string,
): Promise<string> {
  const creds = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const text = await res.text();
    die(
      `Spotify token request failed (${res.status}): ${text}\n\n` +
        "Double-check SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local.",
    );
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

async function fetchWithRetry(url: string, token: string): Promise<Response> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status !== 429) return res;

    const retryAfter = Number(res.headers.get("retry-after") ?? "1");
    const waitMs = Math.max(1, retryAfter) * 1000;
    console.warn(
      `[fetch-episodes] Rate-limited by Spotify — waiting ${waitMs}ms (attempt ${attempt + 1}/5).`,
    );
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  die("Spotify kept returning 429 after 5 retries. Try again later.");
}

async function fetchAllEpisodes(token: string): Promise<SpotifyEpisode[]> {
  const all: SpotifyEpisode[] = [];
  let url:
    | string
    | null = `https://api.spotify.com/v1/shows/${SHOW_ID}/episodes?market=${MARKET}&limit=50`;

  while (url) {
    const res = await fetchWithRetry(url, token);

    if (!res.ok) {
      const text = await res.text();
      die(`Spotify episodes fetch failed (${res.status}): ${text}`);
    }

    const page = (await res.json()) as SpotifyEpisodesPage;
    for (const item of page.items) {
      if (item) all.push(item);
    }
    url = page.next;
  }

  return all;
}

function disambiguateSlugs(episodes: Episode[]): Episode[] {
  const seen = new Map<string, number>();
  return episodes.map((ep) => {
    const count = seen.get(ep.slug) ?? 0;
    seen.set(ep.slug, count + 1);
    if (count === 0) return ep;
    return { ...ep, slug: `${ep.slug}-${count + 1}` };
  });
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

function transformEpisode(
  spotifyEp: SpotifyEpisode,
  index: number,
  total: number,
): Episode {
  const episodeNumber = total - index;
  const slug = slugify(spotifyEp.name);

  return {
    id: spotifyEp.id,
    episodeNumber,
    slug: `ep-${episodeNumber}-${slug}`,
    title: spotifyEp.name,
    guestName: null,
    publishedDate: spotifyEp.release_date,
    spotifyEmbedUrl: `https://open.spotify.com/embed/episode/${spotifyEp.id}`,
    applePodcastsUrl: null,
    amazonMusicUrl: null,
    description: spotifyEp.description.slice(0, 200),
    longDescription: spotifyEp.description,
    topics: [],
    featured: false,
  };
}

function preserveFeaturedFlags(
  existing: Episode[],
  fresh: Episode[],
): Episode[] {
  const featuredIds = new Set(
    existing.filter((ep) => ep.featured).map((ep) => ep.id),
  );
  const featuredNumbers = new Set(
    existing.filter((ep) => ep.featured).map((ep) => ep.episodeNumber),
  );

  let hit = false;
  const next = fresh.map((ep) => {
    if (featuredIds.has(ep.id) || featuredNumbers.has(ep.episodeNumber)) {
      hit = true;
      return { ...ep, featured: true };
    }
    return ep;
  });

  if (!hit) {
    const ep15 = next.find((ep) => ep.episodeNumber === 15);
    if (ep15) ep15.featured = true;
  }

  return next;
}

async function main() {
  loadEnvLocal();

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    die(
      "Missing Spotify credentials.\n\n" +
        "1. Create an app at https://developer.spotify.com/dashboard\n" +
        "2. Copy the Client ID and Client Secret into .env.local:\n\n" +
        "   SPOTIFY_CLIENT_ID=your_client_id\n" +
        "   SPOTIFY_CLIENT_SECRET=your_client_secret\n\n" +
        "Then re-run `npm run fetch-episodes`.\n\n" +
        "Your existing content/episodes.json was not modified.",
    );
  }

  console.log("[fetch-episodes] Authenticating with Spotify…");
  const token = await getAccessToken(clientId, clientSecret);

  console.log("[fetch-episodes] Fetching episode list…");
  const spotifyEpisodes = await fetchAllEpisodes(token);
  if (spotifyEpisodes.length === 0) {
    die("Spotify returned zero episodes. Aborting without overwriting existing file.");
  }
  console.log(`[fetch-episodes] Received ${spotifyEpisodes.length} episodes.`);

  const total = spotifyEpisodes.length;
  const episodes = disambiguateSlugs(
    spotifyEpisodes.map((ep, i) => transformEpisode(ep, i, total)),
  );

  let existing: Episode[] = [];
  if (fs.existsSync(OUTPUT_PATH)) {
    try {
      existing = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf-8")) as Episode[];
      fs.writeFileSync(BACKUP_PATH, JSON.stringify(existing, null, 2) + "\n");
      console.log(
        `[fetch-episodes] Backup of prior file written to ${path.relative(process.cwd(), BACKUP_PATH)}.`,
      );
    } catch {
      console.warn(
        "[fetch-episodes] Could not parse existing episodes.json — continuing without backup.",
      );
    }
  }

  const merged = preserveFeaturedFlags(existing, episodes);

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(merged, null, 2) + "\n");
  console.log(
    `[fetch-episodes] Wrote ${merged.length} episodes to ${path.relative(process.cwd(), OUTPUT_PATH)}.`,
  );

  const featured = merged.filter((ep) => ep.featured);
  if (featured.length > 0) {
    console.log(
      `[fetch-episodes] Featured: ${featured.map((ep) => `Ep ${ep.episodeNumber} "${ep.title}"`).join(", ")}`,
    );
  } else {
    console.log(
      "[fetch-episodes] No episode marked featured. Set featured:true on an episode in content/episodes.json to highlight it on the homepage.",
    );
  }
}

main().catch((err: unknown) => {
  console.error("[fetch-episodes] Unexpected error:", err);
  process.exit(1);
});
