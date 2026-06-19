import { ReactNode } from "react";

type SizzleHeroProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Homepage hero with the fried-VHS supercut sizzle reel as a muted, looping,
 * autoplaying background. Layer order (back to front):
 *   1. .hero-substrate — the loved neon gradient-mesh, kept as the
 *      reduced-motion / pre-load fallback (its drift animation is already
 *      killed under prefers-reduced-motion in globals.css).
 *   2. <video> — the sizzle reel, poster paints instantly so there's no CLS.
 *   3. .sizzle-hero__vhs — extra scanlines for a stronger fried look here than
 *      the rest of the site.
 *   4. .sizzle-hero__tint — dark purple wash so the headline stays legible.
 *   5. .sizzle-hero__content — the masthead, passed in as children.
 *
 * Under prefers-reduced-motion the video is hidden and the gradient mesh shows.
 */
export default function SizzleHero({ children, className = "" }: SizzleHeroProps) {
  return (
    <section className={`sizzle-hero ${className}`}>
      <div className="hero-substrate" aria-hidden="true" />
      <video
        className="sizzle-hero__video"
        autoPlay
        muted
        loop
        playsInline
        poster="/brand/sizzle-reel-poster.jpg"
        aria-hidden="true"
      >
        <source src="/brand/sizzle-reel.webm" type="video/webm" />
        <source src="/brand/sizzle-reel.mp4" type="video/mp4" />
      </video>
      <div className="sizzle-hero__vhs" aria-hidden="true" />
      <div className="sizzle-hero__tint" aria-hidden="true" />
      <div className="sizzle-hero__content">{children}</div>
    </section>
  );
}
