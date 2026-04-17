import Link from "next/link";
import Container from "../../components/ui/Container";
import EricPhoto from "../../components/podcast/EricPhoto";
import EmailSignup from "../../components/podcast/EmailSignup";
import showInfoData from "../../content/show-info.json";
import type { ShowInfo } from "../../lib/types";

const showInfo = showInfoData as ShowInfo;

export const metadata = {
  title: "About",
  description:
    "About Eric's ADHD Experience — a podcast produced by Chairapy Media in New Orleans.",
};

export default function AboutPage() {
  return (
    <Container width="content">
      <div className="py-20 md:py-24 space-y-24">
        {/* About the show */}
        <section>
          <h1 className="text-xs uppercase tracking-[0.2em] text-fg-muted">
            About the show
          </h1>
          <p className="mt-4 font-display text-4xl md:text-5xl text-fg leading-tight">
            {showInfo.showTagline}
          </p>

          <div className="mt-8 space-y-5 text-base md:text-lg text-fg leading-relaxed">
            <p>{showInfo.showDescriptionLong}</p>
            <p>
              The show is produced by {showInfo.productionLabel} in{" "}
              {showInfo.recordingLocation}.
            </p>
          </div>

          <p className="mt-8 text-sm text-fg-muted border-l-2 border-accent pl-4">
            Phase 1 branding — we're keeping the show name during the current
            engagement. Full rebrand coming later.
          </p>

          <div className="mt-12">
            <EmailSignup
              headline="Follow the show."
              subheadline="New episodes land in your inbox, no spam."
            />
          </div>
        </section>

        {/* About Eric */}
        <section>
          <h2 className="text-xs uppercase tracking-[0.2em] text-fg-muted">
            About {showInfo.hostName}
          </h2>
          <p className="mt-4 font-display text-4xl md:text-5xl text-fg">
            {showInfo.hostName}
          </p>
          <p className="mt-1 text-sm text-fg-muted">{showInfo.hostLocation}</p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8 items-start">
            <EricPhoto
              variant="portrait-01"
              alt={`${showInfo.hostName}, host of ${showInfo.showName}`}
              aspectRatio="4/5"
              priority
            />
            <div className="space-y-5 text-base md:text-lg text-fg leading-relaxed">
              <p>{showInfo.hostLongBio}</p>
            </div>
          </div>

          <p className="mt-8 text-sm text-fg-muted border-l-2 border-border pl-4">
            Recorded on professional broadcast equipment including Blackmagic 6K
            cameras at studio-grade quality.
          </p>
        </section>

        {/* The Chairapy connection */}
        <section>
          <h2 className="text-xs uppercase tracking-[0.2em] text-fg-muted">
            The Chairapy connection
          </h2>
          <p className="mt-4 font-display text-4xl md:text-5xl text-fg">
            Part of something bigger.
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-[1fr_260px] gap-10 items-start">
            <div className="space-y-5 text-base md:text-lg text-fg leading-relaxed">
              <p>
                This podcast is produced under the Chairapy brand, which also
                includes a full-service salon in Metairie. Same voice, same
                sensibility — people first, conversation over transaction, no
                polish where honesty will do.
              </p>
              <p>
                <Link
                  href="#"
                  className="text-accent hover:text-accent-hover underline underline-offset-4"
                >
                  Visit chairapy.org →
                </Link>
              </p>
            </div>
            <EricPhoto
              variant="portrait-03"
              alt="Eric in a Chairapy t-shirt at the salon"
              aspectRatio="square"
            />
          </div>
        </section>
      </div>
    </Container>
  );
}
