"use client";

import { FormEvent, useId, useState } from "react";

type EmailSignupProps = {
  variant?: "default" | "compact" | "footer";
  headline?: string;
  subheadline?: string;
  className?: string;
};

type Status = "idle" | "loading" | "success" | "error";

export default function EmailSignup({
  variant = "default",
  headline,
  subheadline,
  className = "",
}: EmailSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const inputId = useId();
  const messageId = `${inputId}-message`;

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
        success?: boolean;
      };

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Try again?");
        return;
      }

      if (typeof window !== "undefined") {
        const plausible = (
          window as unknown as {
            plausible?: (event: string, opts?: { props?: Record<string, string> }) => void;
          }
        ).plausible;
        plausible?.("Email Signup");
      }

      setStatus("success");
      setMessage("You're in. Check your email for confirmation.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Try again?");
    }
  }

  const isFooter = variant === "footer";
  const isCompact = variant === "compact";

  const containerClass = isFooter
    ? ""
    : isCompact
      ? "rounded-lg border border-border bg-bg-elevated p-6"
      : "rounded-xl border border-border bg-bg-elevated p-8 md:p-10";

  const headingSize = isCompact ? "text-xl md:text-2xl" : "text-3xl md:text-4xl";

  return (
    <section className={`${containerClass} ${className}`}>
      {!isFooter && (headline || subheadline) && (
        <header className={isCompact ? "" : "max-w-content"}>
          {headline && (
            <h2 className={`font-display text-fg ${headingSize}`}>{headline}</h2>
          )}
          {subheadline && (
            <p className={`${isCompact ? "mt-2 text-sm" : "mt-3 text-base md:text-lg"} text-fg-muted`}>
              {subheadline}
            </p>
          )}
        </header>
      )}

      <form
        onSubmit={handleSubmit}
        className={`${
          !isFooter && (headline || subheadline) ? "mt-6" : ""
        } flex flex-col sm:flex-row gap-2`}
        noValidate
      >
        <label htmlFor={inputId} className="sr-only">
          Email address
        </label>
        <input
          id={inputId}
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          disabled={status === "loading"}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-describedby={message ? messageId : undefined}
          aria-invalid={status === "error"}
          className="flex-1 rounded-md border border-border bg-bg px-4 py-3 text-base text-fg placeholder:text-fg-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/40 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-3 text-base font-medium text-bg hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {status === "loading" ? "Subscribing…" : "Subscribe"}
        </button>
      </form>

      {message && (
        <p
          id={messageId}
          role={status === "error" ? "alert" : "status"}
          className={`mt-3 text-sm ${
            status === "error" ? "text-red-300" : "text-fg-muted"
          }`}
        >
          {message}
        </p>
      )}

      {isFooter && (
        <p className="mt-3 text-xs text-fg-muted">
          New episodes in your inbox. No spam.
        </p>
      )}
    </section>
  );
}
