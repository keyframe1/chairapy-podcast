import Link from "next/link";
import Container from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center py-24">
        <p className="text-sm uppercase tracking-widest text-accent mb-4">
          404
        </p>
        <h1 className="font-display text-4xl sm:text-5xl mb-6">
          That page doesn't exist.
        </h1>
        <p className="text-fg-muted max-w-md mb-10">
          Either the link is broken or the episode moved. Try the full list —
          if it's here, you'll find it.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/episodes"
            className="px-6 py-3 bg-accent text-bg rounded-lg hover:bg-accent-hover transition font-medium"
          >
            Browse episodes
          </Link>
          <Link
            href="/"
            className="px-6 py-3 border border-border rounded-lg hover:bg-bg-elevated transition"
          >
            Back to home
          </Link>
        </div>
      </div>
    </Container>
  );
}
