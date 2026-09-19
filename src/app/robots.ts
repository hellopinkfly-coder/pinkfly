import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/**
 * What crawlers may read.
 *
 * Everything public is open. Two areas are not: the Studio, which is the
 * admin panel and has no business in a search result, and the API routes,
 * which return JSON rather than pages — a crawler indexing them produces
 * results that lead nowhere and spends the site's crawl budget doing it.
 *
 * Disallow is not a security control: it asks well-behaved crawlers not to
 * index a path, and the Studio's own login is what actually keeps people out.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio", "/studio/", "/api/"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
