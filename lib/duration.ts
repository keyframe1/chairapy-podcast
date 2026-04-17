/**
 * Format itunes:duration ("hh:mm:ss" or "mm:ss" or seconds) into a compact
 * listening-time label like "52m" or "1h 35m".
 */
export function formatDurationLabel(
  raw: string | null | undefined,
): string | null {
  if (!raw) return null;
  const parts = raw.split(":").map((p) => Number.parseInt(p, 10));
  let totalSeconds: number;

  if (parts.length === 3) {
    const [h, m, s] = parts;
    if ([h, m, s].some((n) => Number.isNaN(n))) return null;
    totalSeconds = h * 3600 + m * 60 + s;
  } else if (parts.length === 2) {
    const [m, s] = parts;
    if ([m, s].some((n) => Number.isNaN(n))) return null;
    totalSeconds = m * 60 + s;
  } else if (parts.length === 1) {
    const secs = parts[0];
    if (Number.isNaN(secs)) return null;
    totalSeconds = secs;
  } else {
    return null;
  }

  if (totalSeconds < 60) return `${totalSeconds}s`;

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.round((totalSeconds % 3600) / 60);

  if (hours >= 1) {
    return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
