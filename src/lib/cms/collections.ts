/**
 * CMS-backed collections: events, Knowledge Base entries and regions.
 *
 * Each loader returns the exact type the rest of the app already uses, so the
 * filtering, sorting and routing helpers in `src/data` keep working unchanged.
 * An empty CMS list means "not populated yet" and falls back to the seed data;
 * once PinkFly adds a document in the Studio the whole list comes from there.
 */
import { cmsFetch } from "./fetch";
import { pick, resolveImage, type CmsFigure } from "./resolve";
import { eventsQuery, kbEntriesQuery, regionsQuery } from "./queries";

import {
  events as seedEvents,
  type PinkFlyEvent,
  type EventType,
} from "@/data/events";
import { kbEntries as seedKbEntries, type KbEntry, type KbCategory } from "@/data/knowledge-base";
import { eventImages, teamPlaceholder } from "@/config/images";
import { regions as seedRegions, type Region, type RegionSlug } from "@/config/regions";

/* ================================================================== events */

type CmsEvent = {
  slug?: string;
  title?: string;
  excerpt?: string;
  regions?: string[];
  city?: string;
  venue?: string;
  type?: EventType;
  startsAt?: string;
  durationMinutes?: number;
  format?: "In person" | "Online";
  price?: number;
  registrationUrl?: string;
  whoShouldJoin?: string[];
  whyJoin?: string[];
  description?: string[];
  speakers?: { name?: string; designation?: string; image?: CmsFigure }[];
  image?: CmsFigure;
};

export async function getEvents(): Promise<PinkFlyEvent[]> {
  const { live, data: cms } = await cmsFetch<CmsEvent[]>(eventsQuery);
  // Sanity answered with an empty list: every event is unpublished, so the
  // site has no events. Only an outage falls back to the seed.
  if (!cms || cms.length === 0) return live ? [] : seedEvents;

  return cms.map((e) => ({
    slug: e.slug ?? "",
    title: e.title ?? "",
    excerpt: e.excerpt ?? "",
    regions: (e.regions ?? ["global"]) as RegionSlug[],
    city: e.city ?? "",
    // Null, not an invented venue — the UI has an honest placeholder for it.
    venue: e.venue || null,
    type: e.type ?? "Meetup",
    startsAt: e.startsAt ?? new Date(0).toISOString(),
    durationMinutes: e.durationMinutes ?? 60,
    format: e.format ?? "In person",
    price: typeof e.price === "number" ? e.price : null,
    image: resolveImage(e.image, eventImages.fallback),
    registrationUrl: e.registrationUrl ?? "",
    whoShouldJoin: e.whoShouldJoin ?? [],
    whyJoin: e.whyJoin ?? [],
    description: e.description ?? [],
    speakers: (e.speakers ?? []).map((s) => ({
      name: s.name ?? "",
      designation: s.designation ?? "",
      image: resolveImage(s.image)?.src ?? null,
    })),
  }));
}

/* ================================================== knowledge base entries */

type CmsKbEntry = {
  slug?: string;
  category?: KbCategory;
  title?: string;
  excerpt?: string;
  tag?: string;
  author?: { name?: string; role?: string };
  publishedAt?: string;
  readingTime?: string;
  body?: string[];
  source?: { name?: string; url?: string };
  policy?: KbEntry["policy"];
  image?: CmsFigure;
};

export async function getKbEntries(): Promise<KbEntry[]> {
  const { live, data: cms } = await cmsFetch<CmsKbEntry[]>(kbEntriesQuery);
  if (!cms || cms.length === 0) return live ? [] : seedKbEntries;

  return cms.map((e) => ({
    slug: e.slug ?? "",
    category: e.category ?? "articles",
    title: e.title ?? "",
    excerpt: e.excerpt ?? "",
    author: {
      name: e.author?.name ?? "PinkFly",
      role: e.author?.role ?? "Contributor",
    },
    publishedAt: e.publishedAt ?? "",
    readingTime: e.readingTime ?? "",
    image: resolveImage(e.image, {
      src: teamPlaceholder,
      alt: e.title ?? "Knowledge Base entry",
    }),
    tag: e.tag ?? "",
    body: e.body ?? [],
    source: e.source?.name ? { name: e.source.name, url: e.source.url } : undefined,
    policy: e.policy,
  }));
}

/* ================================================================= regions */

type CmsRegion = {
  slug?: RegionSlug;
  name?: string;
  shortName?: string;
  location?: string;
  heroEyebrow?: string;
  heroHeadline?: string;
  joinIntro?: string;
  eventsIntro?: string;
  address?: string[];
  phone?: string;
  email?: string;
  googleFormUrl?: string;
  crmSegment?: string;
  seo?: { title?: string; description?: string };
};

/**
 * Overlay the CMS's editable region fields onto the static region object.
 *
 * Locale, timezone, currency and the URL slug stay in code: they are wiring,
 * not copy, and an editor changing a timezone string would break date
 * rendering rather than update a message.
 */
export async function getRegionContent(region: Region): Promise<Region> {
  const { data: all } = await cmsFetch<CmsRegion[]>(regionsQuery);
  const cms = all?.find((r) => r.slug === region.slug);
  if (!cms) return region;

  return {
    ...region,
    name: pick(cms.name, region.name),
    shortName: pick(cms.shortName, region.shortName),
    location: pick(cms.location, region.location),
    address: pick(cms.address, region.address ?? undefined) ?? null,
    phone: pick(cms.phone, region.phone ?? undefined) ?? null,
    email: pick(cms.email, region.email ?? undefined) ?? null,
    copy: {
      heroEyebrow: pick(cms.heroEyebrow, region.copy.heroEyebrow),
      heroHeadline: pick(cms.heroHeadline, region.copy.heroHeadline),
      joinIntro: pick(cms.joinIntro, region.copy.joinIntro),
      eventsIntro: pick(cms.eventsIntro, region.copy.eventsIntro),
    },
    form: {
      googleFormUrl: pick(cms.googleFormUrl, region.form.googleFormUrl),
      crmSegment: pick(cms.crmSegment, region.form.crmSegment),
    },
    seo: {
      title: pick(cms.seo?.title, region.seo.title),
      description: pick(cms.seo?.description, region.seo.description),
    },
  };
}

/** Every region, with CMS overlays applied. Used by the sitemap and selector. */
export async function getRegionList(): Promise<Region[]> {
  return Promise.all(Object.values(seedRegions).map(getRegionContent));
}
