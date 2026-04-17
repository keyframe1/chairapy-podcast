import Link from "next/link";
import Container from "../components/ui/Container";
import CTAButton from "../components/ui/CTAButton";
import PhotoPlaceholder from "../components/ui/PhotoPlaceholder";
import EpisodeCard from "../components/podcast/EpisodeCard";
import GuestCard from "../components/podcast/GuestCard";
import PlatformButton from "../components/podcast/PlatformButton";
import SpotifyPlayer from "../components/podcast/SpotifyPlayer";
import EmailSignup from "../components/podcast/EmailSignup";

import showInfoData from "../content/show-info.json";
import guestsData from "../content/guests.json";
import type { Guest, ShowInfo } from "../lib/types";
import { getFeaturedEpisode } from "../lib/episodes";
import { SITE_URL } from "../lib/site";

const showInfo = showInfoData as ShowInfo;
const guests = guestsData as Guest[];

export default function HomePage() {
  const featuredEpisode = getFeaturedEpisode();
  const teaserGuests = guests.slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "PodcastSeries",
    name: showInfo.showName,
    url: SITE_URL,
    description: showInfo.showDescription,
    author: {
      "@type": "Person",
      name: showInfo.hostName,
    },
    publisher: {
      "@type": "Organization",
      name: showInfo.productionLabel,
    },
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
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, rgba(193, 113, 68, 0.12), transparent 60%)",
          }}
        />
        <Container>
          <div className="py-24 md:py-32 text-center">
            <h1
              className="font-display leading-[1.05] text-fg"
              style={{ fontSize: "clamp(3rem, 8vw, 6rem)" }}
            >
              {showInfo.showName}
            </h1>

            <div
              aria-hidden="true"
              className="mx-auto mt-6 h-px w-24 bg-accent"
            />

            <p className="mt-6 mx-auto max-w-content text-lg md:text-xl text-fg-muted">
              {showInfo.showTagline}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <CTAButton
                href={showInfo.distributionLinks.spotify}
                variant="primary"
                external
              >
                Listen on Spotify
              </CTAButton>
              <CTAButton href="/episodes" variant="secondary">
                Browse Episodes
              </CTAButton>
            </div>
          </div>
        </Container>
      </section>

      {/* About strip */}
      <section className="py-16 md:py-24 border-t border-border">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14 items-center">
            <div className="md:col-span-1">
              <PhotoPlaceholder />
            </div>
            <div className="md:col-span-2">
              <h2 className="text-xs uppercase tracking-[0.2em] text-fg-muted font-body">
                About the host
              </h2>
              <p className="mt-4 font-display text-3xl md:text-4xl text-fg">
                {showInfo.hostName}
              </p>
              <p className="mt-1 text-sm text-fg-muted">
                {showInfo.hostLocation}
              </p>
              <p className="mt-6 text-base md:text-lg text-fg leading-relaxed">
                {showInfo.hostShortBio}
              </p>
              <Link
                href="/about"
                className="mt-6 inline-flex items-center gap-2 text-sm text-accent hover:text-accent-hover"
              >
                <span>Read the full story</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured episode */}
      {featuredEpisode && (
        <section className="py-16 md:py-24 border-t border-border">
          <Container>
            <h2 className="text-xs uppercase tracking-[0.2em] text-fg-muted mb-8">
              Featured episode
            </h2>
            <EpisodeCard episode={featuredEpisode} variant="feature" />
            {featuredEpisode.spotifyEmbedUrl && (
              <div className="mt-6">
                <SpotifyPlayer
                  embedUrl={featuredEpisode.spotifyEmbedUrl}
                  compact
                />
              </div>
            )}
          </Container>
        </section>
      )}

      {/* Email signup */}
      <section className="py-16 md:py-20 border-t border-border">
        <Container width="content">
          <EmailSignup
            headline="New episodes, in your inbox."
            subheadline="No spam. Just a note when a new conversation drops."
          />
        </Container>
      </section>

      {/* Recent guests teaser */}
      <section className="py-16 md:py-24 border-t border-border">
        <Container>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-xs uppercase tracking-[0.2em] text-fg-muted">
                Who's been on the show
              </h2>
              <p className="mt-4 font-display text-3xl md:text-4xl text-fg">
                Guests
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teaserGuests.map((guest) => (
              <GuestCard key={guest.id} guest={guest} />
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="/guests"
              className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent-hover"
            >
              <span>See all guests</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </Container>
      </section>

      {/* Where to listen */}
      <section className="py-16 md:py-24 border-t border-border">
        <Container width="content">
          <div className="text-center">
            <h2 className="text-xs uppercase tracking-[0.2em] text-fg-muted">
              Where to listen
            </h2>
            <p className="mt-4 font-display text-3xl md:text-4xl text-fg">
              Available on all major platforms.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <PlatformButton
              platform="spotify"
              href={showInfo.distributionLinks.spotify}
            />
            <PlatformButton
              platform="apple"
              href={showInfo.distributionLinks.apple}
            />
            <PlatformButton
              platform="amazon"
              href={showInfo.distributionLinks.amazon}
            />
            <PlatformButton
              platform="youtube"
              href={showInfo.distributionLinks.youtube}
            />
          </div>
        </Container>
      </section>
    </>
  );
}
