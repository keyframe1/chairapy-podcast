/**
 * Show-notes sanitizer.
 *
 * The RSS feed appends a social-follow boilerplate block to most episode
 * descriptions ("Connect with Eric's ADHD Experience on Social: 🔴Follow on
 * Spotify: https://… 🔵Follow on Facebook: …"). That link dump should never
 * render — the styled platform row carries those links instead. This cuts the
 * description at the first boilerplate marker and trims any guest promo URL or
 * emoji bullet left dangling at the very end.
 *
 * Used by the fetch script (so content/episodes.json stores clean copy) and
 * available to render-time consumers as a defensive pass.
 */

const BOILERPLATE_MARKERS = [
  /Connect with Eric'?s ADHD Experience on Social/i,
  /Follow on Spotify:/i,
  /Follow on Apple/i,
  /Follow us on/i,
];

// Trailing run of bare links (http(s) or naked domain + path) and emoji
// bullets, anchored to the end of the string — strips the guest promo link
// left after the boilerplate marker is cut (e.g. "…, LLC: example.com/page").
const TRAILING_LINK_DUMP =
  /(?:\s*[🔴🔵🟣🟢⚫▶️]*\s*(?:https?:\/\/\S+|\b[\w-]+(?:\.[a-z]{2,})+\/\S*)\s*)+$/giu;

// Separators / colons left dangling once a trailing URL is removed.
const TRAILING_SEPARATORS = /[\s:·•—–-]+$/u;

export function cleanShowNotes(raw: string | null | undefined): string {
  if (!raw) return "";
  let cut = raw;

  for (const marker of BOILERPLATE_MARKERS) {
    const idx = cut.search(marker);
    if (idx !== -1) cut = cut.slice(0, idx);
  }

  cut = cut.replace(TRAILING_LINK_DUMP, "").replace(TRAILING_SEPARATORS, "");
  return cut.trim();
}
