import type { Metadata } from "next";
import Container from "../../components/ui/Container";
import CopyLinkButton from "../../components/podcast/CopyLinkButton";
import { getAllEpisodes } from "../../lib/episodes";
import { SITE_URL } from "../../lib/site";

// Quiet share-kit page for Eric — intentionally kept out of the main nav and
// out of search results. One place to grab every format for every episode.
export const metadata: Metadata = {
  title: "Share kit",
  robots: { index: false, follow: false },
};

export default function SharePage() {
  const episodes = getAllEpisodes();

  return (
    <section className="py-14 md:py-20">
      <Container>
        <p className="eyebrow eyebrow--accent">For Eric · not in the menu</p>
        <h1
          className="mt-4 font-display font-bold text-4xl md:text-5xl text-fg"
          style={{ lineHeight: 1.0, letterSpacing: "-0.03em" }}
        >
          Share kit
        </h1>
        <p
          className="mt-5 font-serif-body text-lg text-fg-muted"
          style={{ maxWidth: "60ch", lineHeight: 1.6 }}
        >
          Every episode, every format. <strong className="text-fg">Link</strong>{" "}
          copies the episode URL for the casual share.{" "}
          <strong className="text-fg">Story</strong> (9:16) and{" "}
          <strong className="text-fg">Feed</strong> (1:1) open the designed
          graphic in a new tab — right-click or long-press to save, then post.
        </p>

        <ul className="mt-10 flex flex-col gap-3">
          {episodes.map((ep) => {
            const pageUrl = `${SITE_URL}/episodes/${ep.slug}`;
            return (
              <li
                key={ep.id}
                className="share-kit__row flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="eyebrow eyebrow--accent tabular">
                    Episode {ep.episodeNumber}
                    {ep.guestName && (
                      <span className="text-fg-muted"> · with {ep.guestName}</span>
                    )}
                  </p>
                  <p
                    className="mt-2 font-display text-xl text-fg"
                    style={{ lineHeight: 1.1, letterSpacing: "-0.01em" }}
                  >
                    {ep.title}
                  </p>
                </div>

                <div className="flex flex-none items-center gap-2">
                  <CopyLinkButton url={pageUrl} />
                  <a
                    className="share-kit__link"
                    href={`/episodes/${ep.slug}/story`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Story <span className="share-kit__dim">9:16</span>
                  </a>
                  <a
                    className="share-kit__link"
                    href={`/episodes/${ep.slug}/square`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Feed <span className="share-kit__dim">1:1</span>
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
