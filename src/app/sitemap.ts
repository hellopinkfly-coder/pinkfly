import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { regionList } from "@/config/regions";
import { regionPath } from "@/lib/region";
import { events } from "@/data/events";
import { getAllEntryPaths } from "@/data/knowledge-base";

/**
 * Every region's every page, so each regional variant is independently
 * crawlable. Paths are generated from the same config the routes use, so a
 * new region or a new entry appears here without another edit.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "/",
    "/about",
    "/join",
    "/events",
    "/knowledge-base",
    "/policies/terms",
    "/policies/refund",
    "/policies/privacy",
    "/policies/community-guidelines",
  ];

  const eventPaths = events.map((event) => `/events/${event.slug}`);
  const entryPaths = getAllEntryPaths().map(
    ({ category, slug }) => `/knowledge-base/${category}/${slug}`
  );

  const now = new Date();

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
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: path === "/" ? (region.slug === "global" ? 1 : 0.9) : 0.7,
      }))
  );
}
