import Link from "next/link";
import Image from "next/image";
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
import Waveform from "../components/podcast/Waveform";
import SizzleHero from "../components/brand/SizzleHero";
import WatchStrip from "../components/brand/WatchStrip";

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
      showInfo.distributionLinks.apple,
      showInfo.distributionLinks.amazon,
      showInfo.socialLinks.instagram,
      showInfo.socialLinks.tiktok,
      showInfo.socialLinks.facebook,
      showInfo.socialLinks.rumble,
    ].filter((url) => url && url.startsWith("http")),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero — fried-VHS sizzle reel behind the typographic masthead */}
      <SizzleHero>
        <Container className="relative">
          <div className="flex flex-col justify-end min-h-[72vh] md:min-h-[78vh] pt-28 pb-14 md:pb-20">
            <div className="reveal reveal-stagger max-w-2xl">
              <p className="eyebrow eyebrow--accent mb-6">A Chairapy Media podcast · New Orleans</p>
              <h1
                className="glitch-text font-display font-bold text-fg"
                style={{
                  fontSize: "var(--text-display)",
                  lineHeight: 0.98,
                  letterSpacing: "-0.04em",
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
                className="mt-8 h-0.5 w-20 bg-acid shadow-glow-green"
              />
              <p
                className="mt-8 font-serif-body italic text-2xl md:text-3xl text-fg max-w-content"
                style={{ lineHeight: 1.3, textShadow: "0 2px 18px rgba(0,0,0,0.55)" }}
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
      </SizzleHero>

      {/* Host byline — small editorial strip between hero and featured */}
      <section className="py-16 md:py-20">
        <Container>
          <div className="flex items-center gap-6 md:gap-8 max-w-content">
            <div
              className="relative w-[120px] h-[120px] md:w-[150px] md:h-[150px] flex-none overflow-hidden"
              style={{
                borderRadius: 4,
                boxShadow:
                  "0 0 0 1px rgba(139, 47, 230, 0.4), 0 0 28px rgba(139, 47, 230, 0.35), 0 16px 40px rgba(0, 0, 0, 0.5)",
              }}
            >
              <EricPhoto
                variant="portrait-03"
                alt="Eric Falgout, host"
                aspectRatio="square"
                treatment="portrait"
              />
            </div>
            <div>
              <p className="eyebrow eyebrow--accent">Your host</p>
              <p
                className="mt-3 font-display font-bold text-2xl md:text-3xl text-fg"
                style={{
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                }}
              >
                {showInfo.hostName}
              </p>
              <p className="mt-2 font-serif-body italic text-base text-fg-muted">
                Host. Records in {showInfo.hostLocation}.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured episode — split-screen magazine layout */}
      {featuredEpisode && (
        <>
          <section className="pb-16 md:pb-24 border-t border-border pt-16 md:pt-20">
            <Container>
            <div className="flex items-center gap-3 mb-8">
              <p className="eyebrow">Featured · start here if you're new</p>
              <Waveform width={48} height={16} />
            </div>
            <article className="grid grid-cols-1 md:grid-cols-[4fr_6fr] gap-10 md:gap-16 items-start">
              <div
                className="neon-frame float relative aspect-square bg-bg-elevated overflow-hidden"
                style={{ borderRadius: 6 }}
                data-reveal
              >
                {featuredEpisode.thumbnailUrl ? (
                  <Image
                    src={featuredEpisode.thumbnailUrl}
                    alt={`${featuredEpisode.title}, episode artwork`}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 480px"
                    className="object-cover"
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
                    className="mt-4 font-display font-bold text-4xl md:text-5xl text-fg"
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
                    className="cta-pulse group inline-flex items-center gap-3 rounded-md bg-acid px-6 py-3 text-base font-bold text-bg transition-transform hover:scale-[1.03]"
                  >
                    <span aria-hidden="true">▶</span>
                    <span>Listen now</span>
                  </Link>
                  <Link
                    href="/episodes"
                    className="text-sm text-fg-muted hover:text-acid transition-colors"
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

      {/* Watch — the three vertical promo reels (brand promos, not bound to episodes) */}
      <WatchStrip />

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
                className="mt-4 font-display font-bold text-4xl md:text-5xl text-fg"
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
