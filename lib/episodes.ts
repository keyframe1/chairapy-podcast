import episodesData from "../content/episodes.json";
import type { Episode } from "./types";

const raw = episodesData as Episode[];

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

export function formatPublishedDate(iso: string): string {
  if (!iso || iso === "TBD") return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
