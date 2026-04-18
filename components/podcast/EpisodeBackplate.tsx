import Image from "next/image";

type EpisodeBackplateProps = {
  title: string;
  /**
   * Visual scale:
   *  - card: used as a square fallback thumbnail on episode cards
   *  - feature: used as the larger art area on the homepage featured slot
   */
  variant?: "card" | "feature";
  priority?: boolean;
};

const BACKPLATE_SRC = "/images/brand/episode-backplate-warm.png";

export default function EpisodeBackplate({
  title,
  variant = "card",
  priority = false,
}: EpisodeBackplateProps) {
  const isFeature = variant === "feature";

  return (
    <div className="relative w-full h-full overflow-hidden">
      <Image
        src={BACKPLATE_SRC}
        alt=""
        fill
        sizes={
          isFeature
            ? "(max-width: 768px) 100vw, 480px"
            : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        }
        className="object-cover"
        priority={priority}
      />
      {/* Bottom-up charcoal gradient to guarantee title legibility */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(26, 22, 19, 0.55) 0%, rgba(26, 22, 19, 0.2) 40%, rgba(26, 22, 19, 0) 70%)",
        }}
      />
      <div
        className={`absolute inset-x-0 bottom-0 flex items-end ${
          isFeature ? "p-8 md:p-10" : "p-5"
        }`}
      >
        <h3
          className={`font-display text-left ${
            isFeature ? "text-4xl md:text-5xl" : "text-xl"
          }`}
          style={{
            color: "#FAF7F2",
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
            fontVariationSettings: '"opsz" 144, "SOFT" 80, "WONK" 1',
          }}
        >
          {title}
        </h3>
      </div>
    </div>
  );
}
