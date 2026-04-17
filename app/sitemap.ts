import type { MetadataRoute } from "next";
import { getAllEpisodes } from "../lib/episodes";
import guestsData from "../content/guests.json";
import type { Guest } from "../lib/types";
import { SITE_URL } from "../lib/site";

const guests = guestsData as Guest[];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { path: "", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/episodes", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/guests", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/about", priority: 0.7, changeFrequency: "yearly" as const },
    { path: "/subscribe", priority: 0.7, changeFrequency: "yearly" as const },
  ].map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  const episodePages: MetadataRoute.Sitemap = getAllEpisodes().map((ep) => {
    const parsed = new Date(ep.publishedDate);
    const lastModified = Number.isNaN(parsed.getTime()) ? now : parsed;
    return {
      url: `${SITE_URL}/episodes/${ep.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    };
  });

  const guestPages: MetadataRoute.Sitemap = guests.map((g) => ({
    url: `${SITE_URL}/guests/${g.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...episodePages, ...guestPages];
}
