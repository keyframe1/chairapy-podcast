import Link from "next/link";
import Container from "../../components/ui/Container";
import EpisodeCard from "../../components/podcast/EpisodeCard";
import EpisodeListRow from "../../components/podcast/EpisodeListRow";
import RandomEpisodeButton from "../../components/podcast/RandomEpisodeButton";
import { getAllEpisodes } from "../../lib/episodes";
import type { Episode } from "../../lib/types";

export const metadata = {
  title: "Every Episode",
  description:
    "Every episode of Eric's ADHD Experience — long-form conversations with people whose stories are worth hearing.",
};

const PAGE_SIZE = 24;

function parsePage(input: string | string[] | undefined): number {
  if (typeof input !== "string") return 1;
  const n = Number.parseInt(input, 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function groupByMonth(episodes: Episode[]): [string, Episode[]][] {
  const groups = new Map<string, Episode[]>();
  for (const ep of episodes) {
    const d = new Date(ep.publishedDate);
    const key = Number.isNaN(d.getTime())
      ? "Undated"
      : d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    const list = groups.get(key) ?? [];
    list.push(ep);
    groups.set(key, list);
  }
  return Array.from(groups.entries());
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

  const hero = currentPage === 1 ? pageItems[0] : null;
  const rest = currentPage === 1 ? pageItems.slice(1) : pageItems;
  const grouped = groupByMonth(rest);

  const allSlugs = all.map((ep) => ep.slug);

  return (
    <Container>
      <div className="py-20 md:py-28">
        {/* Archive header */}
        <header className="flex items-end justify-between flex-wrap gap-6 border-b border-border pb-10">
          <div className="max-w-content">
            <p className="eyebrow">Archive</p>
            <h1
              className="mt-4 font-display text-5xl md:text-6xl text-fg"
              style={{ lineHeight: 0.98, letterSpacing: "-0.035em" }}
            >
              Every Episode
            </h1>
            <p className="mt-4 text-fg-muted tabular">
              {all.length} {all.length === 1 ? "episode" : "episodes"} · most recent first
            </p>
          </div>
          <RandomEpisodeButton slugs={allSlugs} />
        </header>

        {/* First-episode feature on page 1 */}
        {hero && (
          <div className="mt-12">
            <EpisodeCard episode={hero} variant="feature" />
          </div>
        )}

        {/* Dense list rows, grouped by month */}
        {grouped.length > 0 && (
          <div className="mt-14">
            {grouped.map(([month, items]) => (
              <section key={month} className="mb-4">
                <div className="flex items-center gap-4 mt-10 mb-2">
                  <span className="eyebrow tabular">{month}</span>
                  <span
                    aria-hidden="true"
                    className="flex-1 h-px bg-border"
                  />
                </div>
                <ul>
                  {items.map((ep) => (
                    <li key={ep.id}>
                      <EpisodeListRow episode={ep} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            aria-label="Episode pagination"
            className="mt-16 flex items-center justify-between border-t border-border pt-8"
          >
            <PageLink
              page={currentPage - 1}
              disabled={currentPage <= 1}
              label="← Previous"
            />
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <PageLink
                  key={n}
                  page={n}
                  disabled={false}
                  label={String(n)}
                  active={n === currentPage}
                  compact
                />
              ))}
            </div>
            <PageLink
              page={currentPage + 1}
              disabled={currentPage >= totalPages}
              label="Next →"
            />
          </nav>
        )}

        {/* Empty state (currently unreachable — kept for future filtering) */}
        {all.length === 0 && (
          <p className="mt-16 text-center font-serif-body italic text-xl text-fg-muted">
            No episodes yet. Check back soon.
          </p>
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
    ? "inline-flex items-center justify-center px-3 py-1.5 text-sm transition-colors tabular"
    : "inline-flex items-center justify-center px-4 py-2 text-sm transition-colors";

  if (disabled) {
    return (
      <span
        aria-disabled="true"
        className={`${base} text-fg-muted opacity-40 cursor-not-allowed`}
      >
        {label}
      </span>
    );
  }

  const activeClass = active
    ? "text-accent underline underline-offset-8 decoration-2 decoration-accent"
    : "text-fg hover:text-accent";

  const href = page === 1 ? "/episodes" : `/episodes?page=${page}`;

  return (
    <Link href={href} className={`${base} ${activeClass}`}>
      {label}
    </Link>
  );
}
