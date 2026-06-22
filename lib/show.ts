import showInfoData from "../content/show-info.json";
import type { Episode, ShowInfo } from "./types";

/**
 * Single source for the show-level platform URLs. content/show-info.json is the
 * underlying data; everything that needs a show link (the Subscribe page, the
 * episode-page Follow CTA, and the per-episode buttons' fallback) reads it from
 * here so there is never a second, drifting list.
 */
export const showInfo = showInfoData as ShowInfo;

export const showLinks = {
  spotify: showInfo.distributionLinks.spotify,
  apple: showInfo.distributionLinks.apple,
  amazon: showInfo.distributionLinks.amazon,
  rss: showInfo.distributionLinks.rss ?? null,
  youtube: showInfo.distributionLinks.youtube,
  rumble: showInfo.socialLinks.rumble ?? null,
} as const;

/** The three audio platforms an episode can deep-link into. */
export type EpisodePlatform = "spotify" | "apple" | "amazon";

const SHOW_FALLBACK: Record<EpisodePlatform, string> = {
  spotify: showLinks.spotify,
  apple: showLinks.apple,
  amazon: showLinks.amazon,
};

const EPISODE_URL_FIELD: Record<EpisodePlatform, keyof Episode> = {
  spotify: "spotifyUrl",
  apple: "appleUrl",
  amazon: "amazonUrl",
};

function isHttp(value: unknown): value is string {
  return (
    typeof value === "string" &&
    (value.startsWith("http://") || value.startsWith("https://"))
  );
}

/**
 * Resolve the URL a platform button should open for a given episode: the
 * episode-specific deep link when present, otherwise the show-level link so the
 * button is never dead. In development, a missing per-platform episode URL logs
 * a warning naming the episode and platform, so gaps are visible and fillable
 * (drop the link into content/episode-extras.json).
 */
export function resolveEpisodePlatformUrl(
  episode: Episode,
  platform: EpisodePlatform,
): string {
  const episodeUrl = episode[EPISODE_URL_FIELD[platform]];
  if (isHttp(episodeUrl)) return episodeUrl;

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.warn(
      `[episode-links] Ep ${episode.episodeNumber} "${episode.title}" has no ${platform} URL — falling back to the show link. Add "${platform === "spotify" ? "spotifyUrl (auto from fetch)" : `${platform}Url`}" ${platform === "spotify" ? "" : "to content/episode-extras.json "}to deep-link this episode.`,
    );
  }
  return SHOW_FALLBACK[platform];
}
