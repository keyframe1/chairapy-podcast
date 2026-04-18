import Container from "../../components/ui/Container";
import PlatformButton from "../../components/podcast/PlatformButton";
import HeroDiagonal from "../../components/podcast/HeroDiagonal";
import showInfoData from "../../content/show-info.json";
import type { ShowInfo } from "../../lib/types";

const showInfo = showInfoData as ShowInfo;

export const metadata = {
  title: "Subscribe",
  description:
    "Listen to Eric's ADHD Experience on Spotify, Apple Podcasts, Amazon Music, and more.",
};

export default function SubscribePage() {
  return (
    <>
      <HeroDiagonal scale="compact">
        <Container width="content" className="relative h-full">
          <div className="flex flex-col justify-center min-h-[38vh] md:min-h-[44vh] py-12">
            <p className="eyebrow">Subscribe</p>
            <h1
              className="mt-5 font-display text-5xl md:text-6xl text-fg"
              style={{ lineHeight: 0.98, letterSpacing: "-0.035em" }}
            >
              Where to Listen
            </h1>
            <p className="mt-6 font-serif-body text-xl text-fg-muted max-w-content" style={{ lineHeight: 1.5 }}>
              The show is available on every major podcast platform. Pick yours.
            </p>
          </div>
        </Container>
      </HeroDiagonal>

    <Container width="content">
      <div className="py-16 md:py-20">

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-3">
          <PlatformButton
            platform="spotify"
            href={showInfo.distributionLinks.spotify}
            size="large"
          />
          <PlatformButton
            platform="apple"
            href={showInfo.distributionLinks.apple}
            size="large"
          />
          <PlatformButton
            platform="amazon"
            href={showInfo.distributionLinks.amazon}
            size="large"
          />
          <PlatformButton
            platform="youtube"
            href={showInfo.distributionLinks.youtube}
            size="large"
          />
        </div>

        <section className="mt-20">
          <p className="eyebrow">Follow</p>
          <h2
            className="mt-4 font-display text-3xl md:text-4xl text-fg"
            style={{ lineHeight: 1.05, letterSpacing: "-0.03em" }}
          >
            Between episodes, we're here.
          </h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <PlatformButton
              platform="instagram"
              href={showInfo.socialLinks.instagram}
              size="large"
            />
            <PlatformButton
              platform="tiktok"
              href={showInfo.socialLinks.tiktok}
              size="large"
            />
            <PlatformButton
              platform="facebook"
              href={showInfo.socialLinks.facebook}
              size="large"
            />
          </div>
        </section>
      </div>
    </Container>
    </>
  );
}
