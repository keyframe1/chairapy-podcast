import Container from "../../components/ui/Container";
import EmailSignup from "../../components/podcast/EmailSignup";
import VideoPlaceholder from "../../components/podcast/VideoPlaceholder";

export const metadata = {
  title: "Watch",
  description:
    "Video versions of Eric's ADHD Experience are coming to YouTube and the site. Get on the list.",
};

export default function WatchPage() {
  return (
    <Container>
      <div className="py-20 md:py-28">
        <header className="max-w-content">
          <p className="eyebrow eyebrow--amber">Watch · coming soon</p>
          <h1
            className="mt-4 font-display text-5xl md:text-6xl text-fg"
            style={{ lineHeight: 0.98, letterSpacing: "-0.035em" }}
          >
            Full episodes, watchable soon.
          </h1>
          <p
            className="mt-6 font-serif-body text-xl text-fg-muted"
            style={{ lineHeight: 1.55 }}
          >
            Video versions of Eric's ADHD Experience are coming to YouTube and
            this site. Recorded in New Orleans on broadcast-grade cameras. Get
            on the list and you'll be the first to know when they drop.
          </p>
        </header>

        <div className="mt-12 max-w-content">
          <EmailSignup
            headline="Notify me when video is live."
            subheadline="One email, no spam."
          />
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <VideoPlaceholder />
          <VideoPlaceholder />
          <VideoPlaceholder />
        </div>

        <p className="mt-10 text-sm text-fg-muted font-serif-body italic max-w-content">
          The audio show keeps publishing on its regular schedule. Video is an
          addition, not a replacement.
        </p>
      </div>
    </Container>
  );
}
