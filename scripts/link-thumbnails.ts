/**
 * Merges /content/episode-thumbnails.json (from fetch-thumbnails.ts) into
 * /content/episodes.json by matching episode number or title. Writes the
 * updated episodes.json with a `thumbnailUrl` field per episode.
 *
 *   npm run link-thumbnails
 */

import fs from "node:fs";
import path from "node:path";
import type { Episode } from "../lib/types";

const EPISODES_PATH = path.resolve(process.cwd(), "content", "episodes.json");
const THUMBNAILS_PATH = path.resolve(
  process.cwd(),
  "content",
  "episode-thumbnails.json",
);

type ThumbnailMapping = {
  episodeTitle: string;
  episodeNumber: number | null;
  originalUrl: string;
  localPath: string;
  filename: string;
};

function die(msg: string): never {
  console.error(`[link-thumbnails] ${msg}`);
  process.exit(1);
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function loadJson<T>(p: string): T {
  if (!fs.existsSync(p)) {
    die(`Missing file: ${p}`);
  }
  return JSON.parse(fs.readFileSync(p, "utf-8")) as T;
}

function findMatch(
  ep: Episode,
  thumbs: ThumbnailMapping[],
): ThumbnailMapping | undefined {
  // 1. Exact episode number
  const byNumber = thumbs.find((t) => t.episodeNumber === ep.episodeNumber);
  if (byNumber) return byNumber;

  const epTitleNorm = normalize(ep.title);
  if (!epTitleNorm) return undefined;

  // 2. Exact normalized title match
  const exact = thumbs.find((t) => normalize(t.episodeTitle) === epTitleNorm);
  if (exact) return exact;

  // 3. Strong substring: thumb title contains episode title or vice versa
  const substring = thumbs.find((t) => {
    const tNorm = normalize(t.episodeTitle);
    if (!tNorm) return false;
    return tNorm.includes(epTitleNorm) || epTitleNorm.includes(tNorm);
  });
  if (substring) return substring;

  return undefined;
}

function main() {
  const episodes = loadJson<Episode[]>(EPISODES_PATH);
  const thumbs = loadJson<ThumbnailMapping[]>(THUMBNAILS_PATH);

  if (thumbs.length === 0) {
    die(
      "No thumbnails in episode-thumbnails.json. Run `npm run fetch-thumbnails` first.",
    );
  }

  const usedThumbs = new Set<string>();
  let matched = 0;
  const unmatched: Episode[] = [];

  const updated = episodes.map((ep) => {
    const match = findMatch(ep, thumbs);
    if (match) {
      matched++;
      usedThumbs.add(match.filename);
      return { ...ep, thumbnailUrl: match.localPath };
    }
    unmatched.push(ep);
    return { ...ep, thumbnailUrl: ep.thumbnailUrl ?? null };
  });

  fs.writeFileSync(EPISODES_PATH, JSON.stringify(updated, null, 2) + "\n");

  console.log(
    `[link-thumbnails] Matched ${matched} of ${episodes.length} episodes to thumbnails.`,
  );

  if (unmatched.length > 0) {
    console.log(`\nUnmatched episodes (thumbnailUrl = null):`);
    for (const ep of unmatched) {
      console.log(
        `  - Ep ${ep.episodeNumber}: "${ep.title.slice(0, 70)}"`,
      );
    }
  }

  const unusedThumbs = thumbs.filter((t) => !usedThumbs.has(t.filename));
  if (unusedThumbs.length > 0) {
    console.log(`\nUnused thumbnails (no episode matched them):`);
    for (const t of unusedThumbs) {
      console.log(`  - ${t.filename}  ("${t.episodeTitle.slice(0, 60)}")`);
    }
  }

  console.log(
    `\n[link-thumbnails] Wrote ${path.relative(process.cwd(), EPISODES_PATH)}`,
  );
}

main();
