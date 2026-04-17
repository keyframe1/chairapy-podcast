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
      <div className="py-20 md:py-24">
        <header className="max-w-content">
          <p className="text-xs uppercase tracking-[0.2em] text-fg-muted">
            Guests
          </p>
          <h1 className="mt-4 font-display text-4xl md:text-6xl text-fg leading-tight">
            The People Who've Been On the Show
          </h1>
          <p className="mt-6 text-base md:text-lg text-fg-muted leading-relaxed">
            Every guest here has a story worth hearing. Paramedics, musicians,
            fighters, comedians, working people — the kind of people whose
            stories don't usually make it onto a microphone.
          </p>
        </header>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {guests.map((guest) => (
            <GuestCard key={guest.id} guest={guest} />
          ))}
        </div>
      </div>
    </Container>
  );
}
