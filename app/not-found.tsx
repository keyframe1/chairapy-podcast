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
          <p className="eyebrow eyebrow--accent tabular">Off the trail</p>
          <h1
            className="mt-6 font-display text-fg"
            style={{
              fontSize: "var(--text-display)",
              lineHeight: 0.95,
              letterSpacing: "-0.035em",
              fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1',
            }}
          >
            This page isn't here.
          </h1>

          <Link
            href="/episodes"
            className="mt-10 inline-flex items-center gap-2 text-accent editorial-link"
          >
            <span className="text-lg underline underline-offset-4 hover:[text-underline-offset:8px] transition-all">
              Try the episodes archive
            </span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </Container>
    </div>
  );
}
