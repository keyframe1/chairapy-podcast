/**
 * Downloads every .avif episode thumbnail from the legacy Podpage site
 * (ericsadhdexperience.com) into /public/images/episodes/ and writes a mapping
 * file at /content/episode-thumbnails.json.
 *
 * Run once (or any time Eric adds a new episode on the legacy site and we want
 * to pull the new thumb).
 *
 *   npm run fetch-thumbnails
 */

import fs from "node:fs/promises";
import path from "node:path";
import * as cheerio from "cheerio";
import type { AnyNode } from "domhandler";

const SOURCE_URL = "https://www.ericsadhdexperience.com/episodes/";
const OUTPUT_DIR = path.join(process.cwd(), "public", "images", "episodes");
const MAPPING_FILE = path.join(
  process.cwd(),
  "content",
  "episode-thumbnails.json",
);
const USER_AGENT =
  "Mozilla/5.0 (compatible; ChairapySiteBuilder/1.0; +https://podcast.chairapy.org)";
const REQUEST_DELAY_MS = 150;
const DRY_RUN = process.argv.includes("--dry-run");

type ThumbnailMapping = {
  episodeTitle: string;
  episodeNumber: number | null;
  originalUrl: string;
  localPath: string;
  filename: string;
};

function sanitize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function normalizeSrc(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const first = raw.split(",")[0]?.trim().split(" ")[0];
  return first || undefined;
}

function extractAvifFromSrcset(srcset: string | undefined): string | undefined {
  if (!srcset) return undefined;
  const entries = srcset.split(",").map((s) => s.trim().split(" ")[0]);
  return entries.find((u) => u?.toLowerCase().includes(".avif"));
}

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  return res.text();
}

async function downloadImage(url: string, destPath: string): Promise<boolean> {
  try {
    await fs.access(destPath);
    return false;
  } catch {
    // fall through to download
  }

  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) {
    console.warn(`  ! ${res.status} ${url}`);
    return false;
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(destPath, buffer);
  return true;
}

type CandidateSource = { el: AnyNode; $: cheerio.CheerioAPI };

function extractImageUrl(
  $card: cheerio.Cheerio<AnyNode>,
): string | undefined {
  const img = $card.find("img").first();
  if (img.length) {
    const fromSrcset = extractAvifFromSrcset(img.attr("srcset"));
    if (fromSrcset) return fromSrcset;

    const candidates = [
      img.attr("src"),
      img.attr("data-src"),
      img.attr("data-lazy-src"),
      img.attr("data-original"),
    ];
    for (const c of candidates) {
      const norm = normalizeSrc(c ?? undefined);
      if (norm && norm.toLowerCase().includes(".avif")) return norm;
    }
  }

  // Fallback: look for a CSS background-image on the card or its descendants.
  const bg = $card
    .find("[style*='background-image']")
    .add($card.filter("[style*='background-image']"))
    .first()
    .attr("style");
  if (bg) {
    const match = bg.match(/url\(['"]?([^'")]+\.avif[^'")]*)['"]?\)/i);
    if (match) return match[1];
  }

  return undefined;
}

function extractTitle($card: cheerio.Cheerio<AnyNode>): string {
  const imgAlt = $card.find("img").first().attr("alt")?.trim();
  if (imgAlt) return imgAlt;

  const heading = $card
    .find("h1, h2, h3, h4, [class*='title'], [class*='Title']")
    .first()
    .text()
    .trim();
  if (heading) return heading;

  const linkText = $card.text().trim().split(/\s{2,}|\n/)[0]?.trim();
  return linkText || "Untitled";
}

function parseEpisodeNumber(title: string): number | null {
  const m = title.match(/\b(?:ep|episode)\s*\.?\s*#?\s*(\d+)/i);
  if (m) return Number.parseInt(m[1], 10);
  const leading = title.match(/^\s*#?(\d{1,3})\b/);
  if (leading) return Number.parseInt(leading[1], 10);
  return null;
}

async function main() {
  if (!DRY_RUN) await fs.mkdir(OUTPUT_DIR, { recursive: true });

  console.log(`[fetch-thumbnails] Fetching ${SOURCE_URL}`);
  const html = await fetchHtml(SOURCE_URL);
  const $ = cheerio.load(html);

  const selectors = [
    "a[href*='/episodes/']",
    "[class*='episode-card']",
    "[class*='EpisodeCard']",
    "article",
  ];

  const seen = new Set<AnyNode>();
  const candidates: CandidateSource[] = [];
  for (const sel of selectors) {
    $(sel).each((_, el) => {
      if (!seen.has(el)) {
        seen.add(el);
        candidates.push({ el, $ });
      }
    });
  }

  console.log(
    `[fetch-thumbnails] Scanning ${candidates.length} candidate elements…`,
  );

  const mappings: ThumbnailMapping[] = [];
  const byUrl = new Map<string, ThumbnailMapping>();

  for (const { el } of candidates) {
    const $card = $(el);
    const imgSrc = extractImageUrl($card);
    if (!imgSrc) continue;

    const absoluteUrl = imgSrc.startsWith("http")
      ? imgSrc
      : new URL(imgSrc, SOURCE_URL).toString();

    if (byUrl.has(absoluteUrl)) continue;

    const episodeTitle = extractTitle($card);
    const episodeNumber = parseEpisodeNumber(episodeTitle);

    const filename = episodeNumber
      ? `ep-${String(episodeNumber).padStart(3, "0")}-${sanitize(episodeTitle)}.avif`
      : `${sanitize(episodeTitle)}.avif`;

    const localPath = path.join(OUTPUT_DIR, filename);

    if (DRY_RUN) {
      console.log(
        `  [dry] ${episodeNumber ?? "?"} | ${episodeTitle.slice(0, 60)} -> ${filename}`,
      );
    } else {
      const downloaded = await downloadImage(absoluteUrl, localPath);
      if (downloaded) {
        console.log(`  ✓ ${filename}`);
      } else {
        console.log(`  = ${filename} (already exists)`);
      }
      await sleep(REQUEST_DELAY_MS);
    }

    const mapping: ThumbnailMapping = {
      episodeTitle,
      episodeNumber,
      originalUrl: absoluteUrl,
      localPath: `/images/episodes/${filename}`,
      filename,
    };
    mappings.push(mapping);
    byUrl.set(absoluteUrl, mapping);
  }

  if (DRY_RUN) {
    console.log(
      `\n[fetch-thumbnails] DRY RUN — ${mappings.length} thumbnails would be downloaded.`,
    );
    console.log(
      "If the count and titles above look right, rerun without --dry-run.",
    );
    return;
  }

  await fs.writeFile(MAPPING_FILE, JSON.stringify(mappings, null, 2) + "\n");
  console.log(
    `\n[fetch-thumbnails] Downloaded ${mappings.length} thumbnails.`,
  );
  console.log(
    `[fetch-thumbnails] Mapping written to ${path.relative(process.cwd(), MAPPING_FILE)}`,
  );
}

main().catch((err) => {
  console.error("[fetch-thumbnails] Error:", err);
  process.exit(1);
});
