import SmileyLoader from "../components/brand/SmileyLoader";

/**
 * Branded route-transition loader. Static pages resolve instantly so this is
 * rarely seen, but when a navigation does suspend it shows the show's spinning
 * smiley mascot instead of a blank screen.
 */
export default function Loading() {
  return (
    <div
      className="min-h-[60vh] flex flex-col items-center justify-center gap-6"
      role="status"
      aria-label="Loading"
    >
      <SmileyLoader size={120} />
      <p className="eyebrow eyebrow--accent">Loading</p>
    </div>
  );
}
