import Link from "next/link";
import Container from "@/components/ui/Container";

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
          backgroundImage: "url(/images/brand/pattern-terra.png)",
          backgroundRepeat: "repeat",
          backgroundSize: "360px 360px",
          opacity: 0.15,
          mixBlendMode: "multiply",
        }}
      />

      <Container width="content">
        <div className="min-h-[70vh] flex flex-col items-start justify-center py-24">
          <p className="eyebrow eyebrow--accent tabular">404 · page not found</p>
          <h1
            className="mt-6 font-display text-fg"
            style={{
              fontSize: "var(--text-display)",
              lineHeight: 0.95,
              letterSpacing: "-0.035em",
              fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1',
            }}
          >
            You're off-script.
          </h1>
          <p
            className="mt-6 font-serif-body text-xl text-fg-muted max-w-content"
            style={{ lineHeight: 1.6 }}
          >
            That page isn't here. Try the episodes archive — most things live
            there.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-6">
            <Link
              href="/episodes"
              className="inline-flex items-center gap-2 text-accent editorial-link"
            >
              <span aria-hidden="true">▶</span>
              <span className="underline underline-offset-4 hover:[text-underline-offset:8px] transition-all text-lg">
                Browse every episode
              </span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-fg-muted hover:text-accent transition-colors"
            >
              <span aria-hidden="true">←</span>
              <span>Back to home</span>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
