import Link from "next/link";
import Container from "../components/ui/Container";
import EricPhoto from "../components/podcast/EricPhoto";
import SpotifyPlayer from "../components/podcast/SpotifyPlayer";
import AudioPlayer from "../components/podcast/AudioPlayer";
import EmailSignup from "../components/podcast/EmailSignup";
import EmailSignupBlock from "../components/podcast/EmailSignupBlock";
import ContinueExploring from "../components/podcast/ContinueExploring";
import SignupCard from "../components/podcast/SignupCard";
import GuestCard from "../components/podcast/GuestCard";
import EpisodeBackplate from "../components/podcast/EpisodeBackplate";
import SectionDivider from "../components/podcast/SectionDivider";
import HeroDiagonal from "../components/podcast/HeroDiagonal";

import showInfoData from "../content/show-info.json";
import guestsData from "../content/guests.json";
import type { Guest, ShowInfo } from "../lib/types";
import { getAllEpisodes, getFeaturedEpisode, formatPublishedDate } from "../lib/episodes";
import { formatDurationLabel } from "../lib/duration";
import { SITE_URL } from "../lib/site";

const showInfo = showInfoData as ShowInfo;
const guests = guestsData as Guest[];

export default function HomePage() {
  const allEpisodes = getAllEpisodes();
  const featuredEpisode = getFeaturedEpisode();
  const latestEpisode = allEpisodes[0];
  const teaserGuests = guests.slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "PodcastSeries",
    name: showInfo.showName,
    url: SITE_URL,
    description: showInfo.showDescription,
    author: { "@type": "Person", name: showInfo.hostName },
    publisher: { "@type": "Organization", name: showInfo.productionLabel },
    sameAs: [
      showInfo.distributionLinks.spotify,
      showInfo.socialLinks.instagram,
      showInfo.socialLinks.tiktok,
      showInfo.socialLinks.facebook,
    ].filter((url) => url && url.startsWith("http")),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Editorial hero — hero-diagonal backdrop with typographic masthead on the cream (right) side */}
      <HeroDiagonal scale="full">
        <Container className="relative h-full">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-10 md:gap-16 items-end pt-16 md:pt-24 pb-12 md:pb-20 min-h-[70vh] md:min-h-[78vh]">
            <div className="hidden md:block" aria-hidden="true" />
            <div className="reveal">
              <p className="eyebrow mb-6">A Chairapy Media podcast · New Orleans</p>
              <h1
                className="font-display text-fg"
                style={{
                  fontSize: "var(--text-display)",
                  lineHeight: 0.98,
                  letterSpacing: "-0.035em",
                  fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1',
                }}
              >
                Eric's
                <br />
                ADHD
                <br />
                Experience
              </h1>
              <div
                aria-hidden="true"
                className="mt-8 h-px w-20 bg-accent"
              />
              <p
                className="mt-8 font-serif-body italic text-2xl md:text-3xl text-fg-muted max-w-content"
                style={{ lineHeight: 1.3 }}
              >
                {showInfo.showTagline}
              </p>

              <div className="mt-10 flex flex-wrap items-baseline gap-x-6 gap-y-3">
                <p className="eyebrow eyebrow--sage tabular">
                  {allEpisodes.length} episodes · new drops monthly
                </p>
                {latestEpisode && (
                  <Link
                    href={`/episodes/${latestEpisode.slug}`}
                    className="group text-sm text-fg hover:text-accent transition-colors"
                  >
                    <span className="eyebrow eyebrow--accent tabular mr-2">
                      Latest
                    </span>
                    <span className="font-serif-body italic">
                      Ep {latestEpisode.episodeNumber} · {latestEpisode.title}
                    </span>
                    <span aria-hidden="true" className="text-accent ml-1">→</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Container>
      </HeroDiagonal>

      {/* Featured episode — split-screen magazine layout */}
      {featuredEpisode && (
        <>
          <SectionDivider />
          <section className="pb-16 md:pb-24">
            <Container>
            <p className="eyebrow mb-8">
              Featured · start here if you're new
            </p>
            <article className="grid grid-cols-1 md:grid-cols-[4fr_6fr] gap-10 md:gap-16 items-start">
              <div className="relative aspect-square bg-bg-elevated border border-border overflow-hidden">
                {featuredEpisode.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={featuredEpisode.thumbnailUrl}
                    alt={`${featuredEpisode.title} — episode artwork`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <EpisodeBackplate
                    title={featuredEpisode.title}
                    variant="feature"
                    priority
                  />
                )}
              </div>

              <div>
                <p className="eyebrow eyebrow--accent tabular">
                  Episode {featuredEpisode.episodeNumber}
                  {featuredEpisode.publishedDate && (
                    <> · <span>{formatPublishedDate(featuredEpisode.publishedDate)}</span></>
                  )}
                  {formatDurationLabel(featuredEpisode.duration) && (
                    <> · <span>{formatDurationLabel(featuredEpisode.duration)}</span></>
                  )}
                  {featuredEpisode.guestName && (
                    <> · with {featuredEpisode.guestName}</>
                  )}
                </p>

                {featuredEpisode.thumbnailUrl && (
                  <h2
                    className="mt-4 font-display text-4xl md:text-5xl text-fg"
                    style={{ lineHeight: 1.02, letterSpacing: "-0.03em" }}
                  >
                    {featuredEpisode.title}
                  </h2>
                )}

                <p
                  className={`${
                    featuredEpisode.thumbnailUrl ? "mt-6" : "mt-4"
                  } font-serif-body text-xl text-fg italic max-w-content`}
                  style={{ lineHeight: 1.4 }}
                >
                  {featuredEpisode.description}
                </p>

                <div className="mt-10 flex flex-wrap items-center gap-6">
                  <Link
                    href={`/episodes/${featuredEpisode.slug}`}
                    className="group inline-flex items-center gap-3 text-accent editorial-link"
                  >
                    <span aria-hidden="true" className="text-xl">▶</span>
                    <span className="text-lg underline underline-offset-4 group-hover:[text-underline-offset:8px] transition-all">
                      Listen now
                    </span>
                  </Link>
                  <Link
                    href="/episodes"
                    className="text-sm text-fg-muted hover:text-accent transition-colors"
                  >
                    View all episodes →
                  </Link>
                </div>

                {featuredEpisode.spotifyEmbedUrl ? (
                  <div className="mt-8">
                    <SpotifyPlayer
                      embedUrl={featuredEpisode.spotifyEmbedUrl}
                      compact
                    />
                  </div>
                ) : featuredEpisode.audioUrl ? (
                  <div className="mt-8">
                    <AudioPlayer
                      audioUrl={featuredEpisode.audioUrl}
                      title={featuredEpisode.title}
                      episodeNumber={featuredEpisode.episodeNumber}
                      thumbnailUrl={featuredEpisode.thumbnailUrl ?? undefined}
                    />
                  </div>
                ) : null}
              </div>
            </article>
          </Container>
          </section>
        </>
      )}

      {/* About strip — portrait + restrained positioning */}
      <section className="py-20 md:py-24 border-t border-border">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14 items-center">
            <div className="md:col-span-1">
              <EricPhoto
                variant="portrait-02"
                alt={`${showInfo.hostName} at work in the Chairapy salon`}
                aspectRatio="square"
              />
            </div>
            <div className="md:col-span-2">
              <p className="eyebrow">About the host</p>
              <p
                className="mt-4 font-display text-4xl md:text-5xl text-fg"
                style={{ lineHeight: 1.02, letterSpacing: "-0.03em" }}
              >
                {showInfo.hostName}
              </p>
              <p className="mt-2 text-sm text-fg-muted tabular">
                {showInfo.hostLocation}
              </p>
              <p
                className="mt-6 font-serif-body text-lg md:text-xl text-fg max-w-content"
                style={{ lineHeight: 1.6 }}
              >
                {showInfo.hostShortBio}
              </p>
              <Link
                href="/about"
                className="mt-8 inline-flex items-center gap-2 text-sm text-accent editorial-link"
              >
                <span className="underline underline-offset-4 hover:[text-underline-offset:8px] transition-all">
                  Read the full story
                </span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Continue exploring — only renders when 3+ episodes opened */}
      <ContinueExploring episodes={allEpisodes} />

      {/* Email signup */}
      <section className="py-20 md:py-24 border-t border-border">
        <Container width="content">
          <EmailSignupBlock>
            <EmailSignup
              headline="New episodes, in your inbox."
              subheadline="No spam. Just a note when a new conversation drops."
            />
          </EmailSignupBlock>
        </Container>
      </section>

      {/* Guests — restrained grid */}
      <section className="py-20 md:py-24 border-t border-border">
        <Container>
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <p className="eyebrow">Who's been on the show</p>
              <h2
                className="mt-3 font-display text-3xl md:text-4xl text-fg"
                style={{ lineHeight: 1.05 }}
              >
                Guests
              </h2>
            </div>
            <Link
              href="/guests"
              className="inline-flex items-center gap-2 text-sm text-accent editorial-link"
            >
              <span className="underline underline-offset-4 hover:[text-underline-offset:8px] transition-all">
                See all
              </span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teaserGuests.map((guest) => (
              <GuestCard key={guest.slug} guest={guest} />
            ))}
          </div>
        </Container>
      </section>

      <SignupCard />
    </>
  );
}
