import Link from "next/link";
import Container from "../ui/Container";
import EmailSignup from "../podcast/EmailSignup";
import showInfoData from "../../content/show-info.json";
import type { ShowInfo } from "../../lib/types";

const showInfo = showInfoData as ShowInfo;

function isHttp(url: string | null | undefined): url is string {
  return !!url && (url.startsWith("http://") || url.startsWith("https://"));
}

export default function Footer() {
  const listenLinks = [
    { label: "Spotify", href: showInfo.distributionLinks.spotify },
    { label: "Apple Podcasts", href: showInfo.distributionLinks.apple },
    { label: "Amazon Music", href: showInfo.distributionLinks.amazon },
  ];

  const socialLinks = [
    { label: "Instagram", href: showInfo.socialLinks.instagram },
    { label: "TikTok", href: showInfo.socialLinks.tiktok },
  ];

  return (
    <footer className="border-t border-border bg-bg mt-24">
      <Container>
        <div className="py-12 border-b border-border">
          <div className="max-w-content">
            <EmailSignup variant="footer" />
          </div>
        </div>

        <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="font-display text-xl text-fg">Chairapy</div>
            <p className="mt-2 text-sm text-fg-muted">
              © 2026 Chairapy Media
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider text-fg-muted mb-3">
              Listen
            </h4>
            <ul className="space-y-2">
              {listenLinks.map((link) =>
                isHttp(link.href) ? (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-fg hover:text-accent transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ) : (
                  <li key={link.label}>
                    <span className="text-sm text-fg-muted">
                      {link.label} (coming soon)
                    </span>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider text-fg-muted mb-3">
              Follow
            </h4>
            <ul className="space-y-2">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-fg hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href="/subscribe"
                  className="text-sm text-fg hover:text-accent transition-colors"
                >
                  All platforms →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border py-6 text-xs text-fg-muted">
          A Chairapy production. New Orleans, Louisiana.
        </div>
      </Container>
    </footer>
  );
}
