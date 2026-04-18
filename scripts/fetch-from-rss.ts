/**
 * Fetches the full episode catalog from the show's public RSS feed hosted on
 * Anchor (Spotify for Podcasters) and writes /content/episodes.json.
 *
 * No credentials required. The RSS feed URL is committed below because it's
 * published publicly on ericsadhdexperience.com.
 *
 *   npm run fetch-episodes
 */

import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";

import type { Episode } from "../lib/types";

const RSS_URL = "https://anchor.fm/s/7b5fead0/podcast/rss";
const OUTPUT_PATH = path.resolve(process.cwd(), "content", "episodes.json");
const BACKUP_PATH = path.resolve(
  process.cwd(),
  "content",
  "episodes.backup.json",
);

type RssItem = {
  title: string;
  description: string;
  link: string;
  guid: string;
  pubDate: string;
  enclosureUrl: string;
  duration: string | null;
  itunesImage: string | null;
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

function stripHtml(html: string): string {
  return cheerio
    .load(`<x>${html}</x>`, { xml: false })("x")
    .text()
    .replace(/\s+/g, " ")
    .trim();
}

function parseEpisodeNumber(title: string, description: string): number | null {
  const candidates = [
    title.match(/\bEp(?:isode)?\s*#?\s*(\d{1,4})\b/i),
    title.match(/\|\s*Ep\s*(\d{1,4})\s*\|/i),
    description.match(/\bEp(?:isode)?\s*#?\s*(\d{1,4})\b/i),
  ];
  for (const m of candidates) {
    if (m) return Number.parseInt(m[1], 10);
  }
  return null;
}

function cleanTitle(raw: string): string {
  // Titles like "9 Lives | Ep 15 | Eric's ADHD Experience"
  // Strip the "| Ep NN | ..." suffix, keeping just the topic.
  return raw
    .replace(/\s*\|\s*Ep(?:isode)?\s*\d+\s*\|\s*.*$/i, "")
    .replace(/\s*\|\s*Eric'?s\s+ADHD\s+Experience\s*$/i, "")
    .trim();
}

async function fetchRss(): Promise<string> {
  const res = await fetch(RSS_URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; ChairapySiteBuilder/1.0; +https://podcast.chairapy.org)",
      Accept: "application/rss+xml, application/xml, text/xml, */*",
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch RSS (${res.status}): ${RSS_URL}`);
  }
  return res.text();
}

function parseRss(xml: string): RssItem[] {
  const $ = cheerio.load(xml, { xml: true });
  const items: RssItem[] = [];

  $("item").each((_i, el) => {
    const $el = $(el);
    const title = $el.find("title").first().text().trim();
    const description = $el.find("description").first().text().trim();
    const link = $el.find("link").first().text().trim();
    const guid = $el.find("guid").first().text().trim();
    const pubDate = $el.find("pubDate").first().text().trim();
    const enclosureUrl = $el.find("enclosure").first().attr("url") ?? "";
    const duration = $el.find("itunes\\:duration, duration").first().text().trim() || null;
    const itunesImage =
      $el.find("itunes\\:image, image").first().attr("href") ?? null;

    if (!title || !enclosureUrl) return;

    items.push({
      title,
      description,
      link,
      guid,
      pubDate,
      enclosureUrl,
      duration,
      itunesImage,
    });
  });

  return items;
}

function transformToEpisodes(items: RssItem[]): Episode[] {
  // RSS returns newest first. Assign episode numbers so oldest = 1, newest = N
  // when the title doesn't declare one explicitly.
  const withMeta = items.map((item) => ({
    item,
    parsedNumber: parseEpisodeNumber(item.title, item.description),
  }));

  const fallbackTotal = withMeta.length;
  return withMeta.map((entry, index) => {
    const { item, parsedNumber } = entry;
    const episodeNumber = parsedNumber ?? fallbackTotal - index;
    const cleaned = cleanTitle(item.title);
    const titleForSlug = cleaned || item.title;
    const slug = `ep-${episodeNumber}-${slugify(titleForSlug)}`;
    const longDescription = stripHtml(item.description);
    const shortDescription = longDescription.slice(0, 200);

    // Publish date -> ISO
    let iso = item.pubDate;
    const parsedDate = new Date(item.pubDate);
    if (!Number.isNaN(parsedDate.getTime())) iso = parsedDate.toISOString();

    const ep: Episode = {
      id: item.guid || slug,
      episodeNumber,
      slug,
      title: cleaned || item.title,
      guestName: null,
      publishedDate: iso,
      spotifyEmbedUrl: null,
      applePodcastsUrl: null,
      amazonMusicUrl: null,
      description: shortDescription,
      longDescription,
      topics: [],
      featured: false,
      thumbnailUrl: item.itunesImage,
      audioUrl: item.enclosureUrl,
      duration: item.duration,
    };
    return ep;
  });
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

function preserveFields(
  existing: Episode[],
  fresh: Episode[],
): Episode[] {
  const byNumber = new Map<number, Episode>();
  const byId = new Map<string, Episode>();
  for (const ep of existing) {
    byNumber.set(ep.episodeNumber, ep);
    byId.set(ep.id, ep);
  }

  let featurePreserved = false;
  const merged = fresh.map((ep) => {
    const prior = byId.get(ep.id) ?? byNumber.get(ep.episodeNumber);
    if (!prior) return ep;

    const next = { ...ep };
    if (prior.featured) {
      next.featured = true;
      featurePreserved = true;
    }
    if (prior.spotifyEmbedUrl) next.spotifyEmbedUrl = prior.spotifyEmbedUrl;
    if (prior.applePodcastsUrl) next.applePodcastsUrl = prior.applePodcastsUrl;
    if (prior.amazonMusicUrl) next.amazonMusicUrl = prior.amazonMusicUrl;
    if (prior.thumbnailUrl) next.thumbnailUrl = prior.thumbnailUrl;
    if (prior.topics.length) next.topics = prior.topics;
    if (prior.guestName) next.guestName = prior.guestName;
    if (prior.duration && !next.duration) next.duration = prior.duration;
    return next;
  });

  if (!featurePreserved) {
    const ep15 = merged.find((ep) => ep.episodeNumber === 15);
    if (ep15) ep15.featured = true;
  }

  return merged;
}

async function main() {
  console.log(`[fetch-episodes] Fetching RSS from ${RSS_URL}`);
  const xml = await fetchRss();
  const items = parseRss(xml);
  if (items.length === 0) {
    console.error("[fetch-episodes] RSS returned no items. Aborting.");
    process.exit(1);
  }
  console.log(`[fetch-episodes] Parsed ${items.length} episodes.`);

  const fresh = disambiguateSlugs(transformToEpisodes(items));

  let existing: Episode[] = [];
  if (fs.existsSync(OUTPUT_PATH)) {
    try {
      existing = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf-8")) as Episode[];
      fs.writeFileSync(BACKUP_PATH, JSON.stringify(existing, null, 2) + "\n");
      console.log(
        `[fetch-episodes] Backed up prior file to ${path.relative(process.cwd(), BACKUP_PATH)}.`,
      );
    } catch {
      console.warn(
        "[fetch-episodes] Could not parse existing episodes.json — continuing without backup.",
      );
    }
  }

  const merged = preserveFields(existing, fresh);
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(merged, null, 2) + "\n");

  const featured = merged.filter((ep) => ep.featured);
  console.log(
    `[fetch-episodes] Wrote ${merged.length} episodes to ${path.relative(process.cwd(), OUTPUT_PATH)}.`,
  );
  if (featured.length > 0) {
    console.log(
      `[fetch-episodes] Featured: ${featured
        .map((ep) => `Ep ${ep.episodeNumber} "${ep.title}"`)
        .join(", ")}`,
    );
  }
}

main().catch((err) => {
  console.error("[fetch-episodes] Error:", err);
  process.exit(1);
});
