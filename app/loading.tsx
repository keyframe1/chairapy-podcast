import Waveform from "../components/podcast/Waveform";
import EqualizerBars from "../components/podcast/EqualizerBars";

/**
 * Branded route-transition loader. Static pages resolve instantly so this is
 * rarely seen, but when a navigation does suspend it shows the show's audio
 * language — a drawing-in waveform over bouncing equalizer bars — instead of
 * a blank screen.
 */
export default function Loading() {
  return (
    <div
      className="min-h-[60vh] flex flex-col items-center justify-center gap-6"
      role="status"
      aria-label="Loading"
    >
      <Waveform width={120} height={40} />
      <span className="text-acid">
        <EqualizerBars />
      </span>
      <p className="eyebrow eyebrow--accent">Loading</p>
    </div>
  );
}
