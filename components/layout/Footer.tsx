import Container from "../ui/Container";
import PlatformLink from "../podcast/PlatformLink";
import Waveform from "../podcast/Waveform";
import showInfoData from "../../content/show-info.json";
import type { ShowInfo } from "../../lib/types";

const showInfo = showInfoData as ShowInfo;
const SALON_URL = "https://chairapy.org";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-bg-dark border-t border-purple/30 pt-20 md:pt-28">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-[3fr_3.5fr_3.5fr] gap-12 md:gap-10 pb-14">
          {/* Chairapy signature column */}
          <div>
            <div
              className="font-display text-2xl font-bold text-acid"
              style={{
                letterSpacing: "-0.02em",
                textShadow: "0 0 18px rgba(57, 255, 20, 0.4)",
              }}
            >
              Chairapy
            </div>
            <Waveform width={64} height={18} className="mt-3" />
            <p className="mt-4 text-sm font-medium text-fg">
              {showInfo.showName}
            </p>
            <p className="mt-1 text-sm text-fg-muted">
              © {year} {showInfo.productionLabel}
            </p>
            <a
              href={SALON_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-salon"
            >
              Chairapy Salon
            </a>
          </div>

          {/* Listen */}
          <div>
            <h4 className="eyebrow eyebrow--accent mb-5">Listen</h4>
            <div className="flex flex-col space-y-3">
              <PlatformLink
                platform="spotify"
                href={showInfo.distributionLinks.spotify}
              />
              <PlatformLink
                platform="apple"
                href={showInfo.distributionLinks.apple}
              />
              <PlatformLink
                platform="amazon"
                href={showInfo.distributionLinks.amazon}
              />
              <PlatformLink
                platform="rss"
                href={showInfo.distributionLinks.rss}
              />
            </div>
          </div>

          {/* Follow */}
          <div>
            <h4 className="eyebrow eyebrow--accent mb-5">Follow</h4>
            <div className="flex flex-col space-y-3">
              <PlatformLink
                platform="instagram"
                href={showInfo.socialLinks.instagram}
              />
              <PlatformLink
                platform="tiktok"
                href={showInfo.socialLinks.tiktok}
              />
              <PlatformLink
                platform="facebook"
                href={showInfo.socialLinks.facebook}
              />
              <PlatformLink
                platform="rumble"
                href={showInfo.socialLinks.rumble}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-12 pb-10">
          <img
            src="/brand/logo-full.webp"
            alt="Eric's ADHD Experience"
            width={200}
            height={150}
            loading="lazy"
            decoding="async"
            className="footer-logo"
          />
          <p className="footer-credit mt-8 text-center">
            Recorded in Metairie, Louisiana
          </p>
        </div>
      </Container>
    </footer>
  );
}
