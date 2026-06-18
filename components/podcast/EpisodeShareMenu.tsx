"use client";

import { useEffect, useRef, useState } from "react";
import { SITE_URL } from "../../lib/site";

type ShareFormat = "story" | "square";

type Props = {
  slug: string;
  title: string;
  episodeNumber: number;
};

/**
 * Per-episode share menu. The header keeps the casual "share this page as a
 * link" button; this gives the full set on the episode itself — copy link
 * plus the designed Story (9:16) and Feed (1:1) graphics. On mobile the
 * graphics open the native share sheet as a PNG file; on desktop they open
 * in a new tab to save.
 */
export default function EpisodeShareMenu({ slug, title, episodeNumber }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState<ShareFormat | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // Prefer the live origin (works in dev + prod); fall back to the canonical.
  const base =
    typeof window !== "undefined"
      ? `${window.location.origin}/episodes/${slug}`
      : `${SITE_URL}/episodes/${slug}`;

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    function onPointer(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function shareLink() {
    const shareTitle = `Episode ${episodeNumber} · ${title}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: shareTitle, url: base });
        setOpen(false);
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
            setOpen(false);
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

  return (
    <div className="share-menu" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="share-menu__trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Share this episode"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        <span className="share-menu__label">{copied ? "Link copied" : "Share"}</span>
      </button>

      {open && (
        <div className="share-menu__panel" role="menu" aria-label="Share formats">
          <button
            type="button"
            role="menuitem"
            className="share-menu__item"
            onClick={shareLink}
          >
            <span>Copy link</span>
            <span className="share-menu__hint">page</span>
          </button>
          <button
            type="button"
            role="menuitem"
            className="share-menu__item"
            onClick={() => shareImage("story")}
            disabled={busy === "story"}
          >
            <span>Story graphic</span>
            <span className="share-menu__hint">9:16</span>
          </button>
          <button
            type="button"
            role="menuitem"
            className="share-menu__item"
            onClick={() => shareImage("square")}
            disabled={busy === "square"}
          >
            <span>Feed post</span>
            <span className="share-menu__hint">1:1</span>
          </button>
        </div>
      )}
    </div>
  );
}
