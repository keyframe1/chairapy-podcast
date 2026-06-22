import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import Container from "../../../components/ui/Container";
import SpotifyPlayer from "../../../components/podcast/SpotifyPlayer";
import AudioPlayer from "../../../components/podcast/AudioPlayer";
import EmailSignup from "../../../components/podcast/EmailSignup";
import EmailSignupBlock from "../../../components/podcast/EmailSignupBlock";
import EpisodeListRow from "../../../components/podcast/EpisodeListRow";
import MarkAsListened from "../../../components/podcast/MarkAsListened";
import ShareNudge from "../../../components/podcast/ShareNudge";
import PlatformLink from "../../../components/podcast/PlatformLink";
import FollowShow from "../../../components/podcast/FollowShow";
import Transcript from "../../../components/podcast/Transcript";
import CTAButton from "../../../components/ui/CTAButton";

import {
  getAllEpisodes,
  getEpisodeBySlug,
  getRelatedEpisodes,
  formatPublishedDate,
} from "../../../lib/episodes";
import { formatDurationLabel } from "../../../lib/duration";
import { showInfo, showLinks, resolveEpisodePlatformUrl } from "../../../lib/show";

import guestsData from "../../../content/guests.json";
import type { Guest } from "../../../lib/types";
import { SITE_URL } from "../../../lib/site";

const guests = guestsData as Guest[];

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

  // og:image / twitter:image are supplied by the per-episode
  // app/episodes/[slug]/opengraph-image.tsx (branded neon card with the
  // episode's title). The raw thumbnail is the same generic show artwork on
  // every episode, so the dynamic card previews far better when shared.
  return {
    title: `${episode.title} · Episode ${episode.episodeNumber}`,
    description,
    openGraph: {
      title: `${episode.title} · Episode ${episode.episodeNumber} · ${showInfo.showName}`,
      description,
      type: "music.song",
      url: `${SITE_URL}/episodes/${episode.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${episode.title} · Episode ${episode.episodeNumber}`,
      description,
    },
  };
}

function findGuestsForEpisode(episodeSlug: string): Guest[] {
  return guests.filter((g) => g.episodes.includes(episodeSlug));
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
  // First sentence — split on terminal punctuation followed by whitespace,
  // keeping the punctuation. Uses a capture group rather than a lookbehind
  // (`(?<=…)`): regex lookbehind throws a SyntaxError on iOS Safari < 16.4 and
  // takes the whole bundle down. The capture restores the trailing "." / "!" /
  // "?" that the lookbehind kept attached to the sentence.
  const parts = cleaned.split(/([.!?])\s+/);
  const firstSentence =
    parts.length > 1 ? `${parts[0]}${parts[1] ?? ""}` : cleaned;
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
  const linkedGuests = findGuestsForEpisode(episode.slug);
  const pullQuote = extractPullQuote(episode.longDescription, episode.description);

  // When a transcript exists, attach it to the episode's AudioObject via the
  // schema.org `transcript` property (verified on schema.org: Text, on
  // AudioObject/VideoObject). The SSR'd transcript body carries the value
  // regardless; this is the structured-data bonus.
  const audio =
    episode.transcript
      ? {
          audio: {
            "@type": "AudioObject",
            ...(episode.audioUrl ? { contentUrl: episode.audioUrl } : {}),
            transcript: episode.transcript,
          },
        }
      : {};

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "PodcastEpisode",
    name: episode.title,
    episodeNumber: episode.episodeNumber,
    description: episode.longDescription ?? episode.description,
    datePublished: episode.publishedDate,
    url: `${SITE_URL}/episodes/${episode.slug}`,
    ...audio,
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
              className="text-sm text-fg-muted hover:text-accent transition-colors editorial-link"
            >
              All episodes
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

            {/* Prominent action row — the single primary CTA, above the fold.
                Sharing lives in the global header and the post-player nudge. */}
            <div className="episode-actions">
              <CTAButton href="#player" className="episode-actions__listen">
                <span aria-hidden="true" className="mr-2">▶</span>
                Listen now
              </CTAButton>
            </div>
          </Container>
        </section>

        {/* Player — zero-chrome, sits directly on the page */}
        <section id="player" className="pb-16 scroll-mt-24">
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
                  href={showLinks.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent editorial-link underline underline-offset-4"
                >
                  Try Spotify
                </a>
                .
              </p>
            )}

            {/* Open THIS episode on each platform. A missing per-episode URL
                falls back to the show link (resolveEpisodePlatformUrl) so a
                button is never dead; in dev it warns naming the gap. */}
            <p className="eyebrow mt-8 mb-3">Open this episode in</p>
            <div className="flex flex-wrap gap-3">
              <PlatformLink
                platform="spotify"
                href={resolveEpisodePlatformUrl(episode, "spotify")}
                variant="pill"
                iconSize={16}
              />
              <PlatformLink
                platform="apple"
                href={resolveEpisodePlatformUrl(episode, "apple")}
                variant="pill"
                iconSize={16}
              />
              <PlatformLink
                platform="amazon"
                href={resolveEpisodePlatformUrl(episode, "amazon")}
                variant="pill"
                iconSize={16}
              />
            </div>

            {/* Post-player nudge — catches the highest-intent share moment */}
            <ShareNudge
              slug={episode.slug}
              title={episode.title}
              episodeNumber={episode.episodeNumber}
            />
          </Container>
        </section>

        {/* Follow the show — show-level CTA. A follow earns every future
            episode, so it sits high and reads as prominent as "Listen now". */}
        <FollowShow />

        {/* Show notes — body copy with neon drop cap */}
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
                        key={g.slug}
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
                          {g.role}
                        </p>
                      </Link>
                    ))}
                  </div>
                </aside>
              )}
            </div>
          </Container>
        </section>

        {/* Transcript — SSR'd, indexable text. Renders nothing when absent. */}
        {episode.transcript && <Transcript transcript={episode.transcript} />}

        {/* Email signup */}
        <section className="py-14 border-t border-border">
          <Container width="content">
            <EmailSignupBlock>
              <EmailSignup
                variant="compact"
                headline="Don't miss the next one."
                subheadline="Get new episodes when they drop."
              />
            </EmailSignupBlock>
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
