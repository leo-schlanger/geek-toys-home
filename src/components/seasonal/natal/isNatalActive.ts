/**
 * Christmas theme window: from 13 Nov until the end of 26 Dec in Rio
 * (UTC-3, no DST), i.e. [start, end). Turns itself off, no deploy needed.
 */
export const NATAL_WINDOW = {
  start: "2026-11-13T00:00:00Z",
  end: "2026-12-27T03:00:00Z",
} as const;

export type NatalWindow = { start: string; end: string };
export type SeasonOverride = "natal" | "off" | null;

/** Pure: takes the clock and the window so it can be tested without mocks. */
export function isNatalActive(now: Date = new Date(), window: NatalWindow = NATAL_WINDOW): boolean {
  const t = now.getTime();
  const start = Date.parse(window.start);
  const end = Date.parse(window.end);
  if (Number.isNaN(t) || Number.isNaN(start) || Number.isNaN(end)) return false;
  return t >= start && t < end;
}

/** `?season=natal|off` (qa only). Anything else means "follow the date". */
export function parseSeasonOverride(search: string): SeasonOverride {
  const value = new URLSearchParams(search).get("season");
  return value === "natal" || value === "off" ? value : null;
}

/** Date window plus the qa override. */
export function resolveNatal(now: Date, search: string, window: NatalWindow = NATAL_WINDOW): boolean {
  const override = parseSeasonOverride(search);
  if (override === "natal") return true;
  if (override === "off") return false;
  return isNatalActive(now, window);
}

export const NATAL_BANNER_DISMISS_KEY = "natal-banner-dismissed:2026";
