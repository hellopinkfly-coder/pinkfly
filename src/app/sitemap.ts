import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { regionList } from "@/config/regions";
import { policies } from "@/config/policies";
import { regionPath } from "@/lib/region";
import { kbCategories } from "@/data/knowledge-base";
import { getEvents, getKbEntries } from "@/lib/cms/collections";

/**
 * Every region's every page, so each regional variant is independently
 * crawlable. Paths are generated from the same config the routes use, so a
 * new region or a new entry appears here without another edit.
 *
 * Events and articles come from the CMS — the same `getEvents()` and
 * `getKbEntries()` the pages themselves render from. They used to come from
 * the seed lists in `src/data`, which meant the sitemap described a site that
 * no longer existed: an article published in the Studio was never listed for
 * Google, and a seeded one that had been deleted or hidden was still offered
 * as a live URL. Both getters exclude hidden documents, so unpublishing a
 * post now takes it out of the sitemap too.
 */
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [events, entries] = await Promise.all([getEvents(), getKbEntries()]);

  const staticPaths = [
    "/",
    "/about",
    "/join",
    "/faqs",
    "/events",
    "/knowledge-base",
    // Each category is a page in its own right — where "Show all" leads.
    ...kbCategories.map((category) => `/knowledge-base/${category.id}`),
    // Taken from the policy config rather than written out, so a fifth
    // policy page is listed the moment it is added.
    ...Object.keys(policies).map((slug) => `/policies/${slug}`),
  ];

  const now = new Date();

  // An article's own publication date, so a crawler can tell a post written
  // last year from one published this morning. Everything else has no date
  // of its own and reports when the sitemap was generated.
  const lastModified = new Map<string, Date>();
  for (const entry of entries) {
    if (!entry.publishedAt) continue;
    const date = new Date(entry.publishedAt);
    if (!Number.isNaN(date.getTime())) {
      lastModified.set(`/knowledge-base/${entry.category}/${entry.slug}`, date);
    }
  }

  const eventPaths = events.map((event) => `/events/${event.slug}`);
  const entryPaths = entries.map(
    (entry) => `/knowledge-base/${entry.category}/${entry.slug}`
  );

  return regionList.flatMap((region) =>
    [...staticPaths, ...eventPaths, ...entryPaths]
      // Only list an event under a region that actually hosts it.
      .filter((path) => {
        const match = path.match(/^\/events\/(.+)$/);
        if (!match) return true;
        return events
          .find((e) => e.slug === match[1])
          ?.regions.includes(region.slug);
      })
      .map((path) => ({
        url: `${siteConfig.url}${regionPath(region, path) === "/" ? "" : regionPath(region, path)}`,
        lastModified: lastModified.get(path) ?? now,
        changeFrequency: "weekly" as const,
        priority: path === "/" ? (region.slug === "global" ? 1 : 0.9) : 0.7,
      }))
  );
}
