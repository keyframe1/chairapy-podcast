/**
 * Lightweight client-only listening progress tracking. Stores a list of
 * episode slugs the user has opened. No backend, no cookies, no sync.
 */

const STORAGE_KEY = "chairapy:listened";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function getListenedSlugs(): string[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === "string");
  } catch {
    return [];
  }
}

export function addListened(slug: string): void {
  if (!isBrowser() || !slug) return;
  try {
    const current = new Set(getListenedSlugs());
    current.add(slug);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(current)));
    window.dispatchEvent(new Event("chairapy:listened-changed"));
  } catch {
    // swallow — progress tracking is best-effort
  }
}

export function hasListened(slug: string): boolean {
  if (!isBrowser() || !slug) return false;
  return getListenedSlugs().includes(slug);
}
