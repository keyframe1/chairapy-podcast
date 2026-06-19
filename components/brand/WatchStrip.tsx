import Container from "../ui/Container";
import PromoPlayer from "./PromoPlayer";

/**
 * Homepage "WATCH" strip — a horizontal scroll row of the three vertical promo
 * reels. Used instead of binding each promo to a specific episode page: the
 * reels are show-brand promos and don't map 1:1 to episodes in the data, so
 * they live here as a Watch row. Each card is a neon-bordered tap-to-play
 * player with the fried-VHS hover treatment (see .watch-strip in globals.css).
 */
const PROMOS = [
  {
    src: "/brand/promo-halloween",
    poster: "/brand/promo-halloween-poster.jpg",
    label: "Halloween",
  },
  {
    src: "/brand/promo-cold-exposure",
    poster: "/brand/promo-cold-exposure-poster.jpg",
    label: "Cold Exposure",
  },
  {
    src: "/brand/promo-addiction",
    poster: "/brand/promo-addiction-poster.jpg",
    label: "Addiction & Recovery",
  },
] as const;

export default function WatchStrip() {
  return (
    <section className="py-20 md:py-24 border-t border-border">
      <Container>
        <div className="mb-8">
          <p className="watch-strip__kicker">Watch</p>
          <h2
            className="mt-3 font-display text-3xl md:text-4xl text-fg"
            style={{ lineHeight: 1.05 }}
          >
            Promo reels
          </h2>
        </div>
        <div className="watch-strip" data-reveal>
          {PROMOS.map((promo) => (
            <PromoPlayer
              key={promo.src}
              src={promo.src}
              poster={promo.poster}
              label={promo.label}
              className="watch-strip__card"
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
