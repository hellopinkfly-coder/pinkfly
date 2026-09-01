/**
 * Central region configuration.
 *
 * Every regional variant of the site is rendered by the SAME components and
 * the SAME page files — the only thing that changes is the object selected
 * from this map. To add a region, add one entry here and it appears in the
 * region selector, the sitemap, and the hreflang tags automatically.
 *
 * IMPORTANT: contact details that have not been supplied are `null` on
 * purpose, so the UI renders an honest placeholder instead of invented
 * information. Fill them in here and nowhere else. The Pune office address
 * is set on the global and India regions; Dubai and the USA have no office
 * yet, so theirs stay null.
 */

export type RegionSlug = "global" | "india" | "dubai" | "usa";

export type Region = {
  /** Stable key used in URLs. `global` is special — it lives at `/`. */
  slug: RegionSlug;
  /** Display name shown in the region selector. */
  name: string;
  /** Short label for compact UI (navbar chip). */
  shortName: string;
  /** Human location description used in copy and metadata. */
  location: string;
  /** ISO 3166-1 alpha-2 country code (`null` for the global site). */
  countryCode: string | null;
  /** BCP-47 locale used for `hreflang` and `Intl` formatting. */
  locale: string;
  /** Currency used for ticket prices and membership fees. */
  currency: { code: string; symbol: string } | null;
  /** Postal address. `null` until Pinkfly supplies it. */
  address: string[] | null;
  /** Contact phone in E.164-ish display form. `null` until supplied. */
  phone: string | null;
  /** Regional contact inbox. Falls back to the global inbox when `null`. */
  email: string | null;
  /** IANA timezone — used to render event times correctly. */
  timezone: string;
  /** Region-specific copy overrides. */
  copy: {
    heroEyebrow: string;
    /** Kept short — the hero fold is deliberately sparse. */
    heroHeadline: string;
    joinIntro: string;
    eventsIntro: string;
  };
  /** Join Community form configuration for this region. */
  form: {
    /** Region-specific Google Form. Empty = fall back to the global form. */
    googleFormUrl: string;
    /** Tag written to the CRM record so leads can be routed regionally. */
    crmSegment: string;
  };
  /** SEO overrides. */
  seo: {
    title: string;
    description: string;
  };
};

const GLOBAL: Region = {
  slug: "global",
  name: "Global",
  shortName: "Global",
  location: "Worldwide",
  countryCode: null,
  locale: "en",
  currency: null,
  address: [
    "919, Gera's Imperium Rise",
    "Hinjawadi Phase II, Rajiv Gandhi Infotech Park",
    "Hinjawadi, Pune, Maharashtra 411057",
  ],
  phone: null,
  email: "hello.pinkfly@gmail.com",
  timezone: "UTC",
  copy: {
    heroEyebrow: "The Pinkfly community",
    heroHeadline: "You were never meant to build alone.",
    joinIntro: "Women founders worldwide, building businesses and each other.",
    eventsIntro: "Meetups, webinars and coffee chats, across every region.",
  },
  form: {
    googleFormUrl: process.env.NEXT_PUBLIC_JOIN_FORM_URL ?? "",
    crmSegment: "global",
  },
  seo: {
    title: "Pinkfly — Building Dreams",
    description:
      "Pinkfly is a global community for ambitious women entrepreneurs — mentorship, networking, events and education to help you launch, scale and conquer.",
  },
};

const INDIA: Region = {
  slug: "india",
  name: "India",
  shortName: "India",
  location: "India",
  countryCode: "IN",
  locale: "en-IN",
  currency: { code: "INR", symbol: "₹" },
  address: [
    "919, Gera's Imperium Rise",
    "Hinjawadi Phase II, Rajiv Gandhi Infotech Park",
    "Hinjawadi, Pune, Maharashtra 411057",
  ],
  phone: null,
  email: null,
  timezone: "Asia/Kolkata",
  copy: {
    heroEyebrow: "Pinkfly India",
    heroHeadline: "India's women founders, in one room.",
    joinIntro: "Founders building across India, metro to tier-2.",
    eventsIntro: "Pinkfly gatherings hosted across India.",
  },
  form: {
    googleFormUrl: process.env.NEXT_PUBLIC_JOIN_FORM_URL_INDIA ?? "",
    crmSegment: "india",
  },
  seo: {
    title: "Pinkfly India — A community for women entrepreneurs in India",
    description:
      "Pinkfly India connects women entrepreneurs across India with mentorship, founder meetups, masterclasses and a network built to help businesses scale.",
  },
};

const DUBAI: Region = {
  slug: "dubai",
  name: "Dubai (UAE)",
  shortName: "Dubai",
  location: "Dubai, United Arab Emirates",
  countryCode: "AE",
  locale: "en-AE",
  currency: { code: "AED", symbol: "AED" },
  address: null,
  phone: null,
  email: null,
  timezone: "Asia/Dubai",
  copy: {
    heroEyebrow: "Pinkfly Dubai",
    heroHeadline: "Build your business where the world meets.",
    joinIntro:
      "Join women founders and operators building across the UAE.",
    eventsIntro: "Pinkfly gatherings hosted across the UAE.",
  },
  form: {
    googleFormUrl: process.env.NEXT_PUBLIC_JOIN_FORM_URL_DUBAI ?? "",
    crmSegment: "dubai",
  },
  seo: {
    title: "Pinkfly Dubai — A community for women entrepreneurs in the UAE",
    description:
      "Pinkfly Dubai brings together women entrepreneurs across the UAE with mentorship, networking events, masterclasses and a community built for growth.",
  },
};

const USA: Region = {
  slug: "usa",
  name: "United States",
  shortName: "USA",
  location: "United States",
  countryCode: "US",
  locale: "en-US",
  currency: { code: "USD", symbol: "$" },
  address: null,
  phone: null,
  email: null,
  timezone: "America/New_York",
  copy: {
    heroEyebrow: "Pinkfly USA",
    heroHeadline: "Ambition, with people behind it.",
    joinIntro: "Join women founders building across the United States.",
    eventsIntro: "Pinkfly gatherings hosted across the United States.",
  },
  form: {
    googleFormUrl: process.env.NEXT_PUBLIC_JOIN_FORM_URL_USA ?? "",
    crmSegment: "usa",
  },
  seo: {
    title: "Pinkfly USA — A community for women entrepreneurs in the US",
    description:
      "Pinkfly USA connects women entrepreneurs across the United States with mentorship, founder meetups, masterclasses and a network built to help businesses scale.",
  },
};

export const regions: Record<RegionSlug, Region> = {
  global: GLOBAL,
  india: INDIA,
  dubai: DUBAI,
  usa: USA,
};

/** Regions that live at their own URL segment (everything except global). */
export const regionalSlugs = ["india", "dubai", "usa"] as const;

/** Ordered list for the region selector — global first. */
export const regionList: Region[] = [GLOBAL, INDIA, DUBAI, USA];

export const defaultRegion = GLOBAL;
