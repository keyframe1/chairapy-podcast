import Container from "../../components/ui/Container";
import PlatformLink from "../../components/podcast/PlatformLink";
import HeroDiagonal from "../../components/podcast/HeroDiagonal";
import Waveform from "../../components/podcast/Waveform";
import showInfoData from "../../content/show-info.json";
import type { ShowInfo } from "../../lib/types";

const showInfo = showInfoData as ShowInfo;

export const metadata = {
  title: "Subscribe",
  description:
    "Listen to Eric's ADHD Experience on Spotify, Apple Podcasts, Amazon Music, and other major podcast platforms.",
};

export default function SubscribePage() {
  return (
    <>
      <HeroDiagonal scale="compact">
        <Container width="content" className="relative h-full">
          <div className="flex flex-col justify-center min-h-[46vh] md:min-h-[52vh] py-12">
            <p className="eyebrow">Subscribe</p>
            <h1
              className="mt-5 font-display text-5xl md:text-6xl text-fg"
              style={{ lineHeight: 0.98, letterSpacing: "-0.035em" }}
            >
              Where to Listen
            </h1>
            <p
              className="mt-6 font-serif-body text-xl text-fg-muted max-w-content"
              style={{ lineHeight: 1.5 }}
            >
              The show is available on every major podcast platform. Pick yours.
            </p>
          </div>
        </Container>
      </HeroDiagonal>

      <Container width="content">
        <div className="py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-20">
          <section>
            <div className="flex items-center gap-3">
              <h2 className="eyebrow eyebrow--accent m-0">Listen</h2>
              <Waveform width={44} height={14} />
            </div>
            <p
              className="mt-4 font-serif-body italic text-fg-muted"
              style={{ lineHeight: 1.55 }}
            >
              Audio versions ship to every major podcast platform.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <PlatformLink
                platform="spotify"
                href={showInfo.distributionLinks.spotify}
                iconSize={18}
                variant="card"
              />
              <PlatformLink
                platform="apple"
                href={showInfo.distributionLinks.apple}
                iconSize={18}
                variant="card"
              />
              <PlatformLink
                platform="amazon"
                href={showInfo.distributionLinks.amazon}
                iconSize={18}
                variant="card"
              />
              <PlatformLink
                platform="rss"
                href={showInfo.distributionLinks.rss}
                iconSize={18}
                variant="card"
              />
              <PlatformLink platform="youtube" soon iconSize={18} variant="card" />
              <PlatformLink platform="patreon" soon iconSize={18} variant="card" />
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3">
              <h2 className="eyebrow eyebrow--accent m-0">Follow</h2>
              <Waveform width={44} height={14} color="var(--hot-magenta)" />
            </div>
            <p
              className="mt-4 font-serif-body italic text-fg-muted"
              style={{ lineHeight: 1.55 }}
            >
              Between episodes, we're on social.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <PlatformLink
                platform="instagram"
                href={showInfo.socialLinks.instagram}
                iconSize={18}
                variant="card"
              />
              <PlatformLink
                platform="tiktok"
                href={showInfo.socialLinks.tiktok}
                iconSize={18}
                variant="card"
              />
              <PlatformLink
                platform="facebook"
                href={showInfo.socialLinks.facebook}
                iconSize={18}
                variant="card"
              />
              <PlatformLink
                platform="rumble"
                href={showInfo.socialLinks.rumble}
                iconSize={18}
                variant="card"
              />
            </div>
          </section>
        </div>
      </Container>
    </>
  );
}
