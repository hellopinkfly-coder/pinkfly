import {
  defaultRegion,
  regions,
  regionalSlugs,
  type Region,
  type RegionSlug,
} from "@/config/regions";

/** Type guard for a URL segment that names a region. */
export function isRegionSlug(value: string | undefined): value is RegionSlug {
  return !!value && (regionalSlugs as readonly string[]).includes(value);
}

/** Resolve a URL segment to a region, falling back to the global site. */
export function getRegion(slug?: string): Region {
  return isRegionSlug(slug) ? regions[slug] : defaultRegion;
}

/**
 * Build a path within a region. The global region keeps clean root URLs
 * (`/about`), regional variants are prefixed (`/india/about`).
 */
export function regionPath(region: Region, path = "/"): string {
  const clean = path === "/" ? "" : path;
  if (region.slug === "global") return clean || "/";
  return `/${region.slug}${clean}`;
}

/**
 * Given the current pathname, work out which region is active and what the
 * equivalent path is inside another region. Used by the region selector so a
 * visitor stays on the page they were reading when they switch.
 */
export function parsePathname(pathname: string): {
  region: Region;
  /** The path with any region prefix stripped, e.g. `/events`. */
  rest: string;
} {
  const [, first = "", ...others] = pathname.split("/");
  if (isRegionSlug(first)) {
    return { region: regions[first], rest: "/" + others.join("/") };
  }
  return { region: defaultRegion, rest: pathname };
}

/** Format a price using a region's currency, or return null if unpriced. */
export function formatPrice(region: Region, amount: number | null): string | null {
  if (amount === null) return null;
  if (amount === 0) return "Free";
  if (!region.currency) return null;
  try {
    return new Intl.NumberFormat(region.locale, {
      style: "currency",
      currency: region.currency.code,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${region.currency.symbol}${amount}`;
  }
}

export type { Region, RegionSlug };
