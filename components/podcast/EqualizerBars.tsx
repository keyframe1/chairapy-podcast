type EqualizerBarsProps = {
  className?: string;
};

/**
 * Four bars bouncing like an audio equalizer — signals "new / playing".
 * Inherits its colour from the parent via `currentColor` (see `.eq-bar`),
 * so it tints to whatever wraps it (e.g. the acid-green LATEST badge).
 * Decorative; hidden from assistive tech.
 */
export default function EqualizerBars({ className = "" }: EqualizerBarsProps) {
  return (
    <span className={`eq ${className}`} aria-hidden="true">
      <span className="eq-bar" />
      <span className="eq-bar" />
      <span className="eq-bar" />
      <span className="eq-bar" />
    </span>
  );
}
