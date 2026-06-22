import episodesData from "../content/episodes.json";
import type { Episode } from "./types";
import { mergeEpisodeExtras } from "./episode-extras";

// Merge the durable extras layer (Apple/Amazon deep links, transcript) onto the
// Spotify-derived records once, at module load. The fetch never writes those
// fields, so this is where they enter the data the site renders.
const raw = (episodesData as Episode[]).map(mergeEpisodeExtras);

export function getAllEpisodes(): Episode[] {
  return [...raw].sort((a, b) => b.episodeNumber - a.episodeNumber);
}

export function getEpisodeBySlug(slug: string): Episode | undefined {
  return raw.find((ep) => ep.slug === slug);
}

/**
 * Featured-episode resolution:
 *   1. If one or more episodes have `featured: true`, pick the newest of them.
 *   2. Otherwise, fall back to the most recent episode overall.
 */
export function getFeaturedEpisode(): Episode | undefined {
  const sorted = getAllEpisodes();
  const featured = sorted.filter((ep) => ep.featured);
  if (featured.length > 0) return featured[0];
  return sorted[0];
}

export function getRelatedEpisodes(current: Episode, count = 3): Episode[] {
  const sorted = getAllEpisodes();
  const others = sorted.filter((ep) => ep.id !== current.id);
  if (others.length === 0) return [];

  const anchor = others.findIndex(
    (ep) => ep.episodeNumber < current.episodeNumber,
  );
  const start = anchor === -1 ? 0 : anchor;

  const out: Episode[] = [];
  for (let i = 0; i < count && i < others.length; i++) {
    out.push(others[(start + i) % others.length]);
  }
  return out;
}

/**
 * Parse a date string defensively. Safari throws "Invalid Date" on many
 * non-ISO strings Chrome tolerates (e.g. "2025-03-04 12:00", "2025/03/04"),
 * which would then crash any `.toLocaleDateString()` / getter call. So we
 * trust only ISO 8601: a bare "YYYY-MM-DD" is pinned to UTC midnight, and the
 * space- and slash-separated forms are rejected. Returns null when the input
 * can't be trusted, so callers never compute on an Invalid Date.
 */
export function parseIsoDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const raw = value.trim();
  if (!raw || raw === "TBD") return null;
  // Bare calendar date → pin to UTC midnight so it parses identically in every
  // engine (Safari treats "2025-03-04" as UTC but "2025-03-04 12:00" as Invalid).
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(raw) ? `${raw}T00:00:00Z` : raw;
  // Require a real ISO shape (date, optionally followed by a "T" time part).
  if (!/^\d{4}-\d{2}-\d{2}(T.*)?$/.test(iso)) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatPublishedDate(iso: string): string {
  const date = parseIsoDate(iso);
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
