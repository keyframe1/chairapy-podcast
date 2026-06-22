"use client";

import { useEffect } from "react";
import { reportClientError } from "../../lib/report-error";

/**
 * Mounted once in the root layout. Catches errors that escape React's error
 * boundaries — uncaught `window` errors and unhandled promise rejections
 * (e.g. an iOS Low Power Mode autoplay rejection, or a failed share) — and
 * reports them as a `client_error` event with the message and userAgent.
 *
 * Renders nothing. Guarded so it only runs in the browser and never throws.
 */
export default function ClientErrorReporter() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onError = (event: ErrorEvent) => {
      reportClientError(event.error ?? event.message, "window.onerror");
    };
    const onRejection = (event: PromiseRejectionEvent) => {
      reportClientError(event.reason, "unhandledrejection");
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
