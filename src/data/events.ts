/**
 * Event data.
 *
 * Every event declares the regions it belongs to, so the same list powers
 * `/events`, `/india/events`, `/dubai/events` and `/usa/events` without any
 * duplication. Details that PinkFly has not supplied (venue addresses,
 * ticket prices, speakers) are left null/placeholder rather than invented.
 */
import type { RegionSlug } from "@/config/regions";

export type EventType =
  | "Meetup"
  | "Webinar"
  | "Masterclass"
  | "Coffee Chat"
  | "Launch";

export type PinkFlyEvent = {
  slug: string;
  title: string;
  excerpt: string;
  /** Which regional sites list this event. */
  regions: RegionSlug[];
  /** City label shown in the location filter. */
  city: string;
  /** Venue line. `null` until the venue is confirmed. */
  venue: string | null;
  type: EventType;
  /** ISO datetime in UTC. */
  startsAt: string;
  /** Duration in minutes. */
  durationMinutes: number;
  format: "In person" | "Online";
  /** Ticket price in the region's currency. 0 = free, null = TBC. */
  price: number | null;
  image: { src: string; alt: string };
  /** Registration destination. Empty = fall back to the Join Community page. */
  registrationUrl: string;
  whoShouldJoin: string[];
  whyJoin: string[];
  description: string[];
  speakers: {
    name: string;
    designation: string;
    image: string | null;
  }[];
};

const img = (id: string, alt: string) => ({
  src: `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`,
  alt,
});

const SPEAKER_TBC = [
  { name: "Speaker to be announced", designation: "Designation TBC", image: null },
];

export const events: PinkFlyEvent[] = [
  {
    slug: "founder-meetup-autumn",
    title: "PinkFly Founder Meetup",
    excerpt:
      "An evening of introductions, short founder talks and the kind of conversation that only happens in person.",
    regions: ["global", "india"],
    city: "Bengaluru",
    venue: null,
    type: "Meetup",
    startsAt: "2026-09-18T13:00:00.000Z",
    durationMinutes: 180,
    format: "In person",
    price: 0,
    image: img("1511578314322-379afb476865", "Founders at a community meetup"),
    registrationUrl: "",
    whoShouldJoin: [
      "Founders building their first business",
      "Operators considering the jump to founding",
      "Members who want to meet the community in person",
    ],
    whyJoin: [
      "Meet founders at your stage, in your city",
      "Short, practical talks — no panels that run long",
      "Leave with introductions, not just business cards",
    ],
    description: [
      "Placeholder event description. Replace with the final run of show, venue details and agenda once confirmed.",
    ],
    speakers: SPEAKER_TBC,
  },
  {
    slug: "pricing-masterclass",
    title: "Masterclass: Pricing without apologising",
    excerpt:
      "A working session on setting a number, defending it, and building a pricing page that converts.",
    regions: ["global", "india", "dubai", "usa"],
    city: "Online",
    venue: null,
    type: "Masterclass",
    startsAt: "2026-09-25T12:30:00.000Z",
    durationMinutes: 90,
    format: "Online",
    price: null,
    image: img("1591115765373-5207764f72e7", "A speaker delivering a masterclass"),
    registrationUrl: "",
    whoShouldJoin: [
      "Founders about to launch or re-price a product",
      "Service businesses moving from hourly to packaged pricing",
    ],
    whyJoin: [
      "Leave with a priced offer, not just notes",
      "Live teardown of member pricing pages",
    ],
    description: [
      "Placeholder event description. Replace with the final session outline once confirmed.",
    ],
    speakers: SPEAKER_TBC,
  },
  {
    slug: "coffee-chat-october",
    title: "Coffee Chat: mentors on the record",
    excerpt:
      "Small-group conversations with women a stage or two ahead of you. Twelve seats only.",
    regions: ["global", "dubai"],
    city: "Dubai",
    venue: null,
    type: "Coffee Chat",
    startsAt: "2026-10-08T11:00:00.000Z",
    durationMinutes: 120,
    format: "In person",
    price: null,
    image: img("1521737711867-e3b97375f902", "Two founders talking over coffee"),
    registrationUrl: "",
    whoShouldJoin: [
      "Members looking for a mentor match",
      "Founders working through a specific decision",
    ],
    whyJoin: [
      "Twelve seats, so everyone actually speaks",
      "Matched to your stage and sector where possible",
    ],
    description: [
      "Placeholder event description. Replace with the final format and venue once confirmed.",
    ],
    speakers: SPEAKER_TBC,
  },
  {
    slug: "webinar-first-ten-hires",
    title: "Webinar: Your first ten hires",
    excerpt:
      "How to structure an early team, what to pay, and the roles founders consistently hire too late.",
    regions: ["global", "usa"],
    city: "Online",
    venue: null,
    type: "Webinar",
    startsAt: "2026-10-16T16:00:00.000Z",
    durationMinutes: 60,
    format: "Online",
    price: 0,
    image: img("1521737604893-d14cc237f11d", "A team in a hiring discussion"),
    registrationUrl: "",
    whoShouldJoin: [
      "Founders about to make their first hire",
      "Teams of under ten planning next year's headcount",
    ],
    whyJoin: [
      "A hiring plan template you can use the same week",
      "Live Q&A with founders who have hired through it",
    ],
    description: [
      "Placeholder event description. Replace with the final session outline once confirmed.",
    ],
    speakers: SPEAKER_TBC,
  },
  {
    slug: "launch-night-november",
    title: "PinkFly Launch Night",
    excerpt:
      "Six members launch something new on stage. Come for the launches, stay for the room.",
    regions: ["global", "india"],
    city: "Mumbai",
    venue: null,
    type: "Launch",
    startsAt: "2026-11-06T13:30:00.000Z",
    durationMinutes: 210,
    format: "In person",
    price: null,
    image: img("1540575467063-178a50c2df87", "An audience at a launch event"),
    registrationUrl: "",
    whoShouldJoin: [
      "Members launching in the next quarter",
      "Anyone who wants to see what the community is shipping",
    ],
    whyJoin: [
      "Six real launches, five minutes each",
      "The single best night of the year for introductions",
    ],
    description: [
      "Placeholder event description. Replace with the line-up once confirmed.",
    ],
    speakers: SPEAKER_TBC,
  },
  {
    slug: "online-meet-november",
    title: "Online Meet: accountability circle",
    excerpt:
      "Set a goal for the month in a room of twelve, then come back and report on it.",
    regions: ["global", "india", "dubai", "usa"],
    city: "Online",
    venue: null,
    type: "Webinar",
    startsAt: "2026-11-20T13:00:00.000Z",
    durationMinutes: 75,
    format: "Online",
    price: 0,
    image: img("1584036561566-baf8f5f1b144", "A founder on a video call"),
    registrationUrl: "",
    whoShouldJoin: [
      "Members who work better with a deadline and an audience",
    ],
    whyJoin: ["One clear goal, one month, one room that remembers"],
    description: [
      "Placeholder event description. Replace with the final format once confirmed.",
    ],
    speakers: SPEAKER_TBC,
  },
  {
    slug: "new-york-founder-breakfast",
    title: "Founder Breakfast, New York",
    excerpt:
      "An early start with twenty founders, before the day takes over.",
    regions: ["global", "usa"],
    city: "New York",
    venue: null,
    type: "Meetup",
    startsAt: "2026-12-04T13:00:00.000Z",
    durationMinutes: 120,
    format: "In person",
    price: null,
    image: img("1556761175-b413da4baf72", "Founders networking over breakfast"),
    registrationUrl: "",
    whoShouldJoin: ["Founders and operators based in or visiting New York"],
    whyJoin: ["Twenty people, two hours, no programme — just the room"],
    description: [
      "Placeholder event description. Replace with the venue and agenda once confirmed.",
    ],
    speakers: SPEAKER_TBC,
  },
  {
    slug: "abu-dhabi-policy-briefing",
    title: "Policy Briefing for UAE founders",
    excerpt:
      "What changed this year in licensing, hiring and compliance — and what it means for you.",
    regions: ["global", "dubai"],
    city: "Abu Dhabi",
    venue: null,
    type: "Webinar",
    startsAt: "2026-12-11T11:30:00.000Z",
    durationMinutes: 60,
    format: "Online",
    price: 0,
    image: img("1589829545856-d10d557cf95f", "A government building"),
    registrationUrl: "",
    whoShouldJoin: ["Founders registered, or registering, in the UAE"],
    whyJoin: ["A plain-language read of the year's changes"],
    description: [
      "Placeholder event description. Replace with the final briefing outline once confirmed.",
    ],
    speakers: SPEAKER_TBC,
  },
];

