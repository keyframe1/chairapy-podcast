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

export interface Guest {
  id: string;
  name: string;
  slug: string;
  headline: string;
  longBio: string | null;
  episodeIds: string[];
  externalLinks: {
    label: string;
    url: string;
  }[];
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
  };
  socialLinks: {
    instagram: string;
    tiktok: string;
    facebook: string;
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
