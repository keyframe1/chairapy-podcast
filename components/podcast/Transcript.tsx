import Container from "../ui/Container";

type Props = {
  /** Plain-text transcript. Blank lines separate paragraphs; a leading
   *  "Speaker:" on a paragraph is rendered as a speaker label. */
  transcript: string;
};

// A short leading "Name:" before the spoken text marks a speaker turn. Kept
// deliberately strict (short, no sentence punctuation) so a normal sentence
// that happens to contain a colon isn't mistaken for a speaker label.
const SPEAKER_RE = /^([A-Za-z0-9 .'’\-]{1,40}):\s+([\s\S]+)$/;

function toParagraphs(text: string): string[] {
  return text
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/**
 * Server-rendered, fully indexable episode transcript. The text is real HTML in
 * the SSR'd DOM — it ships inside a native <details> so it's collapsible without
 * any client JS, and the content of a closed <details> still lives in the markup
 * (and in view-source), so crawlers and AI search read every word. This is the
 * SEO play: it turns an audio file + a title into indexable text that can rank
 * for guest names and topics. Renders nothing when there's no transcript, so an
 * episode without one never shows an empty "Transcript" heading.
 */
export default function Transcript({ transcript }: Props) {
  const paragraphs = toParagraphs(transcript);
  if (paragraphs.length === 0) return null;

  return (
    <section className="py-14 border-t border-border" aria-label="Episode transcript">
      <Container width="content">
        <details className="transcript">
          <summary className="transcript__summary">
            <span className="eyebrow eyebrow--accent">Transcript</span>
            <span className="transcript__hint">Read the full conversation</span>
          </summary>
          <div className="transcript__body prose-serif text-fg">
            {paragraphs.map((para, i) => {
              const match = SPEAKER_RE.exec(para);
              if (match) {
                const [, speaker, said] = match;
                return (
                  <p key={i}>
                    <span className="transcript__speaker">{speaker}:</span>{" "}
                    {said.replace(/\n+/g, " ")}
                  </p>
                );
              }
              return <p key={i}>{para.replace(/\n+/g, " ")}</p>;
            })}
          </div>
        </details>
      </Container>
    </section>
  );
}
