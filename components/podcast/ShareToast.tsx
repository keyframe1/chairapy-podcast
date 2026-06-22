"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  /** Transient confirmation, e.g. "Link copied" / "Image downloaded…". */
  message: string | null;
  /** Last-resort selectable URL when the clipboard API is unavailable. */
  manualUrl?: string | null;
  onDismissManual?: () => void;
};

/**
 * Branded share feedback, portaled to <body> so it floats above the page.
 * Shows a transient toast for normal confirmations; when the clipboard can't
 * be written it shows the URL in a selectable field as a last resort.
 */
export default function ShareToast({
  message,
  manualUrl,
  onDismissManual,
}: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  if (!message && !manualUrl) return null;

  return createPortal(
    <div className="share-toast" role="status" aria-live="polite">
      {manualUrl ? (
        <div className="share-toast__manual">
          <span className="share-toast__label">Copy this link</span>
          <input
            className="share-toast__field"
            type="text"
            readOnly
            value={manualUrl}
            onFocus={(e) => e.currentTarget.select()}
            autoFocus
          />
          <button
            type="button"
            className="share-toast__close"
            onClick={onDismissManual}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      ) : (
        <span className="share-toast__msg">{message}</span>
      )}
    </div>,
    document.body,
  );
}
