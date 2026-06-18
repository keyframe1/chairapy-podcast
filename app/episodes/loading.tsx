import Container from "../../components/ui/Container";
import EpisodeCardSkeleton from "../../components/podcast/EpisodeCardSkeleton";

/**
 * Skeleton screen for the episodes archive. Dark shimmer cards (never white)
 * hold the grid shape while the route resolves.
 */
export default function EpisodesLoading() {
  return (
    <Container>
      <div className="py-20 md:py-28">
        <div className="border-b border-border pb-10">
          <div className="skeleton h-3 w-20 rounded" />
          <div className="skeleton mt-4 h-12 w-72 max-w-full rounded" />
          <div className="skeleton mt-4 h-3 w-48 rounded" />
        </div>

        <div className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <EpisodeCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </Container>
  );
}
