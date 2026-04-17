import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import Container from "../../../components/ui/Container";
import SpotifyPlayer from "../../../components/podcast/SpotifyPlayer";
import AudioPlayer from "../../../components/podcast/AudioPlayer";
import EmailSignup from "../../../components/podcast/EmailSignup";
import EpisodeListRow from "../../../components/podcast/EpisodeListRow";
import VideoPlaceholder from "../../../components/podcast/VideoPlaceholder";
import MarkAsListened from "../../../components/podcast/MarkAsListened";

import {
  getAllEpisodes,
  getEpisodeBySlug,
  getRelatedEpisodes,
  formatPublishedDate,
} from "../../../lib/episodes";
import { formatDurationLabel } from "../../../lib/duration";

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

function extractPullQuote(
  longDescription: string | null | undefined,
  fallback: string,
): string {
  const source = (longDescription ?? fallback).trim();
  if (!source) return fallback;
  // First sentence, max ~180 chars, stripped of boilerplate social prompts.
  const cleaned = source
    .replace(/Connect with Eric[^.]*\./gi, "")
    .replace(/Follow on [^.]*\./gi, "")
    .replace(/\s+/g, " ")
    .trim();
  const firstSentence = cleaned.split(/(?<=[.!?])\s+/)[0] ?? cleaned;
  if (firstSentence.length <= 220) return firstSentence;
  return `${firstSentence.slice(0, 210).trim()}…`;
}

export default function EpisodeDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const episode = getEpisodeBySlug(params.slug);
  if (!episode) notFound();

  const published = formatPublishedDate(episode.publishedDate);
  const duration = formatDurationLabel(episode.duration);
  const related = getRelatedEpisodes(episode, 3);
  const linkedGuests = findGuestsForEpisode(episode.id);
  const pullQuote = extractPullQuote(episode.longDescription, episode.description);

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
      <MarkAsListened slug={episode.slug} />

      <article>
        {/* Editorial article header */}
        <section className="pt-12 md:pt-16 pb-10 md:pb-14">
          <Container width="content">
            <Link
              href="/episodes"
              className="inline-flex items-center gap-2 text-sm text-fg-muted hover:text-accent transition-colors"
            >
              <span aria-hidden="true">←</span>
              <span>All episodes</span>
            </Link>

            <p className="mt-10 eyebrow tabular">
              <span className="text-accent">Episode {episode.episodeNumber}</span>
              {published && (
                <>
                  {" · "}
                  <span>{published}</span>
                </>
              )}
              {duration && (
                <>
                  {" · "}
                  <span>{duration}</span>
                </>
              )}
              {episode.guestName && (
                <>
                  {" · "}
                  <span>with {episode.guestName}</span>
                </>
              )}
            </p>

            <h1
              className="mt-5 font-display text-5xl md:text-6xl text-fg"
              style={{ lineHeight: 0.98, letterSpacing: "-0.035em" }}
            >
              {episode.title}
            </h1>

            {pullQuote && (
              <blockquote
                className="mt-8 font-serif-body italic text-2xl md:text-3xl"
                style={{
                  color: "var(--color-accent)",
                  lineHeight: 1.3,
                  letterSpacing: "-0.015em",
                  maxWidth: "44ch",
                }}
              >
                "{pullQuote}"
              </blockquote>
            )}
          </Container>
        </section>

        {/* Player — zero-chrome, sits directly on the page */}
        <section className="pb-16">
          <Container width="content">
            {episode.spotifyEmbedUrl ? (
              <SpotifyPlayer embedUrl={episode.spotifyEmbedUrl} lazy={false} bare />
            ) : episode.audioUrl ? (
              <AudioPlayer
                audioUrl={episode.audioUrl}
                title={episode.title}
                episodeNumber={episode.episodeNumber}
                thumbnailUrl={episode.thumbnailUrl ?? undefined}
              />
            ) : (
              <p className="text-center font-serif-body italic text-fg-muted">
                Audio isn't available right now.{" "}
                <a
                  href={showInfo.distributionLinks.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent editorial-link underline underline-offset-4"
                >
                  Try Spotify
                </a>
                .
              </p>
            )}

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-fg-muted">
              {isHttp(showInfo.distributionLinks.spotify) && (
                <a
                  href={showInfo.distributionLinks.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  Open in Spotify ↗
                </a>
              )}
              {isHttp(showInfo.distributionLinks.apple) && (
                <a
                  href={showInfo.distributionLinks.apple}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  Apple Podcasts ↗
                </a>
              )}
              {isHttp(showInfo.distributionLinks.amazon) && (
                <a
                  href={showInfo.distributionLinks.amazon}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  Amazon Music ↗
                </a>
              )}
            </div>
          </Container>
        </section>

        {/* Show notes — Newsreader body with drop cap */}
        <section className="pb-16 md:pb-20">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-14">
              <div>
                <p className="eyebrow mb-6">Show notes</p>
                <div
                  className="prose-serif drop-cap text-fg"
                  style={{ maxWidth: "68ch" }}
                >
                  {(episode.longDescription ?? episode.description)
                    .split(/\n\n+/)
                    .map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                </div>

                {episode.topics.length > 0 && (
                  <div className="mt-10 flex flex-wrap gap-2">
                    {episode.topics.map((topic) => (
                      <span
                        key={topic}
                        className="eyebrow inline-flex items-center border border-border px-3 py-1"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {linkedGuests.length > 0 && (
                <aside>
                  <p className="eyebrow mb-4">
                    {linkedGuests.length === 1 ? "Guest" : "Guests"}
                  </p>
                  <div className="space-y-4">
                    {linkedGuests.map((g) => (
                      <Link
                        key={g.id}
                        href={`/guests/${g.slug}`}
                        className="block border border-border p-5 transition-colors hover:border-accent hover:bg-bg-elevated"
                        style={{ borderRadius: 4 }}
                      >
                        <p
                          className="font-display text-xl text-fg"
                          style={{ lineHeight: 1.05 }}
                        >
                          {g.name}
                        </p>
                        <p className="mt-2 font-serif-body text-sm italic text-fg-muted">
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

        {/* Video callout — static placeholder */}
        <section className="py-14 border-t border-border">
          <Container width="content">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="sm:w-2/5 flex-none">
                <VideoPlaceholder />
              </div>
              <div className="sm:flex-1">
                <p className="eyebrow eyebrow--amber">Watch</p>
                <p
                  className="mt-3 font-display text-2xl text-fg"
                  style={{ lineHeight: 1.1 }}
                >
                  Video version coming soon.
                </p>
                <p className="mt-3 text-fg-muted font-serif-body text-lg">
                  We're producing video cuts of every episode. Be the first to know.
                </p>
                <Link
                  href="/watch"
                  className="mt-4 inline-flex items-center gap-2 text-sm text-accent editorial-link"
                >
                  <span className="underline underline-offset-4 hover:[text-underline-offset:8px] transition-all">
                    Get on the list
                  </span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* Email signup */}
        <section className="py-14 border-t border-border">
          <Container width="content">
            <EmailSignup
              variant="compact"
              headline="Don't miss the next one."
              subheadline="Get new episodes when they drop."
            />
          </Container>
        </section>

        {/* More episodes — minimal list */}
        {related.length > 0 && (
          <section className="py-14 border-t border-border">
            <Container>
              <p className="eyebrow mb-4">More episodes</p>
              <ul>
                {related.map((ep) => (
                  <li key={ep.id}>
                    <EpisodeListRow episode={ep} />
                  </li>
                ))}
              </ul>
            </Container>
          </section>
        )}
      </article>
    </>
  );
}
