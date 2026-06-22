"use client";

import { useState } from "react";
import { isAbortError } from "../../lib/share";

/**
 * Minimal copy-to-clipboard button used on the /share kit page so Eric can
 * grab an episode URL in one tap. Uses the native share sheet first on
 * mobile, then falls back to clipboard.
 */
export default function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ url });
        return;
      } catch (err) {
        if (isAbortError(err)) return; // user cancelled
        // Real failure → fall through to clipboard.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }

  return (
    <button type="button" onClick={copy} className="share-kit__link">
      {copied ? "Copied" : "Link"}
    </button>
  );
}
