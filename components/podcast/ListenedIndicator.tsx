"use client";

import { useEffect, useState } from "react";
import { hasListened } from "../../lib/listening-progress";

export default function ListenedIndicator({ slug }: { slug: string }) {
  const [listened, setListened] = useState(false);

  useEffect(() => {
    setListened(hasListened(slug));
    function onChange() {
      setListened(hasListened(slug));
    }
    window.addEventListener("chairapy:listened-changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("chairapy:listened-changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [slug]);

  if (!listened) return null;

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-sage">
      <span aria-hidden="true" className="text-[10px]">◉</span>
      <span className="eyebrow eyebrow--sage" style={{ color: "inherit" }}>
        Listened
      </span>
    </span>
  );
}
