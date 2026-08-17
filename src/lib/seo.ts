import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { regionList, regions, type Region } from "@/config/regions";
import { regionPath } from "@/lib/region";

/**
 * Metadata builder for every page.
 *
 * Produces a unique title and description per region, a canonical URL, and a
 * full `hreflang` set so each regional variant of a page points at its
 * siblings (plus `x-default` on the global site). Because the alternates are
 * derived from the region config, adding a region adds its hreflang tags
 * everywhere automatically.
 */

const abs = (path: string) => `${siteConfig.url}${path === "/" ? "" : path}`;

/** hreflang alternates for one logical page across every region. */
export function languageAlternates(path: string): Record<string, string> {
  const alternates: Record<string, string> = {};
  for (const region of regionList) {
    // `en` (the global site) doubles as x-default.
    alternates[region.locale] = abs(regionPath(region, path));
  }
  alternates["x-default"] = abs(regionPath(regions.global, path));
  return alternates;
}

export function buildMetadata({
  region,
  path,
  title,
  description,
  images,
  exact = false,
}: {
  region: Region;
  /** Region-agnostic path, e.g. `/events`. */
  path: string;
  /** Page title WITHOUT the region suffix — one is added for regional sites. */
  title: string;
  description: string;
  images?: string[];
  /** Skip the automatic region suffix — the title already names the region. */
  exact?: boolean;
}): Metadata {
  const suffixed =
    exact || region.slug === "global"
      ? title
      : `${title} | Oinkfly ${region.shortName}`;
  const canonical = abs(regionPath(region, path));

  return {
    title: suffixed,
    description,
    alternates: {
      canonical,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: siteConfig.name,
      title: suffixed,
      description,
      locale: region.locale.replace("-", "_"),
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: suffixed,
      description,
      ...(images ? { images } : {}),
    },
  };
}

/** Metadata for a region's homepage, which uses the region's own SEO copy. */
export function buildHomeMetadata(region: Region): Metadata {
  return buildMetadata({
    region,
    path: "/",
    title: region.seo.title,
    description: region.seo.description,
    exact: true,
  });
}
