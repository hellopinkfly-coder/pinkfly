/**
 * CMS-backed collections: events, Knowledge Base entries and regions.
 *
 * Each loader returns the exact type the rest of the app already uses, so the
 * filtering, sorting and routing helpers in `src/data` keep working unchanged.
 * An empty CMS list means "not populated yet" and falls back to the seed data;
 * once Pinkfly adds a document in the Studio the whole list comes from there.
 */
import { cmsFetch } from "./fetch";
import {
  pick,
  resolveImage,
  type CmsFigure,
  type ResolvedImage,
} from "./resolve";
import { eventsQuery, kbEntriesQuery, regionsQuery, siteSettingsQuery } from "./queries";

import {
  events as seedEvents,
  type PinkflyEvent,
  type EventType,
} from "@/data/events";
import {
  kbEntries as seedKbEntries,
  type KbEntry,
  type KbBlock,
  type KbCategory,
} from "@/data/knowledge-base";
import { eventImages, teamPlaceholder } from "@/config/images";
import { regions as seedRegions, type Region, type RegionSlug } from "@/config/regions";

/**
 * The placeholder an editor set in Studio → Site settings, if any.
 *
 * One image for the whole site: articles, events, cards and team members all
 * fall back to it, so changing it there changes it everywhere. The seed image
 * remains the last resort, for an outage or before one is chosen.
 */
async function placeholderImage(): Promise<ResolvedImage | undefined> {
  const { data } = await cmsFetch<{ placeholderImage?: CmsFigure }>(siteSettingsQuery);
  return resolveImage(data?.placeholderImage);
}

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
  description?: unknown[];
  speakers?: { name?: string; designation?: string; image?: CmsFigure }[];
  image?: CmsFigure;
};

export async function getEvents(): Promise<PinkflyEvent[]> {
  const { live, data: cms } = await cmsFetch<CmsEvent[]>(eventsQuery);
  // Sanity answered with an empty list: every event is unpublished, so the
  // site has no events. Only an outage falls back to the seed.
  if (!cms || cms.length === 0) return live ? [] : seedEvents;

  const placeholder = (await placeholderImage()) ?? eventImages.fallback;

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
    image: resolveImage(e.image, placeholder),
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
  /** The opening copy, then the image, then the rest. Portable Text, or the
   * plain strings written before rich text existed. */
  body?: unknown[];
  inlineImage?: CmsFigure;
  bodyAfterImage?: unknown[];
  video?: { url?: string; title?: string };
  /** Downloads, with their assets dereferenced. */
  files?: CmsBodyFile[];
  source?: { name?: string; url?: string };
  policy?: KbEntry["policy"];
  image?: CmsFigure;
};

type CmsBodyFile = {
  title?: string;
  description?: string;
  url?: string;
  name?: string;
  size?: number;
};

/** "1.2 MB" from a byte count, or nothing when Sanity reported no size. */
function formatSize(bytes?: number): string | undefined {
  if (typeof bytes !== "number" || bytes <= 0) return undefined;
  const mb = bytes / 1_000_000;
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1000))} KB`;
}

/**
 * The article in the order it reads: the opening paragraphs, the image between
 * them, the paragraphs after it, then the video and any downloads.
 *
 * Each comes from its own field rather than one mixed array, because Sanity
 * cannot mix plain text with objects in a single array. Anything an editor has
 * left empty simply contributes nothing, so an article with no picture reads as
 * continuous prose.
 */
function resolveBody(entry: CmsKbEntry): KbBlock[] {
  // Portable Text goes through whole so its links survive; a plain-string
  // array is still each string its own paragraph.
  const copy = (value?: unknown[]): KbBlock[] => {
    if (!value || value.length === 0) return [];
    if (typeof value[0] === "string") {
      return (value as string[])
        .filter((line) => line?.trim())
        .map((text) => ({ kind: "paragraph", text }) as const);
    }
    return [{ kind: "rich", value }];
  };

  const image = resolveImage(entry.inlineImage);
  const blocks: KbBlock[] = [
    ...copy(entry.body),
    ...(image
      ? [{ kind: "image", src: image.src, alt: image.alt, caption: image.label } as const]
      : []),
    ...copy(entry.bodyAfterImage),
  ];

  if (entry.video?.url) {
    blocks.push({ kind: "video", url: entry.video.url, title: entry.video.title });
  }

  for (const file of entry.files ?? []) {
    if (!file.url) continue;
    blocks.push({
      kind: "file",
      url: file.url,
      title: file.title || file.name || "Download",
      description: file.description,
      sizeLabel: formatSize(file.size),
    });
  }

  return blocks;
}

export async function getKbEntries(): Promise<KbEntry[]> {
  const { live, data: cms } = await cmsFetch<CmsKbEntry[]>(kbEntriesQuery);
  if (!cms || cms.length === 0) return live ? [] : seedKbEntries;

  const placeholder = await placeholderImage();

  return cms.map((e) => ({
    slug: e.slug ?? "",
    category: e.category ?? "articles",
    title: e.title ?? "",
    excerpt: e.excerpt ?? "",
    author: {
      name: e.author?.name ?? "Pinkfly",
      role: e.author?.role ?? "Contributor",
    },
    publishedAt: e.publishedAt ?? "",
    readingTime: e.readingTime ?? "",
    image: resolveImage(
      e.image,
      placeholder ?? { src: teamPlaceholder, alt: e.title ?? "Knowledge Base entry" }
    ),
    tag: e.tag ?? "",
    body: resolveBody(e),
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
