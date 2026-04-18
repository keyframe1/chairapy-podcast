import Container from "../../components/ui/Container";
import GuestCard from "../../components/podcast/GuestCard";
import guestsData from "../../content/guests.json";
import type { Guest } from "../../lib/types";

const guests = guestsData as Guest[];

export const metadata = {
  title: "Guests",
  description:
    "The guests who've joined Eric's ADHD Experience — paramedics, musicians, fighters, comedians, working people.",
};

export default function GuestsPage() {
  return (
    <Container>
      <div className="py-20 md:py-28">
        <header className="max-w-content">
          <p className="eyebrow">Who's been on the show</p>
          <h1
            className="mt-4 font-display text-5xl md:text-6xl text-fg"
            style={{ lineHeight: 0.98, letterSpacing: "-0.035em" }}
          >
            Guests
          </h1>
          <p className="mt-6 font-serif-body text-lg md:text-xl text-fg-muted max-w-content" style={{ lineHeight: 1.55 }}>
            Every guest here has a story worth hearing. Paramedics, musicians,
            fighters, comedians, working people — the kind of people whose
            stories don't usually make it onto a microphone.
          </p>
        </header>

        <ul className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12 md:gap-y-14">
          {guests.map((guest) => (
            <li key={guest.slug}>
              <GuestCard guest={guest} />
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}
