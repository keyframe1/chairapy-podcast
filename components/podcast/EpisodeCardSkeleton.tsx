/**
 * Dark shimmer placeholder matching the EpisodeCard footprint — square art on
 * top, meta + title + description below. Used by route-level loading states so
 * the layout never flashes white while a page resolves.
 */
export default function EpisodeCardSkeleton() {
  return (
    <div
      className="neon-card overflow-hidden"
      aria-hidden="true"
      style={{ pointerEvents: "none" }}
    >
      <div className="skeleton aspect-square w-full" />
      <div className="p-6">
        <div className="skeleton h-3 w-24 rounded" />
        <div className="skeleton mt-4 h-6 w-3/4 rounded" />
        <div className="skeleton mt-5 h-3 w-full rounded" />
        <div className="skeleton mt-2 h-3 w-5/6 rounded" />
      </div>
    </div>
  );
}
