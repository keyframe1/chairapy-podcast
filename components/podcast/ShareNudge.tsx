"use client";

import { useEpisodeShare } from "../../lib/useEpisodeShare";
import ShareToast from "./ShareToast";

type Props = {
  slug: string;
  title: string;
  episodeNumber: number;
};

/**
 * Inline listener-share row that sits right below the player — the
 * highest-intent moment, just after someone has listened. One control: the
 * native OS share sheet where it exists (labeled "Share"), otherwise a
 * clipboard copy (labeled "Copy link", the honest desktop fallback). The
 * promo graphics (Story 9:16 / Post 1:1) live on the quiet /share index, so
 * this row stays purely about a listener passing the episode on.
 */
export default function ShareNudge({ slug, title, episodeNumber }: Props) {
  const { copied, canNativeShare, toast, manualUrl, dismissManual, shareLink } =
    useEpisodeShare({
      slug,
      title,
      episodeNumber,
    });

  // The headline action on mobile is the OS sheet; copy is the desktop
  // fallback. Label follows the capability so it's never misleading.
  const label = copied ? "Copied!" : canNativeShare ? "Share" : "Copy link";
  const hint = canNativeShare ? "share" : "URL";
  const helpText = canNativeShare
    ? "Share this episode"
    : "Copy the episode link";

  return (
    <div className="share-nudge">
      <span className="share-nudge__label">
        Liked this one? <span className="share-nudge__accent">Pass it on</span>
      </span>
      <div className="share-nudge__actions">
        <button
          type="button"
          className="share-nudge__btn share-nudge__btn--accent"
          onClick={shareLink}
          title={helpText}
        >
          <span className="share-nudge__btn-text" aria-live="polite">
            {label}
          </span>
          <span className="share-nudge__hint" aria-hidden="true">
            {hint}
          </span>
        </button>
      </div>
      <ShareToast
        message={toast}
        manualUrl={manualUrl}
        onDismissManual={dismissManual}
      />
    </div>
  );
}