export const eventTypes: EventType[] = [
  "Meetup",
  "Webinar",
  "Masterclass",
  "Coffee Chat",
  "Launch",
];

/* ------------------------------------------------------------- Accessors -- */
/** Events visible on a region's site, soonest first. */
/**
 * The accessors below take the event list as their first argument so the same
 * filtering works whether the events came from Sanity or from the seed list
 * in this file. `getEvents()` in `src/lib/cms/collections.ts` supplies the
 * former; the `events` export above is the fallback.
 */
export function filterEventsForRegion(
  list: PinkFlyEvent[],
  region: RegionSlug
): PinkFlyEvent[] {
  return list
    .filter((e) => e.regions.includes(region))
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

export function findEvent(
  list: PinkFlyEvent[],
  slug: string
): PinkFlyEvent | undefined {
  return list.find((e) => e.slug === slug);
}

/** Upcoming events other than the one being viewed. */
export function upcomingEvents(
  list: PinkFlyEvent[],
  region: RegionSlug,
  excludeSlug?: string,
  limit = 4
): PinkFlyEvent[] {
  return filterEventsForRegion(list, region)
    .filter((e) => e.slug !== excludeSlug)
    .slice(0, limit);
}

/** Distinct cities across a region's events — powers the Location filter. */
export function eventCities(list: PinkFlyEvent[], region: RegionSlug): string[] {
  return [...new Set(filterEventsForRegion(list, region).map((e) => e.city))].sort();
}

/** Distinct `YYYY-MM` keys across a region's events — powers the Month filter. */
export function eventMonths(list: PinkFlyEvent[], region: RegionSlug): string[] {
  return [
    ...new Set(filterEventsForRegion(list, region).map((e) => e.startsAt.slice(0, 7))),
  ].sort();
}

/** Distinct event types present in a region — powers the Type filter. */
export function eventTypesForRegion(
  list: PinkFlyEvent[],
  region: RegionSlug
): EventType[] {
  const present = new Set(filterEventsForRegion(list, region).map((e) => e.type));
  return eventTypes.filter((t) => present.has(t));
}
