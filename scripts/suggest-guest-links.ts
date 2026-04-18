/**
 * Scans the pulled episode catalog for mentions of each verified guest's name
 * and prints suggested episode matches. Does NOT modify guests.json — the user
 * confirms each match manually to avoid false positives.
 *
 * Run with:   npm run suggest-guest-links
 */

import fs from "node:fs";
import path from "node:path";

import type { Episode, Guest } from "../lib/types";

const EPISODES_PATH = path.resolve(process.cwd(), "content", "episodes.json");
const GUESTS_PATH = path.resolve(process.cwd(), "content", "guests.json");

function loadJson<T>(filePath: string): T {
  if (!fs.existsSync(filePath)) {
    console.error(`[suggest-guest-links] Missing file: ${filePath}`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildNameNeedles(guest: Guest): string[] {
  const needles = new Set<string>();
  needles.add(guest.name);

  const parens = guest.name.match(/\(([^)]+)\)/);
  if (parens) needles.add(parens[1].trim());

  const stripped = guest.name.replace(/\([^)]*\)/g, "").trim();
  if (stripped) needles.add(stripped);

  const firstLast = stripped.split(/\s+/);
  if (firstLast.length >= 2) {
    needles.add(`${firstLast[0]} ${firstLast[firstLast.length - 1]}`);
  }

  return Array.from(needles).filter((n) => n.length > 2);
}

function findMatches(guest: Guest, episodes: Episode[]): Episode[] {
  const needles = buildNameNeedles(guest);
  const hits = new Set<Episode>();

  for (const needle of needles) {
    const pattern = new RegExp(`\\b${escapeRegex(needle)}\\b`, "i");
    for (const ep of episodes) {
      const haystack = `${ep.title}\n${ep.description}\n${ep.longDescription ?? ""}`;
      if (pattern.test(haystack)) hits.add(ep);
    }
  }

  return Array.from(hits).sort((a, b) => b.episodeNumber - a.episodeNumber);
}

function main() {
  const episodes = loadJson<Episode[]>(EPISODES_PATH);
  const guests = loadJson<Guest[]>(GUESTS_PATH);

  if (episodes.length <= 1) {
    console.warn(
      "[suggest-guest-links] Only placeholder episodes in episodes.json. Run `npm run fetch-episodes` first.",
    );
    return;
  }

  console.log(
    `\n[suggest-guest-links] Searching ${episodes.length} episodes for ${guests.length} guests…\n`,
  );

  for (const guest of guests) {
    const matches = findMatches(guest, episodes);
    if (matches.length === 0) {
      console.log(`• ${guest.name} — no matches found`);
    } else {
      console.log(`• ${guest.name} may appear in:`);
      for (const ep of matches) {
        console.log(
          `    - Episode ${ep.episodeNumber}: "${ep.title}"  (id: ${ep.id})`,
        );
      }
    }
  }

  console.log(
    "\nReview each suggestion and manually update `episodes` (episode slugs) in content/guests.json.\n" +
      "This script never modifies guests.json automatically.\n",
  );
}

main();
