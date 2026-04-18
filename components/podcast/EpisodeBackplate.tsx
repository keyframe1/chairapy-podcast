import Image from "next/image";

type EpisodeBackplateProps = {
  title: string;
  /** card = square fallback thumbnail; feature = homepage featured art area */
  variant?: "card" | "feature";
  /** Episode number or any int — used for alternating object-position crop rhythm */
  index?: number;
  priority?: boolean;
};

const BACKPLATE_SRC = "/images/brand/episode-backplate-warm.png";

export default function EpisodeBackplate({
  title,
  variant = "card",
  index = 0,
  priority = false,
}: EpisodeBackplateProps) {
  const isFeature = variant === "feature";
  // Alternating crop so repeated backplates read as intentional variation
  const objectPosition = index % 2 === 0 ? "70% 30%" : "30% 70%";

  return (
    <div className="relative w-full h-full overflow-hidden bg-bg-elevated">
      <Image
        src={BACKPLATE_SRC}
        alt=""
        fill
        sizes={
          isFeature
            ? "(max-width: 768px) 100vw, 480px"
            : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        }
        style={{ objectFit: "cover", objectPosition }}
        priority={priority}
      />
      {/* Generous bottom-up charcoal gradient — painterly textures need real coverage */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(44, 36, 24, 0.85) 0%, rgba(44, 36, 24, 0.55) 50%, rgba(44, 36, 24, 0.2) 100%)",
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
            color: "rgba(250, 247, 242, 0.95)",
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
            fontVariationSettings: '"opsz" 144, "SOFT" 80, "WONK" 1',
            textShadow: "0 1px 8px rgba(44, 36, 24, 0.4)",
          }}
        >
          {title}
        </h3>
      </div>
    </div>
  );
}
