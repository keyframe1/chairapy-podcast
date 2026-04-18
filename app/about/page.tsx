import Link from "next/link";
import Image from "next/image";
import Container from "../../components/ui/Container";
import EricPhoto from "../../components/podcast/EricPhoto";
import EmailSignup from "../../components/podcast/EmailSignup";
import EmailSignupBlock from "../../components/podcast/EmailSignupBlock";
import FleuronOrnament from "../../components/podcast/FleuronOrnament";
import SectionDivider from "../../components/podcast/SectionDivider";
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
      <div className="py-16 md:py-24">
        <FleuronOrnament maxWidth={320} className="mb-10 md:mb-14" />

        {/* About the show — text with vertical accent hanging past the bio */}
        <section>
          <p className="eyebrow">About the show</p>
          <h1
            className="mt-5 font-display text-5xl md:text-6xl text-fg"
            style={{ lineHeight: 0.98, letterSpacing: "-0.035em" }}
          >
            {showInfo.showTagline}
          </h1>

          <div className="relative mt-10">
            {/* Accent — positioned absolute on desktop so it starts at the H1
                baseline above and hangs ~100px past the bio below. On mobile
                it becomes a right-floated 45%-width image with bio text wrap. */}
            <div
              className="sm:float-right sm:w-[45%] sm:ml-6 sm:mb-4 md:float-none md:ml-0 md:mb-0 md:absolute md:right-0 md:-top-24 md:w-[36%] md:h-[calc(100%+160px)] relative aspect-[1/3] md:aspect-auto overflow-hidden"
              aria-hidden="true"
            >
              <Image
                src="/images/brand/sidebar-accent-vertical.png"
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 45vw, 36vw"
                className="object-cover"
              />
            </div>

            <div className="md:pr-[40%]">
              <div
                className="prose-serif drop-cap text-fg"
                style={{ maxWidth: "60ch" }}
              >
                <p>{showInfo.showDescriptionLong}</p>
                <p>
                  The show is produced by {showInfo.productionLabel} in{" "}
                  {showInfo.recordingLocation}.
                </p>
              </div>

              <p className="mt-10 text-sm text-fg-muted font-serif-body italic border-l-2 border-accent pl-4">
                Phase 1 branding — we're keeping the show name during the
                current engagement. Full rebrand coming later.
              </p>
            </div>
            <div className="clear-both" />
          </div>

          <div className="mt-16">
            <EmailSignupBlock>
              <EmailSignup
                headline="Follow the show."
                subheadline="New episodes land in your inbox, no spam."
              />
            </EmailSignupBlock>
          </div>
        </section>

        <SectionDivider />

        {/* About Eric */}
        <section>
          <p className="eyebrow">About {showInfo.hostName}</p>
          <h2
            className="mt-5 font-display text-5xl md:text-6xl text-fg"
            style={{ lineHeight: 0.98, letterSpacing: "-0.035em" }}
          >
            {showInfo.hostName}
          </h2>
          <p className="mt-3 text-sm text-fg-muted tabular">
            {showInfo.hostLocation}
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-10 items-start">
            <EricPhoto
              variant="portrait-01"
              alt={`${showInfo.hostName}, host of ${showInfo.showName}`}
              aspectRatio="4/5"
              priority
            />
            <div className="prose-serif text-fg" style={{ maxWidth: "56ch" }}>
              <p>{showInfo.hostLongBio}</p>
            </div>
          </div>

          <p className="mt-10 text-sm text-fg-muted font-serif-body italic border-l-2 border-border pl-4">
            Recorded on professional broadcast equipment including Blackmagic 6K
            cameras at studio-grade quality.
          </p>
        </section>

        <SectionDivider />

        {/* The Chairapy connection */}
        <section>
          <p className="eyebrow">The Chairapy connection</p>
          <h2
            className="mt-5 font-display text-5xl md:text-6xl text-fg"
            style={{ lineHeight: 0.98, letterSpacing: "-0.035em" }}
          >
            Part of something bigger.
          </h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-[1fr_260px] gap-10 items-start">
            <div className="prose-serif text-fg" style={{ maxWidth: "56ch" }}>
              <p>
                This podcast is produced under the Chairapy brand, which also
                includes a full-service salon in Metairie. Same voice, same
                sensibility — people first, conversation over transaction, no
                polish where honesty will do.
              </p>
              <p>
                <Link
                  href="#"
                  className="text-accent editorial-link underline underline-offset-4"
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
