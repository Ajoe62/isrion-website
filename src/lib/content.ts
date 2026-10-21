// ---------------------------------------------------------------------------
// Helpers shared by the news and events pages: loading, dates, reading time.
// ---------------------------------------------------------------------------
import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"news">;
export type Event = CollectionEntry<"events">;

// Unpublished items stay visible while you run `npm run dev` and are dropped
// from the production build. Events use a `draft` flag; news uses the CMS
// approval `status`.
const published = (e: { data: { draft: boolean } }) => (import.meta.env.PROD ? !e.data.draft : true);
const approved = (p: Post) => (import.meta.env.PROD ? p.data.status === "published" : true);

/** All published articles, newest first. */
export async function getPosts(): Promise<Post[]> {
  return (await getCollection("news", approved)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
}

/** All published events, in calendar order. */
export async function getAllEvents(): Promise<Event[]> {
  return (await getCollection("events", published)).sort(
    (a, b) => a.data.startDate.valueOf() - b.data.startDate.valueOf(),
  );
}

// Front-matter dates are calendar days ("2026-11-12"), parsed as UTC midnight.
// Everything below works in UTC so a build server in another timezone never
// shifts an event onto the previous day.
const now = new Date();
const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
const lastDay = (e: Event) => e.data.endDate ?? e.data.startDate;

/** True once the event's last day is behind us. Resolved at build time. */
export const hasEnded = (e: Event) => lastDay(e) < today;

/** Upcoming events soonest first; past events most recent first. */
export async function getEvents() {
  const all = await getAllEvents();
  return {
    upcoming: all.filter((e) => !hasEnded(e)),
    past: all.filter(hasEnded).reverse(),
  };
}

const LONG: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };

export const fmtDate = (d: Date, opts: Intl.DateTimeFormatOptions = LONG) =>
  new Intl.DateTimeFormat("en-GB", { ...opts, timeZone: "UTC" }).format(d);

/** "12 November 2026", "12–14 November 2026" or "28 November – 2 December 2026". */
export function fmtRange(start: Date, end?: Date) {
  if (!end || isoDay(end) === isoDay(start)) return fmtDate(start);
  const sameYear = start.getUTCFullYear() === end.getUTCFullYear();
  if (sameYear && start.getUTCMonth() === end.getUTCMonth()) {
    return `${start.getUTCDate()}–${fmtDate(end)}`;
  }
  if (sameYear) return `${fmtDate(start, { day: "numeric", month: "long" })} – ${fmtDate(end)}`;
  return `${fmtDate(start)} – ${fmtDate(end)}`;
}

/** "2026-11-12": for <time datetime>, JSON-LD and the client countdown. */
export const isoDay = (d: Date) => d.toISOString().slice(0, 10);

/** Calendar tile parts for a date: { m: "Nov", d: "12", y: "2026" }. */
export const dateParts = (d: Date) => ({
  m: fmtDate(d, { month: "short" }),
  d: String(d.getUTCDate()),
  y: String(d.getUTCFullYear()),
});

/** Whole minutes at ~220 words a minute, never less than one. */
export const readingTime = (body = "") =>
  Math.max(1, Math.round(body.trim().split(/\s+/).filter(Boolean).length / 220));

/** "Add to Google Calendar" link, as an all-day event spanning the date range. */
export function calendarUrl(e: Event) {
  const compact = (d: Date) => isoDay(d).replace(/-/g, "");
  const endExclusive = new Date(lastDay(e).valueOf() + 86_400_000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: e.data.title,
    dates: `${compact(e.data.startDate)}/${compact(endExclusive)}`,
    details: e.data.summary,
    location: [e.data.venue, e.data.location].filter(Boolean).join(", "),
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}
