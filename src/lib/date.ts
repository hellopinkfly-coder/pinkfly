import type { Region } from "@/config/regions";

/**
 * Date helpers. Everything is stored as UTC ISO strings and rendered in the
 * active region's timezone and locale, so an event reads correctly wherever
 * it is being viewed from.
 */

export function formatEventDate(iso: string, region: Region): string {
  return new Intl.DateTimeFormat(region.locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: region.timezone,
    timeZoneName: "short",
  }).format(new Date(iso));
}

export function formatEventDay(iso: string, region: Region): string {
  return new Intl.DateTimeFormat(region.locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: region.timezone,
  }).format(new Date(iso));
}

export function formatEventTime(iso: string, region: Region): string {
  return new Intl.DateTimeFormat(region.locale, {
    hour: "numeric",
    minute: "2-digit",
    timeZone: region.timezone,
    timeZoneName: "short",
  }).format(new Date(iso));
}

/** "1h 30m" from a minute count. */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

/** `YYYY-MM` → "September 2026", for the month filter. */
export function formatMonthKey(key: string, locale = "en"): string {
  const [year, month] = key.split("-").map(Number);
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}
