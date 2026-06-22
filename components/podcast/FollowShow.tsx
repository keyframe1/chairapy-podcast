import Container from "../ui/Container";
import PlatformLink from "./PlatformLink";
import { showLinks } from "../../lib/show";

/**
 * Show-level "Follow the show" CTA. Unlike the per-episode platform buttons
 * (which open THIS episode), every link here points at the show's page on each
 * platform — a follow earns every future episode automatically, so this is the
 * higher-leverage action and is styled to read at least as prominently as
 * "Listen now". Reuses the single show-link source from lib/show.ts.
 */
export default function FollowShow() {
  return (
    <section className="follow-show">
      <Container width="content">
        <div className="follow-show__band">
          <p className="eyebrow eyebrow--accent">Follow the show</p>
          <h2 className="follow-show__title font-display text-fg">
            Never miss an episode
          </h2>
          <p className="follow-show__sub font-serif-body text-fg-muted">
            Follow in your podcast app and every new conversation lands on its
            own — no need to come back here.
          </p>
          <div className="follow-show__platforms platform-stagger">
            <PlatformLink
              platform="spotify"
              href={showLinks.spotify}
              iconSize={18}
              variant="card"
            />
            <PlatformLink
              platform="apple"
              href={showLinks.apple}
              iconSize={18}
              variant="card"
            />
            <PlatformLink
              platform="amazon"
              href={showLinks.amazon}
              iconSize={18}
              variant="card"
            />
            <PlatformLink
              platform="rss"
              href={showLinks.rss}
              iconSize={18}
              variant="card"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
