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
  showNamePhase1: string;
  showNamePhase3Candidate: string;
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
