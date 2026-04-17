"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type AudioPlayerProps = {
  audioUrl: string;
  title: string;
  episodeNumber: number;
  thumbnailUrl?: string | null;
};

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function AudioPlayer({
  audioUrl,
  title,
  episodeNumber,
  thumbnailUrl,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => setDuration(audio.duration);
    const onTime = () => setCurrent(audio.currentTime);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onWaiting = () => setLoading(true);
    const onPlaying = () => setLoading(false);
    const onEnded = () => setPlaying(false);

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play();
    } else {
      audio.pause();
    }
  }

  function seekTo(e: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current;
    if (!audio) return;
    const next = Number.parseFloat(e.target.value);
    if (Number.isFinite(next)) {
      audio.currentTime = next;
      setCurrent(next);
    }
  }

  function skip(delta: number) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(
      0,
      Math.min(audio.duration || 0, audio.currentTime + delta),
    );
  }

  const progress = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div className="w-full rounded-xl overflow-hidden border border-border bg-bg-elevated">
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        <div className="relative aspect-square w-full sm:w-40 sm:flex-none rounded-lg overflow-hidden bg-bg border border-border">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={`${title} — episode artwork`}
              fill
              sizes="(max-width: 640px) 100vw, 160px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-mono text-accent text-2xl">
                Ep {episodeNumber}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between min-w-0 flex-1 gap-3">
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-[0.2em] text-fg-muted font-mono">
              Episode {episodeNumber}
            </div>
            <div className="mt-1 font-display text-xl text-fg line-clamp-2">
              {title}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => skip(-15)}
              aria-label="Skip back 15 seconds"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full text-fg hover:text-accent transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
            </button>

            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? "Pause" : "Play"}
              className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent text-bg hover:bg-accent-hover transition-colors"
            >
              {loading ? (
                <svg width="20" height="20" viewBox="0 0 24 24" className="animate-spin" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="42" strokeDashoffset="12" strokeLinecap="round" />
                </svg>
              ) : playing ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <polygon points="7,5 19,12 7,19" />
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={() => skip(30)}
              aria-label="Skip forward 30 seconds"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full text-fg hover:text-accent transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10" />
              </svg>
            </button>

            <div className="flex-1 flex items-center gap-2 min-w-0">
              <span className="text-xs font-mono text-fg-muted tabular-nums">
                {formatTime(current)}
              </span>
              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.1}
                value={current}
                onChange={seekTo}
                aria-label="Seek"
                className="flex-1 accent-accent h-1 cursor-pointer"
                style={{
                  background: `linear-gradient(to right, var(--color-accent) ${progress}%, var(--color-border) ${progress}%)`,
                  borderRadius: "2px",
                }}
              />
              <span className="text-xs font-mono text-fg-muted tabular-nums">
                {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <audio ref={audioRef} src={audioUrl} preload="metadata" />
    </div>
  );
}
