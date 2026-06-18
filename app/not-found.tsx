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
          background:
            "radial-gradient(circle at 25% 20%, rgba(139,47,230,0.3), transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,45,149,0.22), transparent 50%)",
        }}
      />

      <Container width="content">
        <div className="min-h-[70vh] flex flex-col items-start justify-center py-24">
          <p className="eyebrow eyebrow--accent tabular">Off the trail · 404</p>
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

          <Link
            href="/episodes"
            className="mt-10 inline-flex items-center gap-2 text-acid editorial-link"
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
