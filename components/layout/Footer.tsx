import Container from "../ui/Container";
import PlatformLink from "../podcast/PlatformLink";
import showInfoData from "../../content/show-info.json";
import type { ShowInfo } from "../../lib/types";

const showInfo = showInfoData as ShowInfo;

export default function Footer() {
  return (
    <footer className="bg-bg pt-20 md:pt-28">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-[3fr_3.5fr_3.5fr] gap-12 md:gap-10 pb-14">
          {/* Chairapy signature column */}
          <div>
            <div
              className="font-display text-2xl text-fg"
              style={{
                fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1',
                letterSpacing: "-0.02em",
              }}
            >
              Chairapy
            </div>
            <p className="mt-3 text-sm text-fg-muted">© 2026 Chairapy Media</p>
            <p className="mt-1 text-sm text-fg-muted font-serif-body italic">
              A Chairapy Media podcast.
            </p>
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
              <PlatformLink platform="patreon" soon />
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

        <div className="border-t border-border pt-6 pb-10">
          <p className="text-center text-xs text-fg-muted">
            A Chairapy production. New Orleans, Louisiana.
          </p>
        </div>
      </Container>
    </footer>
  );
}
