import Link from "next/link";
import Container from "../../components/ui/Container";
import EpisodeCard from "../../components/podcast/EpisodeCard";
import { getAllEpisodes } from "../../lib/episodes";

export const metadata = {
  title: "Episodes",
  description:
    "Every episode of Eric's ADHD Experience — long-form conversations with people whose stories are worth hearing.",
};

const PAGE_SIZE = 12;

function parsePage(input: string | string[] | undefined): number {
  if (typeof input !== "string") return 1;
  const n = Number.parseInt(input, 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

export default function EpisodesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const all = getAllEpisodes();
  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const currentPage = Math.min(parsePage(searchParams.page), totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = all.slice(start, start + PAGE_SIZE);

  return (
    <Container>
      <div className="py-20 md:py-24">
        <header className="max-w-content">
          <p className="text-xs uppercase tracking-[0.2em] text-fg-muted">
            Archive
          </p>
          <h1 className="mt-4 font-display text-4xl md:text-6xl text-fg leading-tight">
            Every Episode
          </h1>
          <p className="mt-4 text-sm text-fg-muted">
            {all.length} {all.length === 1 ? "episode" : "episodes"}. Most
            recent first.
          </p>
        </header>

        <ul className="mt-12 space-y-4">
          {pageItems.map((ep) => (
            <li key={ep.id}>
              <EpisodeCard episode={ep} />
            </li>
          ))}
        </ul>

        {totalPages > 1 && (
          <nav
            aria-label="Episode pagination"
            className="mt-12 flex items-center justify-between border-t border-border pt-8"
          >
            <PageLink
              page={currentPage - 1}
              disabled={currentPage <= 1}
              label="← Previous"
            />

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNumber) => (
                  <PageLink
                    key={pageNumber}
                    page={pageNumber}
                    disabled={false}
                    label={String(pageNumber)}
                    active={pageNumber === currentPage}
                    compact
                  />
                ),
              )}
            </div>

            <PageLink
              page={currentPage + 1}
              disabled={currentPage >= totalPages}
              label="Next →"
            />
          </nav>
        )}
      </div>
    </Container>
  );
}

function PageLink({
  page,
  disabled,
  label,
  active = false,
  compact = false,
}: {
  page: number;
  disabled: boolean;
  label: string;
  active?: boolean;
  compact?: boolean;
}) {
  const base = compact
    ? "inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm transition-colors"
    : "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm transition-colors";

  if (disabled) {
    return (
      <span
        aria-disabled="true"
        className={`${base} text-fg-muted opacity-50 cursor-not-allowed`}
      >
        {label}
      </span>
    );
  }

  const activeClass = active
    ? "bg-accent text-bg"
    : "text-fg hover:text-accent";

  const href = page === 1 ? "/episodes" : `/episodes?page=${page}`;

  return (
    <Link href={href} className={`${base} ${activeClass}`}>
      {label}
    </Link>
  );
}
