import Link from "next/link";
import Container from "@/components/ui/Container";
import SmileyLoader from "@/components/brand/SmileyLoader";

export const metadata = {
  title: "Off-script",
};

export default function NotFound() {
  return (
    <div className="relative overflow-hidden" style={{ isolation: "isolate" }}>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 25% 20%, rgba(139,47,230,0.3), transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,45,149,0.22), transparent 50%)",
        }}
      />

      <Container width="content">
        <div className="min-h-[70vh] flex flex-col items-start justify-center py-24">
          <SmileyLoader size={132} className="mb-8" />
          <p className="eyebrow eyebrow--accent tabular">Lost the signal · 404</p>
          <h1
            className="glitch-text mt-6 font-display font-bold text-fg"
            style={{
              fontSize: "var(--text-display)",
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
            }}
          >
            This page isn't here.
          </h1>
          <p className="mt-6 font-serif-body italic text-xl text-fg-muted max-w-content">
            The tape skipped. This one&apos;s just static — let&apos;s get you back to a signal.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href="/episodes"
              className="inline-flex items-center gap-2 text-acid editorial-link"
            >
              <span className="text-lg underline underline-offset-4 hover:[text-underline-offset:8px] transition-all">
                Try the episodes archive
              </span>
            </Link>
            <Link
              href="/"
              className="text-sm text-fg-muted hover:text-accent transition-colors"
            >
              Back to home
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
