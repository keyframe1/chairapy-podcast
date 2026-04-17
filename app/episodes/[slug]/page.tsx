import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import Container from "../../../components/ui/Container";
import EpisodeCard from "../../../components/podcast/EpisodeCard";
import SpotifyPlayer from "../../../components/podcast/SpotifyPlayer";
import EmailSignup from "../../../components/podcast/EmailSignup";

import {
  getAllEpisodes,
  getEpisodeBySlug,
  getRelatedEpisodes,
  formatPublishedDate,
} from "../../../lib/episodes";

import guestsData from "../../../content/guests.json";
import showInfoData from "../../../content/show-info.json";
import type { Guest, ShowInfo } from "../../../lib/types";
import { SITE_URL } from "../../../lib/site";

const guests = guestsData as Guest[];
const showInfo = showInfoData as ShowInfo;

export function generateStaticParams() {
  return getAllEpisodes().map((ep) => ({ slug: ep.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const episode = getEpisodeBySlug(params.slug);
  if (!episode) return { title: "Episode not found" };

  const description = (episode.longDescription ?? episode.description).slice(
    0,
    160,
  );

  const ogImages = episode.thumbnailUrl
    ? [
        {
          url: episode.thumbnailUrl,
          width: 1400,
          height: 1400,
          alt: `${episode.title} — episode artwork`,
        },
      ]
    : undefined;

  return {
    title: `${episode.title} · Episode ${episode.episodeNumber}`,
    description,
    openGraph: {
      title: `${episode.title} · Episode ${episode.episodeNumber} · ${showInfo.showName}`,
      description,
      type: "music.song",
      url: `${SITE_URL}/episodes/${episode.slug}`,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: `${episode.title} · Episode ${episode.episodeNumber}`,
      description,
      images: episode.thumbnailUrl ? [episode.thumbnailUrl] : undefined,
    },
  };
}

function findGuestsForEpisode(episodeId: string): Guest[] {
  return guests.filter((g) => g.episodeIds.includes(episodeId));
}

function isHttp(url: string | null | undefined): url is string {
  return !!url && (url.startsWith("http://") || url.startsWith("https://"));
}

export default function EpisodeDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const episode = getEpisodeBySlug(params.slug);
  if (!episode) notFound();

  const published = formatPublishedDate(episode.publishedDate);
  const related = getRelatedEpisodes(episode, 3);
  const linkedGuests = findGuestsForEpisode(episode.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "PodcastEpisode",
    name: episode.title,
    episodeNumber: episode.episodeNumber,
    description: episode.longDescription ?? episode.description,
    datePublished: episode.publishedDate,
    url: `${SITE_URL}/episodes/${episode.slug}`,
    partOfSeries: {
      "@type": "PodcastSeries",
      name: showInfo.showName,
      url: SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        {/* Above-the-fold */}
        <section className="py-16 md:py-20 border-b border-border">
          <Container width="content">
            <Link
              href="/episodes"
              className="inline-flex items-center gap-2 text-sm text-fg-muted hover:text-accent"
            >
              <span aria-hidden="true">←</span>
              <span>All episodes</span>
            </Link>

            <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-[0.2em] text-fg-muted">
              <span className="font-mono text-accent">
                Episode {episode.episodeNumber}
              </span>
              {published && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>Published {published}</span>
                </>
              )}
            </div>

            <h1 className="mt-4 font-display text-4xl md:text-6xl text-fg leading-tight">
              {episode.title}
            </h1>

            {episode.guestName && (
              <p className="mt-3 text-lg text-fg-muted">
                with {episode.guestName}
              </p>
            )}

            <div className="mt-10 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 items-start">
              {episode.thumbnailUrl && (
                <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-border bg-bg-elevated">
                  <Image
                    src={episode.thumbnailUrl}
                    alt={`${episode.title} — episode artwork`}
                    fill
                    sizes="(max-width: 768px) 100vw, 260px"
                    priority
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                {episode.spotifyEmbedUrl ? (
                  <SpotifyPlayer
                    embedUrl={episode.spotifyEmbedUrl}
                    lazy={false}
                  />
                ) : (
                  <div className="rounded-xl border border-border bg-bg-elevated p-8 text-center text-sm text-fg-muted">
                    Player coming soon. Run{" "}
                    <code className="font-mono text-fg">
                      npm run fetch-episodes
                    </code>{" "}
                    to pull Spotify embed data.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              {isHttp(showInfo.distributionLinks.spotify) && (
                <a
                  href={showInfo.distributionLinks.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fg-muted hover:text-accent"
                >
                  Open in Spotify →
                </a>
              )}
              {isHttp(episode.applePodcastsUrl) && (
                <a
                  href={episode.applePodcastsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fg-muted hover:text-accent"
                >
                  Apple Podcasts →
                </a>
              )}
              {isHttp(episode.amazonMusicUrl) && (
                <a
                  href={episode.amazonMusicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fg-muted hover:text-accent"
                >
                  Amazon Music →
                </a>
              )}
            </div>
          </Container>
        </section>

        {/* Below-the-fold: description + guest sidebar */}
        <section className="py-16 md:py-20">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
              <div className="max-w-content">
                <h2 className="text-xs uppercase tracking-[0.2em] text-fg-muted">
                  Show notes
                </h2>
                <div className="mt-4 space-y-5 text-base md:text-lg text-fg leading-relaxed whitespace-pre-wrap">
                  {episode.longDescription ?? episode.description}
                </div>

                {episode.topics.length > 0 && (
                  <div className="mt-8 flex flex-wrap gap-2">
                    {episode.topics.map((topic) => (
                      <span
                        key={topic}
                        className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs text-fg-muted"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {linkedGuests.length > 0 && (
                <aside>
                  <h2 className="text-xs uppercase tracking-[0.2em] text-fg-muted">
                    {linkedGuests.length === 1 ? "Guest" : "Guests"}
                  </h2>
                  <div className="mt-4 space-y-4">
                    {linkedGuests.map((g) => (
                      <Link
                        key={g.id}
                        href={`/guests/${g.slug}`}
                        className="block rounded-lg border border-border bg-bg-elevated p-5 transition-colors hover:border-accent"
                      >
                        <div className="font-display text-xl text-fg">
                          {g.name}
                        </div>
                        <p className="mt-2 text-sm text-fg-muted">
                          {g.headline}
                        </p>
                      </Link>
                    ))}
                  </div>
                </aside>
              )}
            </div>
          </Container>
        </section>

        {/* Email signup */}
        <section className="py-12 md:py-16 border-t border-border">
          <Container width="content">
            <EmailSignup
              variant="compact"
              headline="Don't miss the next one."
              subheadline="Get new episodes when they drop."
            />
          </Container>
        </section>

        {/* More episodes */}
        {related.length > 0 && (
          <section className="py-16 md:py-20 border-t border-border">
            <Container>
              <h2 className="text-xs uppercase tracking-[0.2em] text-fg-muted">
                More episodes
              </h2>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {related.map((ep) => (
                  <EpisodeCard key={ep.id} episode={ep} variant="compact" />
                ))}
              </div>
            </Container>
          </section>
        )}
      </article>
    </>
  );
}
