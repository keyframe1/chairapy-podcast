"use client";

import Image from "next/image";
import { useState } from "react";

type Variant =
  | "portrait-01"
  | "portrait-02"
  | "portrait-03"
  | "portrait-04"
  | "hero";

type AspectRatio = "square" | "16/9" | "4/5" | "3/4";

type EricPhotoProps = {
  variant: Variant;
  alt: string;
  aspectRatio?: AspectRatio;
  priority?: boolean;
  /**
   * "portrait" applies the magazine author treatment — soft warm shadow,
   * barely-there vignette, nearly-sharp corners (2px). Reserved for the
   * primary Eric photo on the About page.
   */
  treatment?: "default" | "portrait";
  className?: string;
};

const VARIANT_MAP: Record<Variant, string> = {
  "portrait-01": "/images/eric/portrait-01.jpg",
  "portrait-02": "/images/eric/portrait-02.jpg",
  "portrait-03": "/images/eric/portrait-03.jpg",
  "portrait-04": "/images/eric/portrait-04.jpg",
  hero: "/images/eric/hero.jpg",
};

const ASPECT_CLASS: Record<AspectRatio, string> = {
  square: "aspect-square",
  "16/9": "aspect-video",
  "4/5": "aspect-[4/5]",
  "3/4": "aspect-[3/4]",
};

export default function EricPhoto({
  variant,
  alt,
  aspectRatio = "square",
  priority = false,
  treatment = "default",
  className = "",
}: EricPhotoProps) {
  const [failed, setFailed] = useState(false);
  const src = VARIANT_MAP[variant];
  const isPortrait = treatment === "portrait";
  const frameClass = isPortrait
    ? "eric-portrait-frame bg-bg-elevated"
    : "rounded-md bg-bg-elevated border border-border overflow-hidden";

  return (
    <div
      className={`${ASPECT_CLASS[aspectRatio]} relative ${frameClass} ${className}`}
    >
      {failed ? (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-xs uppercase tracking-[0.2em] text-fg-muted">
            Photo coming soon
          </span>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
          className="object-cover"
          priority={priority}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
