import { track } from "@vercel/analytics";

/**
 * Report a client-side error to Vercel Analytics as a custom `client_error`
 * event (reusing the existing analytics — no new vendor) and to the console.
 *
 * The next Safari/cross-browser occurrence is then logged with the exact
 * message, a trimmed stack, and the device's userAgent so the real cause is
 * visible. Vercel Analytics caps custom-event property values, so each field
 * is truncated. This function never throws — error reporting must not itself
 * crash the page.
 */
export function reportClientError(error: unknown, context: string): void {
  try {
    const err = error as { message?: string; stack?: string } | null | undefined;
    const message = (err && (err.message || String(error))) || "Unknown error";
    const stack = (err && err.stack) || "";
    const userAgent =
      typeof navigator !== "undefined" ? navigator.userAgent : "server";

    track("client_error", {
      context,
      message: String(message).slice(0, 250),
      stack: String(stack).slice(0, 250),
      userAgent: userAgent.slice(0, 250),
    });

    if (typeof console !== "undefined") {
      // eslint-disable-next-line no-console
      console.error(`[client_error:${context}]`, error);
    }
  } catch {
    // Never let error reporting throw.
  }
}
