export interface Episode {
  id: string;
  episodeNumber: number;
  slug: string;
  title: string;
  guestName: string | null;
  publishedDate: string;
  spotifyEmbedUrl: string | null;
  applePodcastsUrl: string | null;
  amazonMusicUrl: string | null;
  description: string;
  longDescription: string | null;
  topics: string[];
  featured: boolean;
  thumbnailUrl?: string | null;
  audioUrl?: string | null;
  duration?: string | null; // "hh:mm:ss" from RSS itunes:duration
  /**
   * Per-episode Spotify URL. Captured automatically by the fetch script from
   * the feed's per-item link (an open.spotify.com / podcasters.spotify.com
   * episode page), so it costs nothing to keep current. Null when the feed
   * carried no usable link.
   */
  spotifyUrl?: string | null;
  /**
   * Per-episode deep links + transcript merged in from the durable extras
   * layer (content/episode-extras.json). The fetch never writes these, so a
   * hand-entered value survives every re-fetch. See {@link EpisodeExtras}.
   */
  appleUrl?: string | null;
  amazonUrl?: string | null;
  transcript?: string | null;
}

/**
 * Hand-edited, fetch-proof additions for a single episode. Lives in
 * content/episode-extras.json keyed by episode slug (preferred, human-readable)
 * or id (the RSS guid). Every field is optional; an episode with no entry — or
 * an entry with only some fields set — still builds and renders cleanly. The
 * Spotify fetch NEVER touches this file, so anything here is durable.
 */
export interface EpisodeExtras {
  /** Apple Podcasts URL for THIS episode (not the show). */
  appleUrl?: string | null;
  /** Amazon Music URL for THIS episode (not the show). */
  amazonUrl?: string | null;
  /** Full transcript, plain text. Blank lines separate paragraphs; a leading
   *  "Speaker:" on a paragraph is rendered as a speaker label. */
  transcript?: string | null;
}

export interface GuestImage {
  src: string;
  alt: string;
  credit?: string;
  caption?: string;
}

export interface Guest {
  slug: string;
  name: string;
  role: string;
  bio: string;
  location?: string;
  links?: {
    website?: string;
    instagram?: string;
    linkedin?: string;
  };
  heroImage?: GuestImage;
  gallery?: GuestImage[];
  /** Episode slugs (not ids). Matches Episode.slug in content/episodes.json. */
  episodes: string[];
}

export interface ShowInfo {
  showName: string;
  productionLabel: string;
  showTagline: string;
  hostName: string;
  hostLocation: string;
  hostShortBio: string;
  hostLongBio: string;
  showDescription: string;
  showDescriptionLong: string;
  distributionLinks: {
    spotify: string;
    apple: string;
    amazon: string;
    youtube: string | null;
    rss?: string | null;
  };
  socialLinks: {
    instagram: string;
    tiktok: string;
    facebook: string;
    rumble?: string | null;
  };
  contactEmail: string | null;
  episodeCount: string;
  recordingLocation: string;
  brandPositioning: string;
}

export function isValidUrl(value: string | null | undefined): value is string {
  if (!value) return false;
  return value.startsWith("http://") || value.startsWith("https://");
}
