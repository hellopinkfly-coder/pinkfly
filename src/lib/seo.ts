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

/**
 * Share image used when a page supplies none: the PinkFly logo lockup.
 * Resolved against `metadataBase`, so a bare path is enough.
 */
const DEFAULT_OG_IMAGE = "/brand/og-image.png";

export function buildMetadata({
  region,
  path,
  title,
  description,
  image,
  images,
  exact = false,
}: {
  region: Region;
  /** Region-agnostic path, e.g. `/events`. */
  path: string;
  /** Page title WITHOUT the region suffix — one is added for regional sites. */
  title: string;
  description: string;
  /** Share image for this page — an editor's per-page choice in Sanity. */
  image?: string;
  images?: string[];
  /** Skip the automatic region suffix — the title already names the region. */
  exact?: boolean;
}): Metadata {
  const suffixed =
    exact || region.slug === "global"
      ? title
      : `${title} | PinkFly ${region.shortName}`;
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
      images: images ?? [image ?? DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: suffixed,
      description,
      images: images ?? [image ?? DEFAULT_OG_IMAGE],
    },
  };
}

/** Metadata for a region's homepage, which uses the region's own SEO copy. */
export function buildHomeMetadata(
  region: Region,
  seo?: { title: string; description: string; image?: string }
): Metadata {
  return buildMetadata({
    region,
    path: "/",
    // The SEO tab on the Homepage document wins when an editor fills it in;
    // otherwise each regional homepage keeps its own title from the region.
    title: seo?.title ?? region.seo.title,
    description: seo?.description ?? region.seo.description,
    image: seo?.image,
    exact: true,
  });
}
