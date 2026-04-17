"use client";

import { useRouter } from "next/navigation";

type RandomEpisodeButtonProps = {
  slugs: string[];
};

export default function RandomEpisodeButton({
  slugs,
}: RandomEpisodeButtonProps) {
  const router = useRouter();

  function go() {
    if (slugs.length === 0) return;
    const pick = slugs[Math.floor(Math.random() * slugs.length)];
    router.push(`/episodes/${pick}`);
  }

  return (
    <button
      type="button"
      onClick={go}
      className="inline-flex items-center gap-2 eyebrow eyebrow--accent hover:text-accent-hover transition-colors"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <circle cx="8" cy="8" r="1.25" fill="currentColor" stroke="none" />
        <circle cx="16" cy="8" r="1.25" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="1.25" fill="currentColor" stroke="none" />
        <circle cx="8" cy="16" r="1.25" fill="currentColor" stroke="none" />
        <circle cx="16" cy="16" r="1.25" fill="currentColor" stroke="none" />
      </svg>
      <span>Shuffle an episode</span>
    </button>
  );
}
