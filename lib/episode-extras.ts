import extrasData from "../content/episode-extras.json";
import type { Episode, EpisodeExtras } from "./types";

/**
 * The durable, hand-edited extras layer. Keyed by episode slug (preferred) or
 * id (the RSS guid). The Spotify fetch never writes this file, so values here
 * survive every re-fetch — that's the whole point of keeping it separate from
 * the generated content/episodes.json. See {@link EpisodeExtras}.
 */
const extras = extrasData as Record<string, EpisodeExtras>;

/** Resolve the extras entry for an episode, trying slug first, then id. */
export function getEpisodeExtras(
  episode: Pick<Episode, "id" | "slug">,
): EpisodeExtras | undefined {
  return extras[episode.slug] ?? extras[episode.id];
}

/**
 * Non-destructive merge of the durable extras onto a Spotify-derived episode
 * record. Only fills fields the extras actually provide; everything else on the
 * episode is left exactly as the fetch produced it. An episode with no extras
 * entry is returned unchanged.
 */
export function mergeEpisodeExtras(episode: Episode): Episode {
  const extra = getEpisodeExtras(episode);
  if (!extra) return episode;
  return {
    ...episode,
    appleUrl: extra.appleUrl ?? episode.appleUrl ?? null,
    amazonUrl: extra.amazonUrl ?? episode.amazonUrl ?? null,
    transcript: extra.transcript ?? episode.transcript ?? null,
  };
}
