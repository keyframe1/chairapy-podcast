"use client";

import { useEpisodeShare } from "../../lib/useEpisodeShare";

type Props = {
  slug: string;
  title: string;
  episodeNumber: number;
};

/**
 * Inline share row that sits right below the player — the highest-intent
 * moment, just after someone has listened. Compact link / story / feed
 * buttons reusing the shared episode-share behavior.
 */
export default function ShareNudge({ slug, title, episodeNumber }: Props) {
  const { copied, busy, shareLink, shareImage } = useEpisodeShare({
    slug,
    title,
    episodeNumber,
  });

  return (
    <div className="share-nudge">
      <span className="share-nudge__label">
        Liked this one? <span className="share-nudge__accent">Share it</span>
      </span>
      <div className="share-nudge__actions">
        <button
          type="button"
          className="share-nudge__btn"
          onClick={shareLink}
          title="Copy the episode link"
        >
          <span className="share-nudge__btn-text" aria-live="polite">
            {copied ? "Copied!" : "Copy link"}
          </span>
          <span className="share-nudge__hint" aria-hidden="true">
            URL
          </span>
        </button>
        <button
          type="button"
          className="share-nudge__btn"
          onClick={() => shareImage("story")}
          disabled={busy === "story"}
          title="Share the vertical Story graphic (9:16)"
        >
          <span className="share-nudge__btn-text">Story</span>
          <span className="share-nudge__hint" aria-hidden="true">
            9:16
          </span>
        </button>
        <button
          type="button"
          className="share-nudge__btn share-nudge__btn--accent"
          onClick={() => shareImage("square")}
          disabled={busy === "square"}
          title="Share the square feed post (1:1)"
        >
          <span className="share-nudge__btn-text">Post</span>
          <span className="share-nudge__hint" aria-hidden="true">
            square
          </span>
        </button>
      </div>
    </div>
  );
}
