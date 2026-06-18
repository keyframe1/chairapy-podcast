"use client";

import { useState } from "react";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url =
      typeof window !== "undefined"
        ? window.location.href
        : "https://podcast.chairapy.org";
    const title =
      typeof document !== "undefined"
        ? document.title
        : "Eric's ADHD Experience";

    // Mobile / supporting browsers: native share sheet
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled — do nothing
      }
      return;
    }

    // Desktop fallback: copy the link to the clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // last-resort fallback: select-and-prompt
      window.prompt("Copy this link:", url);
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="share-btn"
      aria-label="Share this page"
      title="Share"
    >
      {copied ? (
        <span className="share-btn__copied">Link copied</span>
      ) : (
        <>
          {/* Standard share icon (iOS-style share / nodes icon) */}
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
          <span className="share-btn__label">Share</span>
        </>
      )}
    </button>
  );
}
