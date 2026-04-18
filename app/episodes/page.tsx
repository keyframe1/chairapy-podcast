import Container from "../../components/ui/Container";
import EpisodeCard from "../../components/podcast/EpisodeCard";
import EpisodeListRow from "../../components/podcast/EpisodeListRow";
import LatestEpisodeHero from "../../components/podcast/LatestEpisodeHero";
import RandomEpisodeButton from "../../components/podcast/RandomEpisodeButton";
import { getAllEpisodes } from "../../lib/episodes";
import type { Episode } from "../../lib/types";

export const metadata = {
  title: "Every Episode",
  description:
    "Every episode of Eric's ADHD Experience — long-form conversations with people whose stories are worth hearing.",
};

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

const RECENT_COUNT = 6;

export default function EpisodesPage() {
  const all = getAllEpisodes();
  const latest = all[0];
  const recent = all.slice(1, 1 + RECENT_COUNT);
  const archive = all.slice(1 + RECENT_COUNT);
  const grouped = groupByMonth(archive);
  const allSlugs = all.map((ep) => ep.slug);

  return (
    <Container>
      <div className="py-20 md:py-28">
        {/* Page header */}
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
              {all.length} {all.length === 1 ? "episode" : "episodes"} · new drops monthly
            </p>
          </div>
          <RandomEpisodeButton slugs={allSlugs} />
        </header>

        {/* Latest */}
        {latest && (
          <section className="mt-16 md:mt-20">
            <p className="eyebrow mb-8">Latest</p>
            <LatestEpisodeHero episode={latest} seeAllAnchor="recent" />
          </section>
        )}

        {/* Recent */}
        {recent.length > 0 && (
          <section id="recent" className="mt-20 md:mt-28 scroll-mt-20">
            <p className="eyebrow mb-8">Recent</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {recent.map((ep) => (
                <li key={ep.id}>
                  <EpisodeCard episode={ep} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Archive */}
        {archive.length > 0 && (
          <section className="mt-20 md:mt-28 scroll-mt-20">
            <p className="eyebrow mb-4">
              Archive · {archive.length} episodes
            </p>

            {grouped.map(([month, items]) => (
              <section key={month} className="mb-2">
                <div className="flex items-center gap-4 mt-10 mb-2">
                  <h2 className="eyebrow tabular m-0">{month}</h2>
                  <span aria-hidden="true" className="flex-1 h-px bg-border" />
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
          </section>
        )}

        {/* Empty state — unreachable in practice but kept for safety */}
        {all.length === 0 && (
          <p className="mt-16 text-center font-serif-body italic text-xl text-fg-muted">
            No episodes published yet.
          </p>
        )}
      </div>
    </Container>
  );
}
