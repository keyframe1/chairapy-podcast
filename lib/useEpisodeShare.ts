"use client";

import { useEffect, useState } from "react";
import { SITE_URL } from "./site";
import { isAbortError, triggerBlobDownload } from "./share";

export type ShareFormat = "story" | "square";

type Options = {
  slug: string;
  title: string;
  episodeNumber: number;
  /** Called after a successful native share — e.g. to close an open menu. */
  onShared?: () => void;
};

/**
 * Shared episode-sharing behavior used by the per-episode share nudge and the
 * card share icon. Every path is gesture-safe and never silently fails:
 *
 *  - shareLink: native share sheet → on cancel (AbortError) do nothing; on a
 *    real failure or when unsupported, copy the URL and toast "Link copied"
 *    (last resort: show the URL in a selectable field).
 *  - shareImage: native file share where supported → otherwise DOWNLOAD the
 *    already-fetched PNG via a synchronous `<a download>` click. Crucially it
 *    does NOT `window.open(...)` after an `await` — Safari treats that as a
 *    blocked popup, so the old fallback silently did nothing. The download
 *    needs no popup permission and works on desktop Safari every time.
 *
 * `toast` / `manualUrl` drive the shared <ShareToast> the consumers render.
 */
export function useEpisodeShare({ slug, title, episodeNumber, onShared }: Options) {
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState<ShareFormat | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [manualUrl, setManualUrl] = useState<string | null>(null);

  // Whether the OS share sheet is available, so callers can label the control
  // honestly ("Share" on mobile, "Copy link" on desktop). Detected after mount
  // — never during render — so the server and first client paint agree and
  // there's no hydration mismatch.
  const [canNativeShare, setCanNativeShare] = useState(false);
  useEffect(() => {
    setCanNativeShare(
      typeof navigator !== "undefined" &&
        typeof navigator.share === "function",
    );
  }, []);

  // Prefer the live origin (works in dev + prod); fall back to the canonical.
  const base =
    typeof window !== "undefined"
      ? `${window.location.origin}/episodes/${slug}`
      : `${SITE_URL}/episodes/${slug}`;

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(
      () => setToast((current) => (current === message ? null : current)),
      2600,
    );
  }

  function dismissManual() {
    setManualUrl(null);
  }

  // Copy to clipboard with a visible toast; selectable field as last resort.
  async function copyLink(): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(base);
      setCopied(true);
      showToast("Link copied");
      window.setTimeout(() => setCopied(false), 2000);
      return true;
    } catch {
      setManualUrl(base);
      return false;
    }
  }

  async function shareLink() {
    const shareTitle = `Episode ${episodeNumber} · ${title}`;
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title: shareTitle, url: base });
        onShared?.();
        return;
      } catch (err) {
        // A user dismissing the sheet is a cancel, not a failure — stop here.
        if (isAbortError(err)) return;
        // Real failure → fall through to clipboard copy.
      }
    }
    await copyLink();
  }

  async function shareImage(format: ShareFormat) {
    const imgUrl = `${base}/${format}`;
    setBusy(format);
    try {
      // Fetch the PNG once; reused for both the native file share and the
      // download fallback so we never fetch twice or lose the blob.
      let blob: Blob | null = null;
      try {
        const res = await fetch(imgUrl);
        if (res.ok) blob = await res.blob();
      } catch {
        // network/CDN failure — handled below
      }

      // Mobile / file-share-capable browsers: native share sheet with the file.
      if (
        blob &&
        typeof navigator !== "undefined" &&
        typeof navigator.share === "function"
      ) {
        try {
          const file = new File([blob], `${slug}-${format}.png`, {
            type: "image/png",
          });
          if (
            typeof navigator.canShare === "function" &&
            navigator.canShare({ files: [file] })
          ) {
            await navigator.share({ files: [file], title });
            onShared?.();
            return;
          }
        } catch (err) {
          if (isAbortError(err)) return; // user cancelled the sheet
          // else fall through to download
        }
      }

      // Desktop Safari / no file-share support: download the PNG. No popup
      // permission needed, so this never gets silently blocked.
      if (blob) {
        triggerBlobDownload(blob, `${slug}-${format}.png`);
        showToast("Image downloaded, ready to post");
        return;
      }

      // Couldn't even fetch the graphic — fall back to the link so the button
      // is never a no-op.
      showToast("Couldn't prepare the image — copied the link instead");
      await copyLink();
    } finally {
      setBusy(null);
    }
  }

  return {
    base,
    copied,
    busy,
    toast,
    manualUrl,
    canNativeShare,
    dismissManual,
    shareLink,
    shareImage,
  };
}
