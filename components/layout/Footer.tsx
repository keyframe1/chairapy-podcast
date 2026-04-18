import Link from "next/link";
import Container from "../ui/Container";
import ConditionalFooterEmail from "../podcast/ConditionalFooterEmail";
import PlatformButton from "../podcast/PlatformButton";
import showInfoData from "../../content/show-info.json";
import type { ShowInfo } from "../../lib/types";

const showInfo = showInfoData as ShowInfo;

export default function Footer() {
  return (
    <footer className="bg-bg pt-16 md:pt-24">
      <Container>
        <ConditionalFooterEmail />

        <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div
              className="font-display text-xl text-fg"
              style={{
                fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1',
                letterSpacing: "-0.02em",
              }}
            >
              Chairapy
            </div>
            <p className="mt-2 text-sm text-fg-muted">© 2026 Chairapy Media</p>
          </div>

          <div>
            <h4 className="eyebrow mb-4">Listen</h4>
            <div className="flex flex-col gap-2">
              <PlatformButton
                platform="spotify"
                href={showInfo.distributionLinks.spotify}
                size="sm"
              />
              <PlatformButton
                platform="apple"
                href={showInfo.distributionLinks.apple}
                size="sm"
              />
              <PlatformButton
                platform="amazon"
                href={showInfo.distributionLinks.amazon}
                size="sm"
              />
            </div>
            <Link
              href="/subscribe"
              className="mt-4 inline-flex items-center gap-2 text-sm text-accent editorial-link"
            >
              <span className="underline underline-offset-4 hover:[text-underline-offset:8px] transition-all">
                All platforms
              </span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div>
            <h4 className="eyebrow mb-4">Follow</h4>
            <div className="flex flex-col gap-2">
              <PlatformButton
                platform="instagram"
                href={showInfo.socialLinks.instagram}
                size="sm"
              />
              <PlatformButton
                platform="tiktok"
                href={showInfo.socialLinks.tiktok}
                size="sm"
              />
              <PlatformButton
                platform="facebook"
                href={showInfo.socialLinks.facebook}
                size="sm"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 pb-8">
          <p className="text-center text-xs text-fg-muted">
            A Chairapy production. New Orleans, Louisiana.
          </p>
        </div>
      </Container>
    </footer>
  );
}
