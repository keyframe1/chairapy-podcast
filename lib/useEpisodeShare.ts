"use client";

import { useState } from "react";
import { SITE_URL } from "./site";

export type ShareFormat = "story" | "square";

type Options = {
  slug: string;
  title: string;
  episodeNumber: number;
  /** Called after a successful native share — e.g. to close an open menu. */
  onShared?: () => void;
};

/**
 * Shared episode-sharing behavior used by the per-episode share menu, the
 * post-player share nudge, and the card share icon. `shareLink` prefers the
 * native share sheet (mobile) and falls back to clipboard copy; `shareImage`
 * shares the designed Story (9:16) / Feed (1:1) graphic as a PNG file on
 * mobile and opens it in a new tab to save on desktop.
 */
export function useEpisodeShare({ slug, title, episodeNumber, onShared }: Options) {
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState<ShareFormat | null>(null);

  // Prefer the live origin (works in dev + prod); fall back to the canonical.
  const base =
    typeof window !== "undefined"
      ? `${window.location.origin}/episodes/${slug}`
      : `${SITE_URL}/episodes/${slug}`;

  async function shareLink() {
    const shareTitle = `Episode ${episodeNumber} · ${title}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: shareTitle, url: base });
        onShared?.();
        return;
      } catch {
        // user cancelled — fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(base);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", base);
    }
  }

  async function shareImage(format: ShareFormat) {
    const imgUrl = `${base}/${format}`;
    setBusy(format);
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        try {
          const res = await fetch(imgUrl);
          const blob = await res.blob();
          const file = new File([blob], `${slug}-${format}.png`, {
            type: "image/png",
          });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file], title });
            onShared?.();
            return;
          }
        } catch {
          // fetch/share failed or was cancelled — fall through to open
        }
      }
      // Desktop (or no file-share support): open the image to save.
      window.open(imgUrl, "_blank", "noopener,noreferrer");
    } finally {
      setBusy(null);
    }
  }

  return { base, copied, busy, shareLink, shareImage };
}
