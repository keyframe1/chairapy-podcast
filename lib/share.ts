/**
 * Cross-platform share helpers. The Safari-critical pieces:
 *   - isAbortError: a user dismissing the native share sheet rejects with an
 *     AbortError. That is a cancel, NOT a failure — callers must not fall back
 *     to a copy/download or show an error when they see it.
 *   - triggerBlobDownload: saves an already-fetched blob via a synchronously
 *     created `<a download>` click. Unlike `window.open(...)` after an `await`,
 *     this needs no popup permission, so it works on desktop Safari (which
 *     cannot share image files) every time instead of being silently blocked.
 */

/** True when a thrown value is a user-cancel of the native share sheet. */
export function isAbortError(err: unknown): boolean {
  if (err instanceof DOMException) return err.name === "AbortError";
  return (
    typeof err === "object" &&
    err !== null &&
    (err as { name?: unknown }).name === "AbortError"
  );
}

/** Download a blob without needing popup permission (Safari-safe). */
export function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  // Must be in the DOM for the click to register in some browsers.
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoke on the next tick so Safari has time to start the download first.
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
