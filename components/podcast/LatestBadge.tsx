import EqualizerBars from "./EqualizerBars";

type LatestBadgeProps = {
  className?: string;
};

/**
 * Acid-green glowing pill with live equalizer bars that marks the newest
 * episode unmistakably. The visible "LATEST" word carries the meaning; the
 * bars are decorative.
 */
export default function LatestBadge({ className = "" }: LatestBadgeProps) {
  return (
    <span className={`latest-badge ${className}`}>
      <EqualizerBars />
      <span>Latest</span>
    </span>
  );
}
