"use client";

import { FormEvent, useCallback, useEffect, useId, useRef, useState } from "react";

const STORAGE_DISMISSED = "chairapy:signup-card-dismissed";
const STORAGE_SUBSCRIBED = "chairapy:subscribed";
const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const TRIGGER_DELAY_MS = 30_000; // 30 sec
const SCROLL_TRIGGER_RATIO = 0.5;

type Status = "idle" | "loading" | "success" | "error";

function isRecentlyDismissed(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const ts = window.localStorage.getItem(STORAGE_DISMISSED);
    if (!ts) return false;
    const n = Number(ts);
    if (!Number.isFinite(n)) return false;
    return Date.now() - n < COOLDOWN_MS;
  } catch {
    return false;
  }
}

function alreadySubscribed(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(STORAGE_SUBSCRIBED) === "true";
  } catch {
    return false;
  }
}

export default function SignupCard() {
  const [mounted, setMounted] = useState(false);
  const [armed, setArmed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const previousFocus = useRef<HTMLElement | null>(null);
  const headingId = useId();

  const dismiss = useCallback(() => {
    try {
      window.localStorage.setItem(STORAGE_DISMISSED, String(Date.now()));
    } catch {
      /* no-op */
    }
    setVisible(false);
    if (previousFocus.current && typeof previousFocus.current.focus === "function") {
      previousFocus.current.focus();
    }
  }, []);

  // Mount gate — don't arm on mobile, or for already-subscribed / recently
  // dismissed visitors.
  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;
    if (window.matchMedia("(max-width: 767px)").matches) return;
    if (alreadySubscribed() || isRecentlyDismissed()) return;
    setArmed(true);
  }, []);

  // Trigger — fires when 30sec has passed OR >= 50% scrolled, whichever first.
  useEffect(() => {
    if (!armed) return;

    let cancelled = false;
    const show = () => {
      if (cancelled) return;
      previousFocus.current =
        (document.activeElement as HTMLElement | null) ?? null;
      setVisible(true);
    };

    const timeoutId = window.setTimeout(show, TRIGGER_DELAY_MS);

    const onScroll = () => {
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - doc.clientHeight);
      const ratio = window.scrollY / max;
      if (ratio >= SCROLL_TRIGGER_RATIO) show();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      window.removeEventListener("scroll", onScroll);
    };
  }, [armed]);

  // ESC to dismiss
  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, dismiss]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "That didn't go through. Try again in a moment.");
        return;
      }

      try {
        window.localStorage.setItem(STORAGE_SUBSCRIBED, "true");
        window.localStorage.setItem(STORAGE_DISMISSED, String(Date.now()));
      } catch {
        /* no-op */
      }

      setStatus("success");
      setMessage("You're in.");
      window.setTimeout(() => setVisible(false), 2500);
    } catch {
      setStatus("error");
      setMessage("That didn't go through. Try again in a moment.");
    }
  }

  if (!mounted || !visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby={headingId}
      className="signup-card fixed right-6 bottom-6 z-40 hidden md:block"
      style={{
        width: 360,
        backgroundColor: "var(--cream)",
        borderRadius: 2,
        border: "1px solid var(--charcoal-soft)",
        boxShadow: "0 12px 40px rgba(193, 113, 68, 0.18)",
      }}
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss signup card"
        className="absolute top-3 right-3 w-7 h-7 inline-flex items-center justify-center rounded-full text-fg-muted hover:text-accent transition-colors"
        style={{ fontSize: 16 }}
      >
        <span aria-hidden="true">×</span>
      </button>

      <div className="p-6 pr-10">
        <h3
          id={headingId}
          className="font-display text-fg"
          style={{
            fontSize: "1.5rem",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            fontVariationSettings: '"opsz" 96, "SOFT" 80, "WONK" 1',
          }}
        >
          New here?
        </h3>

        {status === "success" ? (
          <p className="mt-3 font-serif-body italic text-fg-muted" style={{ fontSize: "0.95rem" }}>
            {message || "You're in."}
          </p>
        ) : (
          <>
            <p className="mt-2 text-fg-muted" style={{ fontSize: "0.95rem", lineHeight: 1.5 }}>
              Get new episodes as they drop. One email, no spam.
            </p>

            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2" noValidate>
              <label className="sr-only" htmlFor={`${headingId}-email`}>
                Email address
              </label>
              <input
                id={`${headingId}-email`}
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={status === "loading"}
                aria-invalid={status === "error"}
                className="w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/40 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-md bg-accent text-bg px-4 py-2.5 text-sm font-medium hover:bg-accent-hover active:opacity-85 disabled:opacity-60 transition-colors"
              >
                {status === "loading" ? "Subscribing…" : "Subscribe"}
              </button>
            </form>

            {message && (
              <p
                role={status === "error" ? "alert" : "status"}
                className="mt-2 text-xs text-fg-muted"
              >
                {message}
              </p>
            )}
          </>
        )}
      </div>

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .signup-card {
            animation: signup-card-enter 400ms cubic-bezier(0.22, 1, 0.36, 1) both;
          }
        }
        @keyframes signup-card-enter {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}
